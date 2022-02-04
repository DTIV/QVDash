import React from 'react';
import { useEffect, useState, useRef } from 'react';

const PropTime = (props) => {
    
    const creation = props.creation
    const duration = props.duration
    const edate = creation + duration
    const cdate = Date.now()/1000
    const [getMSG, setMSG] = useState('ACTIVE');


    let cr = false;
    let state_msg = 'ACTIVE';
    if(cdate > edate){
        state_msg = 'ENDED';
        cr = true
    }

    
    useEffect(() => {
        setMSG(state_msg)
    }, [state_msg]);
    
    useEffect(() => {
      if(cr){
          props.checkTime(cr)
      }
    }, [cr]);
    

    return (
        <div >
            State: {getMSG}
        </div>
    );
};

export default PropTime;
