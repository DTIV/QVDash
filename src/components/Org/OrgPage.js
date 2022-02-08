import React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import OrgCard from './OrgCard';

const OrgPage = (props) => {
    const [orgArray, setOrgArray] = useState("");
    const [search, setSearch] = useState("");
    const [searchResults, setResults] = useState("");
    const [allOrgs, setAllOrgs] = useState("")

    const getOrgs = async (QVContract) => {
        const orgs = await QVContract.getAllOrganization();
        setOrgArray(orgs)
        setAllOrgs(orgs)
        return orgs
    }

    
    useEffect(() => {
        const QVContract = props.contract;
        if(QVContract){
            getOrgs(QVContract)
        }
    }, [props.contract]);

    const searchFilter = (e) => {
        const keyword = e.target.value
        if(keyword){
            const results = orgArray.filter((org) => {
                return org.name.toLowerCase().startsWith(keyword.toLowerCase())
            })
            setOrgArray(results)
        }else{
            setOrgArray(allOrgs)
        }
    }
    
    return (
        <div>
            <div className='lrg-title'>ORGANIZATIONS</div>
            <div className='orgbtn-wrap'>
                <input className='search-input' type="text" placeholder='Search Organization' onChange={searchFilter}/>
            </div>
            <div className='org-wrap'>
                {
                    orgArray ? 
                    <div className='orglist-wrap'>
                        {
                            orgArray.map((org)=>(
                                <div key={org.oid}>
                                    <OrgCard 
                                        oid={org.oid}
                                        name={org.name}
                                        ProposalCount={org.ProposalCount} 
                                        // meta={props.meta}
                                        contract={props.contract}/>
                                </div>
                                
                            ))
                        }
                    </div>
                    : 
                    <div className='orglist-loading'>Connect Wallet To View Organizations.</div>
                }
            </div>
            <div>
                {
                    orgArray.length === 0 ?
                    <div> No Organizations Yet.</div>
                    : <></>
                }
            </div>
        </div>
    );
};

export default OrgPage;
