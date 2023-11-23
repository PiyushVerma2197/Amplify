/*
  * Copyright Amazon.com, Inc. and its affiliates. All Rights Reserved.
  * SPDX-License-Identifier: MIT
  *
  * Licensed under the MIT License. See the LICENSE accompanying this file
  * for the specific language governing permissions and limitations under
  * the License.
  */

/*
 * Snackbars inform users of a process that an app has performed or will perform.
 * They appear temporarily, towards the bottom of the screen.
 * They shouldn’t interrupt the user experience, and they don’t require user input to disappear.
 * https://https://material-ui.com/components/snackbars/
 */

import React from 'react';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';


const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export default function AppSnackbar(props) {
    const [open, setOpen] = React.useState(props.ops.open);
    const [type, setType] = React.useState('')
    const [vertical, setVertical] = React.useState('top');
    const [horizontal, setHorizontal] = React.useState('center');

    if (props.ops.open !== open) {
        setOpen(props.ops.open);
    }

    if (props.ops.type !== type) {
        setType(props.ops.type);

    }

    if (props.ops.vertical !== vertical) {
        setVertical(props.ops.vertical);
    }

    if (props.ops.horizontal !== horizontal) {
        setHorizontal(props.ops.horizontal);
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        props.ops.open = false;
        setOpen(false);
    };

    return (
            <Snackbar
                    anchorOrigin={{
                        vertical: vertical,
                        horizontal: horizontal,
                    }}
                    open={open}
                    autoHideDuration={props.ops.autoHide}
                    onClose={handleClose}
                    key={vertical + horizontal}

            >
                <Alert onClose={handleClose} severity={type} sx={{ width: '100%' }}>
                    {props.ops.message}
                </Alert>

            </Snackbar>
    );
}
