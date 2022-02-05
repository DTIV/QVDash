import React from 'react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import placeholder from '../../img/placeholder.png'
import { getContractData } from '../../functions';

const OrgCard = (props) => {
    const currentOrg = props.oid
    const contract = props.contract

    const [orgData, setOrgData] = useState("");
    const [orgArray, setOrgArray] = useState("");
    const [getContractMeta, setContractMeta] = useState("");

    useEffect(() => {
        getOrg(contract)
    }, [contract]);
    
    useEffect(() => {
        getContractData(orgArray.contractAddress, setOrgData)
    }, [orgArray]);

    const getOrg = async (QVContract) => {
        const orgs = await QVContract.getOrganization(props.oid);
        setOrgArray(orgs)
        return orgs
    }
    return (
        <Link to={`/org/${Number(props.oid)}`} key={props.oid} className='orglist-card'>
            <div className='otop-wrap'>
                {
                    orgData ?
                        <div className='org-name'>{orgData.contract_name}</div>
                    :
                    <div className='org-name'>{props.name}</div>
                }
                <div><small>ID#</small>{Number(props.oid)}</div>
            </div>
            {
                orgData ?
                <div className='thumb-wrap'>
                    <img className='logo-thumb' src={orgData.logo_url} alt="" />
                </div>
                : 
                <div className='thumb-wrap'>
                    <img className='logo-thumb' src={placeholder} alt="" />
                </div>
            }
            <div className='oprop-wrap'>
                <div className='prop-count'>{Number(props.ProposalCount)}</div>
                <div>Proposals</div>
            </div>
        </Link>
    );
};

export default OrgCard;
