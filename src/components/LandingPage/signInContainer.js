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
import { I18n } from 'aws-amplify';
import { Branding } from '../../branding';
import {
    Authenticator,
    Button,
    ButtonGroup,
    Divider,
    Flex,
    Grid,
    Heading,
    Image,
    Link,
    Text,
    useAuthenticator,
    useTheme,
    View
} from '@aws-amplify/ui-react';
import { AuthState } from '../../App';

import handleIdpLogin from './helpers/handleIdpLogin';
import CPDValet from '../../assets/Logos/CPDValet.svg';
import LanguageSelect from '../LanguageSelect/LanguageSelect';
import VerifyAttributeDialog from '../VerifyAttributeDialog/VerifyAttributeDialog';
import AppSnackbar from '../Snackbar/Snackbar';
import RememberDeviceDialog from "../RememberDeviceDialog/RememberDeviceDialog";
import { handleRememberDevice } from "../RememberDeviceDialog/helpers/rememberDeviceHelper";
import { useSearchParams } from "react-router-dom";
import { Autocomplete, TextField } from "@mui/material";
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import AppleIcon from '@mui/icons-material/Apple';
import GoogleIcon from '@mui/icons-material/Google';

export const logoStyle = {
    width: '206px', top: '20px'
};

const mapStateToProps = (state) => {
    return {
        lang: state.app.lang,
        user: state.user,
        auth: state.app.auth,
        userPrefRememberDevice: state.app.userPrefRememberDevice,
        email_verified: state.user?.attributes?.email_verified || undefined,
    };
};

const formFields = {
    setupTOTP: {
        confirmation_code: {
            label: 'OTP Code:', placeholder: 'Enter OTP Code from your Authenticator App'
        }
    }
};

const SignInContainer = (props) => {
    const { tokens } = useTheme();
    const [searchParams,] = useSearchParams();
    const context = useAuthenticator((context) => [context]);
    const supportedIdPs = props.client.supportedIdPs;
    const [authStatus, setAuthStatus] = React.useState(props.authState || AuthState.SignIn);
    // IdP Provider and Login
    const socialIdPs = ['LoginWithAmazon', 'Facebook', 'Google', 'SignInWithApple'];
    const [ctr, setCtr] = React.useState(0);

    const [snackBarOps, setSnackBarOps] = React.useState({
        type: 'info', open: false, vertical: 'top', horizontal: 'center', autoHide: 0, message: ''
    });

    React.useEffect(() => {
        // Run Once
        let error = searchParams.get('error')
        let errorDescription = searchParams.get('error_description')
        if (error && errorDescription) {
            setSnackBarOps({
                type: 'error',
                open: true,
                vertical: 'top',
                horizontal: 'center',
                autoHide: 500000,
                message: `${error}: ${errorDescription}`
            })
        }
        // NOTE: Run effect once on component mount, please
        // recheck dependencies if effect is updated.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    React.useEffect(() => {
        setAuthStatus(context.route);
    }, [context.route, props.lang]);


    const handleIdpLoginButton = e => {
        const idp = e.target.dataset.idp;
        handleIdpLogin(idp);
    }


    const configuredSocialIdPs = supportedIdPs.filter(value => (socialIdPs.some(item => item.toLowerCase() === value.provider.toLowerCase()) || value.provider.toLowerCase() === 'cognito')).map(item => item.provider);
    const amazonLogin = configuredSocialIdPs.includes('LoginWithAmazon');
    const facebookLogin = configuredSocialIdPs.includes('Facebook');
    const googleLogin = configuredSocialIdPs.includes('Google');
    const cognitoLogin = configuredSocialIdPs.includes('COGNITO');
    const appleLogin = configuredSocialIdPs.includes('SignInWithApple');

    // SAML
    // show only IdPs that have been configured in Cognito for this Application excluding Social IdPs and Cognito
    let SAMLIdPs = supportedIdPs.filter(value => !(socialIdPs.some(item => item.toLowerCase() === value.provider.toLowerCase()) || value.provider.toLowerCase() === 'cognito'));
    const countSamlLogins = SAMLIdPs.length || 0;

    const fnProviderLabel = provider_name => {
        return provider_name.split('-')[0].toUpperCase();
    };
    const SAMLDropDownOptions = SAMLIdPs.map(IdP => ({
        label: `${IdP.domain_name}`,
        provider: IdP.provider
    }));
    const SAMLLoginButtons = countSamlLogins === 1 ? SAMLIdPs.map(IdP => <Button key={IdP.provider}
                                                                                 className='amplify-button amplify-button--primary amplify-button--fullwidth'
                                                                                 data-idp={IdP.provider}
                                                                                 variant='primary'
                                                                                 onClick={handleIdpLoginButton}>Sign In
        with {fnProviderLabel(IdP.provider)}
    </Button>) : (<Autocomplete
            id="idp-select"
            options={SAMLDropDownOptions}
            autoHighlight
            getOptionLabel={(option) => option.label}
            onChange={(event, newInputValue) => {
                handleIdpLogin(newInputValue.provider);
            }}
            renderInput={(params) => <TextField {...params} label="Sign In with..."/>}
    />)


    const components = {
        SetupTOTP: {
            Header() {
                return (<>
                    <Heading
                            level={4}
                    >
                        Set up OTP Authenticator
                    </Heading>
                    <Text>
                        Download Authenticator app of your choice such as&nbsp;
                        <Link href='https://www.microsoft.com/en-us/security/mobile-authenticator-app'
                              color='#007EB9'
                              isExternal={true}>Microsoft</Link> or <Link
                            href='https://support.google.com/accounts/answer/1066447?hl=en&ref_topic=2954345'
                            color='#007EB9'
                            isExternal={true}>Google</Link> Authenticator on your device. </Text><Text>Go to
                    Authenticator App &rarr; <i>tap</i> <b>+</b> or <b>Add account</b> &rarr; Scan QR
                    code. </Text><Text>Once you scan the QR code, enter the OTP displayed in Authenticator App in
                    the Code field displayed below.
                </Text>
                </>);
            }, Footer() {
                return <Text>Note: You can use any authenticator app to scan the QR code.</Text>;
            }
        }, ConfirmSignIn: {
            Header() {
                const { tokens } = useTheme();
                return (<>
                    <Heading
                            level={5}
                    >
                        {I18n.get('CONFIRM_TOTP')}
                    </Heading>
                    <Text paddingBottom={tokens.space.relative.medium.value}
                    >{context.user.challengeName === "SOFTWARE_TOKEN_MFA" ? 'Please enter code displayed on your Authenticator App' : 'Please enter code sent via ' + context.user.challengeParam.CODE_DELIVERY_DELIVERY_MEDIUM + ' to ' + context.user.challengeParam.CODE_DELIVERY_DESTINATION}</Text>
                </>);
            }
        }, VerifyUser: {
            Header() {
                const { tokens } = useTheme();
                return (<>
                    <Heading
                            level={5}
                            paddingBottom={tokens.space.relative.medium.value}
                    >
                        Account Recovery
                    </Heading>
                    <Text paddingBottom={tokens.space.relative.medium.value}
                    >Account recovery requires verified email address. Click verify to proceed.</Text>
                </>);
            }
        },

        ConfirmVerifyUser: {
            Header() {
                const { tokens } = useTheme();
                return (<>
                    <Heading
                            level={5}
                            paddingBottom={tokens.space.relative.medium.value}
                    >
                        Account Recovery
                    </Heading>
                    <Text paddingBottom={tokens.space.relative.medium.value}
                    >Please enter verification code you have received in your email</Text>
                </>);
            }
        }
    };

    return (<View height={'100%'}>

        {/*	Language Selection */}
        <LanguageSelect/>

        {snackBarOps.open && (<AppSnackbar ops={snackBarOps}/>)}

        <Grid
                spacing={0}
                direction='column'
                alignItems='center'
                justify='center'
                style={{ paddingBottom: tokens.space.medium.value }}
        >
            <Image
                    style={logoStyle}
                    alt={Branding.appName}
                    src={CPDValet}
                    marginLeft={'auto'}
                    marginRight={'auto'}
            />
            <Heading
                    variant={{ large: 'h4', base: 'h3' }}
                    color='primary'
                    marginLeft={'auto'}
                    marginRight={'auto'}

            >
                {I18n.get('IDB_APP_NAME')}
            </Heading>
        </Grid>
        <Flex direction={'column'}
              justifyContent='center'>
            <Flex direction={'column'} alignSelf='center' backgroundColor="var(--amplify-colors-white)">

                <View maxWidth={tokens.components.authenticator.container.widthMax}
                      padding={tokens.components.authenticator.form.padding.value} paddingBottom={'0rem'}>

                    <ButtonGroup direction='row' justifyContent='center'
                                 padding={tokens.components.authenticator.form.padding.value}>
                        {/*	Login with Amazon */}
                        {authStatus === AuthState.SignIn && amazonLogin && (<Button
                                        className='amplify-button amplify-button--primary amplify-button--fullwidth'
                                        ariaLabel="Sign In using Amazon"
                                        variant='primary' onClick={() => handleIdpLogin('LoginWithAmazon')}>
                                    {/*<i className='fa fa-amazon fa-fw'/>*/}
                                    {I18n.get('LANDING_PAGE_BUTTON_IDP_AMAZON_SIGNIN_LABEL')}
                                </Button>

                        )}

                        {/* Login with Google */}
                        {authStatus === AuthState.SignIn && googleLogin && (<Button width={'fit-content'}
                                                                                    className='amplify-button amplify-button--primary'
                                                                                    variant='primary'
                                                                                    ariaLabel="Sign In using Google"
                                                                                    onClick={() => handleIdpLogin('Google')}>
                                    <GoogleIcon variant="outlined" fontSize={'large'}/>

                                </Button>

                        )}

                        {/*
						  * Login with Facebook
						  */}
                        {authStatus === AuthState.SignIn && facebookLogin && (<Button width={'fit-content'}
                                                                                      className='amplify-button amplify-button--primary'
                                                                                      variant='text'
                                                                                      ariaLabel="Sign In using Facebook"
                                                                                      onClick={() => handleIdpLogin('Facebook')}>

                            <FacebookOutlinedIcon variant="outlined" fontSize={'large'}/>
                        </Button>)}

                        {/*
						  * Login with Apple
						  */}
                        {authStatus === AuthState.SignIn && appleLogin && (<Button width={'fit-content'}
                                                                                   className='amplify-button amplify-button--primary'
                                                                                   variant='primary'
                                                                                   ariaLabel="Sign In using Apple"
                                                                                   onClick={() => handleIdpLogin('SignInWithApple')}>

                            <AppleIcon variant="outlined" fontSize={'large'}/>
                        </Button>)}


                    </ButtonGroup>
                    {authStatus === AuthState.SignIn && countSamlLogins > 0 && (<>
                        {SAMLLoginButtons}
                    </>)}

                    {/*
						  * Divider between AmplifyAuthenticator and IdP Logins
						  */}
                    {authStatus === AuthState.SignIn && countSamlLogins > 0 && (<Divider
                            label={I18n.get('LANDING_PAGE_DIVIDER_TEXT')}
                            size={'small'}
                            marginTop={tokens.components.authenticator.form.padding.value}
                            row-gap={'16px'}
                    />)}

                </View>
                {/*
						  * AmplifyAuthenticator Container
						  */}
                {cognitoLogin && (<>
                    <Authenticator socialProviders={[]}
                                   formFields={formFields}
                                   components={components}
                                   hideSignUp={true}
                                   services={[]}
                    >
                        {localStorage.setItem('idp', 'COGNITO')}
                        {/*Verify email address if user is Cognito User only*/}
                        {!props.user.email_verified && props.auth && !(/true/i).test(localStorage.getItem('amplify-signin-with-hostedUI')) && (<>
                            <VerifyAttributeDialog open={true} attrType={'email'} ctr={ctr} setCtr={setCtr}
                                                   message={'Account recovery requires verified email address. \n Please enter verification code you have received in your email'}></VerifyAttributeDialog>
                        </>)}

                        {/*Ask to remember device if User is Cognito User only*/}
                        {props.askToRememberDevice && props.userPrefRememberDevice && !(/true/i).test(localStorage.getItem('amplify-signin-with-hostedUI')) && (
                                <RememberDeviceDialog onClose={handleRememberDevice}/>)}

                        <div>
                            {I18n.get('LANDING_PAGE_WAIT_REDIRECTION')}
                        </div>

                    </Authenticator>
                </>)}
                <Link
                        href="https://bayshann.com/cpdvalet-2/"
                        isExternal={true} textDecoration="underline dotted" alignSelf={"center"}
                >
                    Not a member, find out more.
                </Link>
                <div><p></p></div>

            </Flex>

        </Flex>
    </View>);
};


export default connect(mapStateToProps,)(SignInContainer);
