import React from 'react';

const PropTitle = (props) => {
    return (
        <div className='title-wrap'>
            <div className='sm-title'>{props.title}</div>
            <div className='result-outcome'>{props.result}</div>
            <div><small>ID#</small>{Number(props.pid)}</div>
        </div>
    );
};

export default PropTitle;
