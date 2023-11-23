import React, { useEffect, useState } from 'react';
import { I18n, Logger } from 'aws-amplify';

import '@aws-amplify/ui-react/styles.css';

import LandingPage from './components/LandingPage/LandingPage';
import { connect } from 'react-redux';
import { setIsClientLoaded, setLang } from './redux/actions';

import i18nStrings from './i18n/i18n';
import { getClientDetails, LoaderColor, loadUserAttributes, MissingClientID } from './index';
import ChangePassword from './pages/Settings/ChangePassword';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useLocation, useSearchParams } from "react-router-dom";

const logger = new Logger('App');
// Possible values for useAuthenticator => to access route string that represents the current authState
export const AuthState = {
    Authenticated: 'authenticated',
    Idle: 'idle',
    Setup: 'setup',
    SignOut: 'signOut',
    SignIn: 'signIn',
    SignUp: 'signUp',
    ConfirmSignUp: 'confirmSignUp',
    ConfirmSignIn: 'confirmSignIn',
    ForceNewPassword: 'forceNewPassword',
    ResetPassword: 'resetPassword',
    ConfirmResetPassword: 'confirmResetPassword',
    VerifyUser: 'verifyUser',
    ConfirmVerifyUser: 'confirmVerifyUser',
    TOTPSetup: 'setupTOTP'
};
I18n.putVocabularies(i18nStrings);


/*
 *  Load Default Language
 * Check Browser Language: If it exists in i18n then use the Browser Language, else use default "en"
 */
const loadDefaultLanguage = () => {
    const navLang = navigator.language.substr(0, 2);

    if (i18nStrings.hasOwnProperty(navLang)) return navLang;

    return 'en';
};

/*
 * Map lang state to p
 */
const mapStateToProps = (state) => {
    return {
        lang: state.app.lang,
        isClientLoaded: state.isClientLoaded
    };
};

function App(props) {
    const location = useLocation();
    const { authStatus } = useAuthenticator((context) => [context.authStatus]);
    const [isLoading, setIsLoading] = useState(true);
    const [clientDetails, setClientDetails] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        //     runonce
        let qParams = new URLSearchParams(props.search);
        let qParamKeys = Array.from(qParams.keys())
        let searchParamKeys = Array.from(searchParams.keys())
        if (props.search) {
            for (const p of qParamKeys) {
                if (!(searchParamKeys.includes(p))) {
                    let val = qParams.getAll(p);
                    console.log("Appending missing search parameter ", p, " with ", val)
                    setSearchParams((prev) => {
                        prev.set(p, val);
                        return prev;
                    });
                }
            }
        }
        if (!props.isClientLoaded) {
            getClientDetails(props.clientId).then((client) => {
                logger.debug("Loading Client Details")
                setClientDetails(client);
                props.setIsClientLoaded(true);
            }).then(async () => {
                logger.debug("Checking access token validity")
                // Attempt to load user attributes
                // This should ensure that we have correct user state
                let attrs = await loadUserAttributes();
                logger.debug("Current User Attributes: ", attrs)
            }).finally(() => {
                setIsLoading(false);
            });
        }
        // NOTE: Run effect once on component mount, please
        // recheck dependencies if effect is updated.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    useEffect(() => {
        setLang(loadDefaultLanguage());
    }, [props.lang]);

    function conditionalRender() {
        if (isLoading) {
            return <LoaderColor/>;
        } else if (props.clientId === undefined || props.clientId === null ||
                clientDetails === undefined || clientDetails === null || clientDetails?.supportedIdPs.length === 0) {
            return <MissingClientID/>;
        } else if (location.state?.authReqLocation?.pathname === '/password' && authStatus === 'authenticated') {
            return <ChangePassword/>;
        }
        return <LandingPage client={clientDetails}/>;
    }

    return (
            conditionalRender()
    );
}

export default connect(mapStateToProps, { setLang, setIsClientLoaded })(App);
