import * as React from "react";

/* Modal Dialog */
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { createMuiTheme } from '@material-ui/core';
import blue from '@material-ui/core/colors/blue';

export const dialogTitleStyles = createMuiTheme({
    overrides: {
        MuiButtonBase: {
            root: {
                padding: 6
            },
        },
        MuiIconButton: {
            root: {
                padding: 6
            }
        }
    },
    palette: {
        primary: blue
    },
});

export const DialogTitle = withStyles(theme => ({
    root: {
        margin: 0,
        padding: '10px',
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
}))((props: any) => dialogHeader(props.children, props.classes, props.onClose));

export const DialogContent = withStyles(theme => ({
    root: {
        margin: 0,
        padding: 10,
    },
}))(MuiDialogContent);

export const DialogActions = withStyles(theme => ({
    root: {
        borderTop: `1px solid ${theme.palette.divider}`,
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);

function dialogHeader(children, classes, onClose) {
    return (
        <MuiDialogTitle disableTypography className={classes.root}>
            <h3>{children}</h3>
            {onClose ? (
                <MuiThemeProvider theme={dialogTitleStyles}>
                    <IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </MuiThemeProvider>
            ) : null}
        </MuiDialogTitle>
    );
}
