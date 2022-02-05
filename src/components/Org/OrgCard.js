import React from 'react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const OrgCard = (props) => {
    const meta = props.meta
    const currentOrg = props.oid
    const contract = props.contract

    const [orgData, setOrgData] = useState("");
    const [orgArray, setOrgArray] = useState("");

    useEffect(() => {
        getOrg(contract)
    }, [contract]);
    
    useEffect(() => {
        getCurrentOrgData(meta, orgArray)
    }, [meta, orgArray]);

    const getCurrentOrgData = (meta, org) => {
        const onch = org.contractAddress
        if(onch){
            const addy = onch.toLowerCase()
            const matcher = meta.filter((proposal) => (proposal.contract_address == addy))
            const org = matcher[0]
            setOrgData(org)
        }
    }

    const getOrg = async (QVContract) => {
        const orgs = await QVContract.getOrganization(props.oid);
        setOrgArray(orgs)
        return orgs
    }
    console.log(orgData)
    return (
        <Link to={`/org/${Number(props.oid)}`} key={props.oid} className='orglist-card'>
            <div className='otop-wrap'>
                {
                    orgData.contract_name ?
                        <div className='org-name'>{orgData.contract_name}</div>
                    :
                    <div className='org-name'>{props.name}</div>
                }
                <div><small>ID#</small>{Number(props.oid)}</div>
            </div>
            {
                orgData.logo_url ?
                <div className='thumb-wrap'>
                    <img className='logo-thumb' src={orgData.logo_url} alt="" />
                </div>
                : <></>
            }
            <div className='oprop-wrap'>
                <div className='prop-count'>{Number(props.ProposalCount)}</div>
                <div>Proposals</div>
            </div>
        </Link>
    );
};

export default OrgCard;
