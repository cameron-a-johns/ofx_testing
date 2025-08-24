import { useEffect, useState } from 'react';

import classes from './Input.module.css';


const Input = (props) => {
    const handleChange = (e) => {
        props.onChange(e.target.value);
    };

    return (
        <div className={`${classes.container} ${props.className}`} style={props.style}>
            {props.label && <span>{props.label}</span>}
            <input className={classes.input} value={props.value} onChange={handleChange} type={props.type || 'text'} />
        </div>
    );
};

// Input.propTypes = {
//     value: PropTypes.string,
//     onChange: PropTypes.func,
//     label: PropTypes.string,
//     className: PropTypes.string,
//     type: PropTypes.string,
// };

export default Input;
