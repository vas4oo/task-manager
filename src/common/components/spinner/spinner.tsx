import * as React from 'react';
import './spinner.css';

const spinner = (props) => {
    if (props.inlineSpinner) {
        return <div className='inlineSpinner'></div>
    }
    else {
        return <div className='spinner'></div>
    }
}

export default spinner;