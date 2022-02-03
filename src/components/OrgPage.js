import React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import OrgCard from './OrgCard';

const OrgPage = (props) => {
    const [orgArray, setOrgArray] = useState("");

    const getOrgs = async (QVContract) => {
        const orgs = await QVContract.getAllOrganization();
        setOrgArray(orgs)
        return orgs
    }
    
    useEffect(() => {
        const QVContract = props.contract;
        if(QVContract){
            getOrgs(QVContract)
        }
    }, [props.contract]);

    
    return (
        <div>
            <div className='lrg-title'>ORGANIZATIONS</div>
            <div className='orgbtn-wrap'>
                {
                    props.orgActive ?
                    <div>
                        <Link to className='a-btn'>Your Organization</Link>
                    </div>
                    :<></>
                }
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
                                        ProposalCount={org.ProposalCount} />
                                </div>
                                
                            ))
                        }
                    </div>
                    : 
                    <div className='orglist-loading'>Loading...</div>
                }
            </div>
        </div>
    );
};

export default OrgPage;
