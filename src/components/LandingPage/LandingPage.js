/*
  * Copyright Amazon.com, Inc. and its affiliates. All Rights Reserved.
  * SPDX-License-Identifier: MIT
  *
  * Licensed under the MIT License. See the LICENSE accompanying this file
  * for the specific language governing permissions and limitations under
  * the License.
  */

import React from 'react';
import { connect } from 'react-redux';
import { setAuth, setUser } from '../../redux/actions';

import checkForceAuth from './helpers/checkForceAuth';
import handleAuthUIStateChange from './helpers/handleAuthStateChange';

import SignInContainer from './signInContainer';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Hub, Logger } from 'aws-amplify';

const logger = new Logger('LandingPage');
const mapStateToProps = (state) => {
    return {
        auth: state.app.auth,
        user: state.user,
        email_verified: state.user?.attributes?.email_verified,
        userPrefRememberDevice: state.app.userPrefRememberDevice,
        app: state.app
    };
};


const LandingPage = (props) => {
    const location = useLocation();
    const [loaded, setLoaded] = React.useState(false);
    const { route } = useAuthenticator(context => [context.route]);
    const { authStatus } = useAuthenticator(context => [context.authStatus]);
    const [askToRememberDevice, setAskToRememberDevice] = React.useState(false);
    const navigate = useNavigate();
    const propClient = props.client;

    const hexEncode = function (string) {
        var hex, i;

        var result = "";
        for (i = 0; i < string.length; i++) {
            hex = string.charCodeAt(i).toString(36);
            result += ("000" + hex).slice(-4);
        }
        return result
    }

    Hub.listen('RememberDevice', (data) => {
        const { payload } = data;
        logger.debug(props)
        logger.debug("RememberDevice value changed to: ", payload.state)
        let _ask = !props.userPrefRememberDevice || !payload.state
        logger.debug("RememberDevice value changed to: ", payload.state, "and ask to:", _ask)
        setAskToRememberDevice(_ask)
    })

    Hub.listen('auth', async (data) => {
        if (data?.payload?.event === "forgotPasswordSubmit") {
            let user = data.payload.data.username;
            let poolId = data.payload.data.pool.userPoolId;
            let headerData = hexEncode(btoa(`${user}:${poolId}`))
            await fetch('/oauth2/unauth', {
                method: 'POST',
                headers: { 'X-UnAuth': headerData },
                body: JSON.stringify({})
            })
        }
    })

    // Ensure authstate check is performed on load as well
    // NOTE: Run effect once on component mount, please
    // recheck dependencies if effect is updated.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    React.useEffect(() => check, [])

    React.useEffect(() => {
        check();
        // NOTE: Stopping from complaining to add check as dependency
        // recheck dependencies if effect is updated.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authStatus, askToRememberDevice, props.email_verified]);

    async function check() {
        checkForceAuth();
        // following function needs to be called for proper redirection to take place
        // whenever there is change in state of AuthenticationStatus, EmailVerification Status, RememberDeviceStatus or its Pref
        await handleAuthUIStateChange(authStatus, props, navigate, location, setAskToRememberDevice);
        setLoaded(true);
    }

    return (
            <SignInContainer authState={route} loaded={loaded} client={propClient}
                             askToRememberDevice={askToRememberDevice}
            />
    );
};

export default connect(mapStateToProps, { setAuth, setUser })(LandingPage);
