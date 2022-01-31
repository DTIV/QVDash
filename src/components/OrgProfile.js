import React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const OrgProfile = (props) => {
    const [orgArray, setOrgArray] = useState("");

    const getProps = async (QVContract) => {
        const propz = await QVContract.getuserProposals();
        setOrgArray(propz)
        console.log(propz)
        return propz
    }

    useEffect(() => {
        const QVContract = props.contract;
        if(QVContract){
            getProps(QVContract)
        }
    }, [props.contract]);

    return (
        <div>
            {
                orgArray.length ?
                <div>Proposals</div>
                :
                <div>No Proposals</div>
            }
        </div>
    );
};

export default OrgProfile;
