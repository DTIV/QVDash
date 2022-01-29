import React from 'react'

const ConnectButton = (props) => {
    if(props.connecting){
        return (
            <div className="">
                <button className='connect-btn' disabled>Connecting...</button>
            </div>
        ) 
    }else{
        if(props.connected){
            return(
                <button className='connect-btn' disabled>Connected</button>
            )   
        }else{
            return(
                <div className="{styles.connectWrap}">
                    <button className='connect-btn' onClick={props.connect}>Connect</button>
                </div>
            )
        }
    }
}

export default ConnectButton
