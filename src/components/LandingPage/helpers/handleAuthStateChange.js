import { Auth, Logger } from 'aws-amplify';

import { setRefreshTokenCookie, setTokenCookie, storeTokens } from './tokenHelper';
import { eraseCookie } from './cookieHelper';
import { AuthState } from '../../../App';
import { loadUserAttributes } from '../../../index';
import { checkDeviceRemembered } from "../../RememberDeviceDialog/helpers/rememberDeviceHelper";

const logger = new Logger('AuthStateChange');
export const eraseCookies = () => {
    logger.debug("Erasing Tokens")
    eraseCookie('id_token');
    eraseCookie('access_token');
    eraseCookie('refresh_token');

};

function check_auth_params() {
    let queryStringParams = new URLSearchParams(window.location.search);
    let qsRedirectUri = queryStringParams.get('redirect_uri');
    let qsAuthorizationCode = queryStringParams.get('authorization_code');
    let qsClientState = queryStringParams.get('state');
    let qsNonce = queryStringParams.get('nonce');
    let qsIdp = queryStringParams.get('idp');
    /*
     * For a local sign in the redirect_uri/authorization_code will be in the query string params
     */
    let redirect_uri, authorization_code, clientState, nonce, idp;
    if (qsRedirectUri) {
        redirect_uri = qsRedirectUri;
        authorization_code = qsAuthorizationCode;
        clientState = qsClientState;
        nonce = qsNonce;
        idp = qsIdp
    } else {
        redirect_uri = localStorage.getItem('client-redirect-uri');
        authorization_code = localStorage.getItem('authorization_code');
        clientState = localStorage.getItem('client-state');
        nonce = localStorage.getItem('nonce');
        idp = localStorage.getItem('idp');
        localStorage.removeItem(`client-redirect-uri`);
        localStorage.removeItem(`authorization_code`);
        localStorage.removeItem(`client-state`);
    }
    return { redirect_uri, authorization_code, clientState, nonce, idp };
}

async function handlePKCE(authorization_code, authInfo, redirect_uri, clientState, nonce, idp) {
    /*
     * PKCE Flow
     */
    let idToken = authInfo.idToken.jwtToken;
    let accessToken = authInfo.accessToken.jwtToken;
    let refreshToken = authInfo.refreshToken.token;

    logger.log('[handleAuthUIStateChange]: PKCE Flow');

    //Store tokens in DynamoDB
    const response = await storeTokens(authorization_code, idToken, accessToken, refreshToken);

    if (response.status === 200) {
        let nextUrl = redirect_uri + '/?code=' + authorization_code + ((clientState !== undefined) ? '&state=' + clientState : '') + ((nonce !== undefined) ? '&nonce=' + nonce : '') + ((idp !== undefined) ? '&idp=' + idp : '');
        logger.debug("PKCE: Redirecting to ", nextUrl);
        window.location.replace(nextUrl);
    } else {
        logger.error('Could not store tokens. Server response: ' + response.data);
    }
}

function handleImplicit(redirect_uri, idToken, clientState, nonce, idp) {
    /*
     * Implicit Flow
     */
    logger.log('[handleAuthUIStateChange]: Implicit Flow');
    let nextUrl = redirect_uri + '/?id_token=' + idToken + ((clientState !== undefined) ? '&state=' + clientState : '') + ((nonce !== undefined) ? '&nonce=' + nonce : '') + ((idp !== undefined) ? '&idp=' + idp : '');
    logger.debug("Implicit: Redirecting to ", nextUrl);
    window.location.replace(nextUrl);
}

function checkPKCE(authorization_code, redirect_uri) {
    return authorization_code && redirect_uri;
}

function checkTokens(idToken, accessToken, refreshToken) {
    return idToken && accessToken && refreshToken;
}

async function processAuthenticatedSession(authorization_code, redirect_uri, clientState, nonce, idp, navigate) {
    /*
     * get the current user session
     */
    let authInfo = await Auth.currentSession();

    let idToken = authInfo.idToken.jwtToken;
    let accessToken = authInfo.accessToken.jwtToken;
    let refreshToken = authInfo.refreshToken.token;

    /*
     * Set the ID and access token cookies for fast SSO
     */
    if (checkTokens(idToken, accessToken, refreshToken)) {
        setTokenCookie('id_token', idToken);
        setTokenCookie('access_token', accessToken);

        /*
         * Set the refresh token cookie. Refresh token cannot be parsed for an expiry so use the access token to get an expiry.
         * Although the refresh token has a different (longer) expiry than the access token, this is for the purpose of fast SSO,
         * so the refresh token cookie will get set again when the id or access token cookie expires
         */
        setRefreshTokenCookie(refreshToken, accessToken);
    } else {
        logger.error('Inconsistent application state: Tokens missing from current session');
        return;
    }

    if (checkPKCE(authorization_code, redirect_uri)) {
        await handlePKCE(authorization_code, authInfo, redirect_uri, clientState, nonce, idp);
    } else if (redirect_uri) {
        handleImplicit(redirect_uri, idToken, clientState, nonce, idp);
    } else {
        /*
         * Sign in directly to broker (not from redirect from client as part of oauth2 flow)
         */
        logger.debug('[handleAuthUIStateChange]: Direct SignIn');

        navigate('/dashboard');
    }
}

async function processAuthenticated(props, setAskToRememberDevice, location, navigate) {
    logger.log('[handleAuthUIStateChange]: User authenticated', props);
    let user = await loadUserAttributes();
    if (!user || Object.keys(user).length === 0) {
        // Probably user tokens have expired
        eraseCookies();
        // We need to force Auth.signOut as route needs to be reset
        await Auth.signOut();
    }

    let isFederatedSignIn = (/true/i).test(localStorage.getItem('amplify-signin-with-hostedUI'));
    let redirect_uri;
    let authorization_code;
    let clientState;
    let nonce;
    let idp;
    const __ret = check_auth_params();
    redirect_uri = __ret.redirect_uri;
    authorization_code = __ret.authorization_code;
    clientState = __ret.clientState;
    nonce = __ret.nonce;
    idp = __ret.idp;

    // Change Auth status after we have retrieved isFederatedSignIn as email verification depends on this.
    props.setAuth(true);

    // Skip Device Verification and Email Verification Check for
    // Federated Sign In User

    if (!isFederatedSignIn) {
        // Check if user attribute verification is pending
        // Skip email_verification check for user with linked identities, as s/he may be a Federated User
        let emailVerified = user?.attributes?.email_verified || false
        logger.debug("Email verified?", emailVerified)
        if (!emailVerified) {
            logger.debug('Awaiting email verification');
            return;
        }
        logger.debug("User Pref for remembering device:", props.userPrefRememberDevice)
        if (props.userPrefRememberDevice) {
            let deviceRemembered = await checkDeviceRemembered()
            logger.debug("Device is remembered?", deviceRemembered)
            // Present option to RememberDevice
            if (!deviceRemembered) {
                logger.debug("Awaiting Remember Device Choice")
                setAskToRememberDevice(true);
                return;
            }
        }
    } else {
        logger.debug("FederatedSignIn detected: RememberDevice and EmailVerified checks will be skipped")
    }
    /* For a login redirected by another component */
    if (location?.state?.authReqLocation) {
        logger.log('Navigating to : ', location.state.authReqLocation);
        navigate(location.state.authReqLocation);
        return;
    }
    await processAuthenticatedSession(authorization_code, redirect_uri, clientState, nonce, idp, navigate);
}

const handleAuthUIStateChange = async (authState, props, navigate, location, setAskToRememberDevice) => {

    if (authState === AuthState.SignOut) {
        logger.debug(authState);
        eraseCookies();
        return;
    }


    if (authState === AuthState.Authenticated) {
        await processAuthenticated(props, setAskToRememberDevice, location, navigate);
    }
};

export default handleAuthUIStateChange;
