import * as React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import GrowlContent from './growlContent';

interface IProps {

}

interface IState {
    isOpen: boolean,
    summary: string,
    severity: string
}

class Growl extends React.Component<IProps, IState> {

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            summary: '',
            severity: 'default'
        }
    }

    show(value) {
        this.setState({ isOpen: true, summary: value.summary, severity: value.severity });
    }

    handleClose = () => {
        this.setState({ isOpen: false });
    }
    // type: success, warning, error, info
    render() {
        return (

            <Snackbar
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                open={this.state.isOpen}
                autoHideDuration={this.state.summary ? this.state.summary.length * 70 : 4000}
                onClose={this.handleClose}
            >
                <GrowlContent
                    onClose={this.handleClose}
                    variant={this.state.severity}
                    message={this.state.summary}
                />
            </Snackbar>
        )
    }
}

export default Growl;