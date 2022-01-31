import React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

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
                                <Link to={`/org/${Number(org.oid)}`} key={org.oid} className='orglist-card'>
                                    <div className='otop-wrap'>
                                        <div className='org-name'>{org.name}</div>
                                        <div><small>ID#</small>{Number(org.oid)}</div>
                                    </div>
                                    <div className='oprop-wrap'>
                                        <div className='prop-count'>{Number(org.ProposalCount)}</div>
                                        <div>Proposals</div>
                                    </div>
                                </Link>
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
