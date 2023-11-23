import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { Auth } from 'aws-amplify';

//Branded Theme
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../../branding';

import Header from '../../components/AppBar/AppBar';
import { setIsClientLoaded, setLang, setUser } from '../../redux/actions';
import { useNavigate } from 'react-router-dom';
import { useAuthenticator } from '@aws-amplify/ui-react';
import ChangePassword from './ChangePassword';
import { getClientDetails } from '../../index';

const mapStateToProps = (state) => {
    return {
        lang: state.app.lang,
        auth: state.app.auth,
        user: state.user,
        isClientLoaded: state.app.isClientLoaded
    };
};

function Settings(props) {
    const navigate = useNavigate();
    const { user } = useAuthenticator((context) => [context.user]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        if (props.isClientLoaded) {
            setIsLoading(false);
            return;
        }

        getClientDetails(props.clientId).then((client) => {
            props.setIsClientLoaded(true);
            setIsLoading(false);
        });
        // NOTE: Using effect on changing of client ID or loading status
        // recheck dependencies if effect is updated.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.clientId, isLoading]);

    React.useEffect(() => {
        loadUserAttributes();
        // NOTE: Using effect on change of user
        // recheck dependencies if effect is updated.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const handleRoutePush = (newPath) => {
        navigate(newPath);
    };

    function loadUserAttributes() {
        Auth.currentUserInfo()
                .then((user) => {
                    props.setUser(user);

                    /*
                     * If the user locale different to i18n language,
                     * set i18n language to user locale
                     */
                    if (user.attributes.locale && (user.attributes.locale !== props.lang))
                        props.setLang(user.attributes.locale);
                })
                .catch(err => {
                    console.log(err);
                });
    };

    return (
            <ThemeProvider theme={theme}>
                <Header
                        routeTo={(newPath) => handleRoutePush(newPath)}
                />
                {props.op === 'password' && <ChangePassword/>}
            </ThemeProvider>
    );
};

export default connect(mapStateToProps, { setUser, setLang, setIsClientLoaded })(Settings);
