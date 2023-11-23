import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { Auth, I18n } from 'aws-amplify';

import { AccountSettings, Button, Flex, useTheme, View } from '@aws-amplify/ui-react';


import { Branding } from '../../branding';
import AppSnackbar from '../../components/Snackbar/Snackbar';
import { setUser } from '../../redux/actions';
import { useSearchParams } from 'react-router-dom';
import CardHeader from '@mui/material/CardHeader';
import { makeStyles } from '@mui/styles';
import useWindowDimensions from '../../components/ViewPort/useWindowDimensions';
import { eraseCookies } from "../../components/LandingPage/helpers/handleAuthStateChange";

const useStyles = makeStyles((theme) => ({
    root: {
        borderColor: 'transparent'
    },
    card: {},
    cardHeader: {
        backgroundColor: Branding.primary,
        color: Branding.white,
        height: 50,
        textAlign: 'center'
    }
}));

const mapStateToProps = (state) => {
    return {
        lang: state.app.lang,
        isClientLoaded: state.app.isClientLoaded
    };
};


const ChangePassword = (props) => {
    const [searchParams,] = useSearchParams();
    const classes = useStyles();
    const { width } = useWindowDimensions();

    const redirect_uri = searchParams.get('redirect_uri');
    const { tokens } = useTheme();

    const [passwordChange, setPasswordChange] = React.useState(false);
    useEffect(() => {
        setPasswordChange(true);
    }, [props.isClientLoaded]);


    const [snackBarOps, setSnackBarOps] = React.useState({
        type: 'info',
        open: false,
        vertical: 'top',
        horizontal: 'center',
        autoHide: 0,
        message: ''
    });

    const reAuth = async () => {
        // Sign the user out
        Auth.signOut().then(() => {
            // revoke jti
            fetch('/oauth2/unauth', {
                method: 'POST',
                body: JSON.stringify({})
            }).finally((response) => {
                // Erase Cookies
                eraseCookies();
                // Redirect to source app, so that it can initiate a new login with new code
                let redirect_to = new URL(redirect_uri).origin
                window.location.replace(redirect_to)
            })
        });
    }

    const handleSuccessPasswordDialog = async () => {
        setSnackBarOps({
            type: 'success',
            open: true,
            vertical: 'top',
            horizontal: 'center',
            autoHide: 3000,
            message: I18n.get('TAB_SIGNIN_DATA_MESSAGE_PASSWORD_CHANGE_SUCCESS')
        });
        setPasswordChange(false);
        await reAuth();
    };

    return (
            <View height={'100%'}>

                {/*	Language Selection */}
                {snackBarOps.open && (
                        <AppSnackbar ops={snackBarOps}/>
                )}


                <Flex direction={'column'}
                      justifyContent='center'
                >
                    <Flex direction={'column'} alignSelf='center'
                          backgroundColor={tokens.colors.white}
                          padding={tokens.space.large}
                          borderRadius={tokens.radii.small}
                          width={tokens.components.authenticator.container.widthMax}

                    >
                        <CardHeader
                                className={classes.cardHeader}
                                title={I18n.get('TAB_SIGNIN_DATA_CHANGE_PASSWORD_LABEL')}
                                disableTypography={width < 375}
                                titleTypographyProps={{}}
                        />

                        <View padding={tokens.space.large}>
                            {passwordChange ? (<AccountSettings.ChangePassword
                                            onSuccess={() => handleSuccessPasswordDialog()}
                                            width={tokens.space.relative.full}/>
                            ) : <div>Redirecting back to the app...</div>}

                            {passwordChange && redirect_uri &&
                                    (<Flex justifyContent={'center'} paddingTop={tokens.space.medium}>
                                                <Button isFullWidth={true} variation='primary'
                                                        onClick={() => window.location.replace(redirect_uri)}>Return to
                                                    CPDValet</Button>
                                            </Flex>
                                    )}

                        </View>
                    </Flex>
                </Flex>
            </View>
    );
};

export default connect(mapStateToProps, { setUser })(ChangePassword);
