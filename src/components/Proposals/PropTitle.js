import React from 'react';
import { useEffect, useState }
 from 'react';
const PropTitle = (props) => {
    const [getMSG, setMSG] = useState("");

    const creation = props.creation
    
    const duration = props.duration
    const edate = creation + duration
    const cdate = Date.now()/1000

    const checkVotes = async (currentOID, pid) => {
        if(props.contract){
            const contract = props.contract;
            const votes = await contract.totalVotes(props.oid, props.pid)
            const upVotes = Number(votes[0])
            const downVotes = Number(votes[1])
            if(upVotes > downVotes){
                setMSG("PASSED")
            }else if(upVotes < downVotes){
                setMSG("FAILED")
            }else if(upVotes === downVotes){
                setMSG("TYE")
            }
        }
    }

    useEffect(() => {
        checkVotes(props.oid, props.pid)
    }, [props.contract]);

    return (
        <div className='title-wrap'>
            <div className='sm-title'>{props.title}</div>
            {
                cdate > edate ?
                <div>
                    { getMSG }
                </div>
                :<></>
            }
            <div className='result-outcome'>{props.result}</div>
            <div><small>ID#</small>{Number(props.pid)}</div>
        </div>
    );
};

export default PropTitle;
