import React from 'react';

const Error = ({ cpv, name }) => {
    if(name.length < 3 || cpv < 2){
        return (
            <div className={`error-card $`}>
                {
                    name.length < 3 ?
                    <div className='error-txt'>Name Must Be Greater Than 3 Characters</div>
                    : <></>
                }
                {
                    cpv < 2 ? 
                    <div className='error-txt'>CPV Must Be Greater Than 2</div>
                    :<></>
                }
            </div>
        );
    }else{
        return(
            <></>
        )
    }
    
};

export default Error;
