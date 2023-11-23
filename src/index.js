import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import { Amplify, Auth } from 'aws-amplify';
import { Authenticator, Grid, Loader, ThemeProvider, useTheme, View } from '@aws-amplify/ui-react';
import App from './App';

import * as serviceWorker from './serviceWorker';
import awsconfig from './aws-exports';

import './index.css';
import Dashboard from './pages/Dashboard/Dashboard';
import Logout from './pages/Logout/Logout';
import Settings from './pages/Settings/Settings';
import { amplifyTheme } from './branding';
import { RequireAuth } from './components/RequireAuth/requireAuth';
import { setIsClientLoaded, setLang, setUser } from './redux/actions';
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import axios from "axios";

export const MissingClientID = () => {
    const { tokens } = useTheme();
    return (
            <><View height={'100%'}>
                <Grid
                        spacing={0}
                        direction='column'
                        alignItems='center'
                        justify='center'
                        style={{ paddingBottom: tokens.space.medium.value }}
                >

                    <h1 style={{ textAlign: 'center', color: tokens.colors.font.error }}>Error: Invalid
                        access</h1>
                </Grid>
            </View>
            </>
    );
};

export const LoaderColor = () => {
    const { tokens } = useTheme();
    return (
            <>
                <Loader
                        variation='linear'
                        emptyColor={tokens.colors.black}
                        filledColor={tokens.colors.orange[40]}
                />
            </>
    );
};
const Config = require('Config');

let amplifyConfig = {
    ...awsconfig,
    Auth: {
        // OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
        authenticationFlowType: Config.authenticationFlowType !== undefined ? Config.authenticationFlowType : 'USER_SRP_AUTH'
    },
    API: {
        endpoints: awsconfig.aws_cloud_logic_custom
    },
};

// If we have in parameter that means start a PKCE or Implict flow
// We switch the clientId to submit the one from the client website
let queryStringParams = new URLSearchParams(window.location.search);
let clientId = queryStringParams.get('client_id') || queryStringParams.get('clientId');
const redirect_uri = queryStringParams.get("redirect_uri");
clientId = clientId || localStorage.getItem('client-id');

// React Dom root

const root = ReactDOM.createRoot(document.getElementById('root'));
if (clientId) {
    localStorage.setItem('client-id', clientId);
    // We configure the Amplify Auth component in the context of using a client website client-id
    // if no clientId is found (direct login not from a client) the web client id of the broker will be used as default
    amplifyConfig.aws_user_pools_web_client_id = clientId;
}
Amplify.configure(amplifyConfig);

/*
 * App Routing
 * With "ProtectedRoute" we redirect user to Login if they are not signed in and _
 * we redirect user to Terms of Service (ToS) if a user not accepted the current ToS
 *
 * If we route to a none existing page we will redirect to the "ErrorPage"
 */
export const isEmpty = (value) => (
        (!value && value !== 0 && value !== false)
        || (Array.isArray(value) && value.length === 0)
        || (isObject(value) && Object.keys(value).length === 0)
        || (typeof value.size === 'number' && value.size === 0)

        // `WeekMap.length` is supposed to exist!?
        || (typeof value.length === 'number' && typeof value !== 'function' && value.length === 0)
);


// Return where a value is truly an object.
// Source: https://levelup.gitconnected.com/javascript-check-if-a-variable-is-an-object-and-nothing-else-not-an-array-a-set-etc-a3987ea08fd7
export const isObject = (value) => Object.prototype.toString.call(value) === '[object Object]';


export const loadUserAttributes = async () => {
    return Auth.currentUserInfo()
            .then((user) => {
                if (isEmpty(user)) {
                    return null;
                }
                store.dispatch(setUser(user));
                /*
                 * If the user locale different to i18n language,
                 * set i18n language to user locale
                 */
                if (user?.attributes?.locale)
                    store.dispatch(setLang(user.attributes.locale));

                return user;
            })
            .catch(err => {
                console.error('currentUserInfo', err);
                return null;
            });
};

root.render(
        <React.StrictMode>
            <Provider store={store}>
                <Authenticator.Provider>
                    <BrowserRouter>
                        <Routes>
                            <Route path='/logout' element={<Logout/>}/>
                            (clientId &&
                            <Route path='/dashboard' element={<ThemeProvider theme={amplifyTheme}
                                                                             height={'100%'}><RequireAuth><Dashboard/></RequireAuth></ThemeProvider>}/>
                            <Route path='/password'
                                   element={<ThemeProvider theme={amplifyTheme}
                                                           height={'100%'}><ProtectedRoute path='/password'
                                                                                           component={Settings}
                                                                                           clientId={clientId}
                                                                                           op={'password'}
                                                                                           reloadUserData={loadUserAttributes}/>

                                   </ThemeProvider>}
                            />
                            <Route path='/'
                                   element={<ThemeProvider theme={amplifyTheme} height={'100%'}><App
                                           clientId={clientId}
                                           reloadUserData={loadUserAttributes}
                                           search={window.location.search}/></ThemeProvider>}/>)
                        </Routes>
                    </BrowserRouter>
                </Authenticator.Provider>
            </Provider>
        </React.StrictMode>
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://create-react-app.dev/docs/making-a-progressive-web-app
serviceWorker.unregister();

export async function getClientDetails(client_id) {
    const path = `/clientDetails`;
    if (!client_id || !redirect_uri) {
        return {};
    }
    const queryStringParameters = {
        client_id: client_id
    };

    const amplifyConfig = Amplify.configure();
    return axios.get(path, {
        params: queryStringParameters
    })
            .then(response => {
                if (!response.data.callbackUrLs.includes(redirect_uri)) {
                    throw new Error("invalid callback url");
                }
                let policy = response.data.pol.split('.');
                let amplifyPasswordConfig = {
                    passwordPolicyMinLength: policy[0],
                    passwordPolicyCharacters: []
                };
                if (policy[1] !== '0' && policy[1] !== 'false') amplifyPasswordConfig.passwordPolicyCharacters.push('REQUIRES_LOWERCASE');
                if (policy[2] !== '0' && policy[2] !== 'false') amplifyPasswordConfig.passwordPolicyCharacters.push('REQUIRES_NUMBERS');
                if (policy[3] !== '0' && policy[3] !== 'false') amplifyPasswordConfig.passwordPolicyCharacters.push('REQUIRES_SYMBOLS');
                if (policy[4] !== '0' && policy[4] !== 'false') amplifyPasswordConfig.passwordPolicyCharacters.push('REQUIRES_UPPERCASE');
                amplifyConfig['aws_cognito_password_protection_settings'] = amplifyPasswordConfig;
                setIsClientLoaded(true);
                return {
                    client_id: client_id, supportedIdPs: response.data.IDPs, customizations: response.data.customization
                };
            })
            .catch(err => {
                console.error(err);
            });
}
