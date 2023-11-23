import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { theme } from '../../branding'
import { ThemeProvider } from "@mui/material/styles";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function RememberDeviceDialog(props) {
    const { onClose } = props;
    const [open, setOpen] = React.useState(true);

    const handleClose = () => {
        setOpen(false);
    };
    const handleTrust = () => {
        setOpen(false);
        onClose(true);
    };
    const handleNoTrust = () => {
        setOpen(false);
        onClose(false);
    };

    return (
        <ThemeProvider theme={theme}>
            <div>
                <Dialog
                    open={open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={(_, reason) => {
                        if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
                            handleClose();
                        }
                    }}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle>{"Trust this device?"}</DialogTitle>
                    <DialogContent dividers>
                        <DialogContentText id="alert-dialog-slide-description">
                            Two-factor authentication enhances the security of your account by using a secondary device
                            to
                            verify your identity.
                            This prevents anyone but you from accessing your account, event if they know your password.

                            However, you can choose to trust this device, and prevent from being prompted for entering
                            code
                            everytime you access your account
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button color="success" variant="outlined" onClick={handleTrust}>Trust this device</Button>
                        <Button color="error" variant="outlined" onClick={handleNoTrust}>Don't Trust</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </ThemeProvider>
    );
}

