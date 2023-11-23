import React from 'react';

import { Auth, I18n, Logger } from 'aws-amplify';

import { makeStyles } from '@mui/styles';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { Branding } from '../../branding';
import AppSnackbar from '../../components/Snackbar/Snackbar';
import { verifyCurrentUserAttribute } from './verificationHelper';
import { loadUserAttributes } from '../../index';
import { setVerifyEmailCodeCount } from '../../redux/actions';
import { connect } from 'react-redux';

const logger = new Logger('VerifyAttributeDialog');

const useStyles = makeStyles(() => ({
    dialogTitle: {
        minWidth: 400
    },
    dialogActions: {
        paddingRight: 22
    },
    buttonVerify: {
        color: Branding.positive,
        '&:hover': {
            color: Branding.positive,
            opacity: Branding.opacityHover
        }
    },
    buttonClose: {
        color: Branding.negative,
        '&:hover': {
            color: Branding.negative,
            opacity: Branding.opacityHover
        }
    }
}));

const mapStateToProps = (state) => {
    return {
        app: state.app,
        user: state.user,
        codeReqCount: state.app.verifyEmailCodeReqCount
    };
};

const VerifyAttributeDialog = (props) => {
    logger.debug("Displaying VerifyAttributeDialog for ", props)
    const classes = useStyles();
    const [code, setCode] = React.useState('');
    const [codeReqCount, setCodeReqCount] = React.useState(0);
    const [snackBarOps, setSnackBarOps] = React.useState({
        type: 'info',
        open: false,
        vertical: 'top',
        horizontal: 'center',
        autoHide: 0,
        message: ''
    });

    const verifyUserAttribute = (attr) => {
        verifyCurrentUserAttribute(attr).catch(e => {
            setSnackBarOps({
                type: 'error',
                open: true,
                vertical: 'top',
                horizontal: 'center',
                autoHide: 3000,
                message: I18n.get('TAB_SIGNIN_DATA_MESSAGE_ERROR') + e
            });
        });
    };
    const verifyCurrentUserAttributeSubmit = (attr, code) => {
        if (!attr || !code) {
            setSnackBarOps({
                type: 'success',
                open: true,
                vertical: 'top',
                horizontal: 'center',
                autoHide: 3000,
                message: I18n.get('VERIFY_DIALOG_MESSAGE_EROR')
            });
            return;
        }

        // To verify attribute with the code
        Auth.verifyCurrentUserAttributeSubmit(attr, code)
                .then((data) => {
                    handleClose(data === 'SUCCESS');
                }).catch(err => {
            console.log(err);
            setSnackBarOps({
                type: 'error',
                open: true,
                vertical: 'top',
                horizontal: 'center',
                autoHide: 8000,
                message: I18n.get('VERIFY_DIALOG_MESSAGE_EROR') + '\n' + err
            });
        });
    };

    React.useEffect(() => {
        let ignore = false;
        // Send Verification Code on Component Mount
        if (!ignore) {
            console.debug('Sending', props.attrType, 'code');
            verifyUserAttribute(props.attrType);
        }
        return () => {
            ignore = true;
        };
        // NOTE: Run effect once on component mount, please
        // recheck dependencies if effect is updated.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const handleClickVerify = () => {
        verifyCurrentUserAttributeSubmit(props.attrType, code);
    };
    const handleClickResendCode = () => {
        console.debug('Resending ', props.attrType, ' code');
        setCodeReqCount(1);
        verifyUserAttribute(props.attrType);
    };

    const handleClose = (successful = false) => {
        setCode('');
        loadUserAttributes();
        if (props?.close) {
            props.close(successful);
        }
    };

    const handleChange = (value) => {
        setCode(value || '');
    };

    return (
            <div>
                {snackBarOps.open && (
                        <AppSnackbar ops={snackBarOps}/>
                )}

                <Dialog
                        open={props.open}
                        onClose={handleClose}
                        aria-labelledby='verify-dialog'
                >
                    <DialogTitle id='verify-dialog-title' className={classes.dialogTitle}>
                        {I18n.get('VERIFY_DIALOG_TITLE')} {props.attrType}
                    </DialogTitle>
                    <DialogContent className={classes.dialogContent}>
                        <DialogContentText>
                            {props.message}
                        </DialogContentText>
                        <TextField
                                value={code}
                                onChange={(event) => handleChange(event.target.value)}
                                margin='dense'
                                id='code'
                                label={I18n.get('VERIFY_DIALOG_INPUT_LABEL')}
                                fullWidth
                                className={classes.TextField}
                                inputProps={{ style: { left: 0 } }}
                                autoFocus
                        />
                    </DialogContent>
                    <DialogActions className={classes.dialogActions}>
                        {codeReqCount === 0 && (
                                <Button
                                        variant='outlined'
                                        onClick={handleClickResendCode}
                                        className={classes.buttonVerify}
                                >
                                    {I18n.get('VERIFY_DIALOG_RESEND_BUTTON_LABEL')}
                                </Button>

                        )}
                        <Button
                                variant='outlined'
                                onClick={handleClickVerify}
                                className={classes.buttonVerify}
                        >
                            {I18n.get('VERIFY_DIALOG_VERIFY_BUTTON_LABEL')}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
    );
};

export default connect(mapStateToProps, { setVerifyEmailCodeCount })(VerifyAttributeDialog);
