import React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropStats from './PropStats';
import PropList from './PropList';

const OrgProfile = (props) => {
    const [orgArray, setOrgArray] = useState("");
    const [contract, setContract] = useState("");
    const [userCreditBal, setUserCreditBal] = useState(0);
    const [orgTokenSupply, setOrgTokenSupply] = useState(0);
    const [memberCount, setMemberCount] = useState(0);
    const [currentOrg, setCurrentOrg] = useState("")
    const [orgData, setOrgData] = useState("");

    const path = window.location.pathname
    const currentOID = Number(path.replace("/org/", ""))

    
    useEffect(() => {
        const QVContract = props.contract;
        setContract(QVContract)
        if(QVContract){
            getProps(QVContract)
            getUserCredit(QVContract)
            getTokenSupply(QVContract)
            getMemberCount(QVContract)
            getOrginization(QVContract)
            
        }
    }, [props.contract]);

    useEffect(() => {
        getCurrentOrgData(props.meta, currentOrg)
    }, [props.meta, currentOrg]);
    
    const mint = async () => {
        if(contract){
            console.log("minting tokens")
            const mint = contract.mint(currentOID);
        }
    }

    const getProps = async (QVContract) => {
        const propz = await QVContract.getuserProposals();
        setOrgArray(propz)
        return propz
    }

    const getOrginization = async (QVContract) => {
        const og = await QVContract.getUserOrganization(currentOID)
        setCurrentOrg(og)
        return(og)
    }

    const getUserCredit = async (QVContract) => {
        const uc = await QVContract.checkUserBalance(currentOID);
        setUserCreditBal(uc)
        return uc
    }

    const getTokenSupply = async (QVContract) => {
        const ts = await QVContract.getUserOrganizationTokenSupply(currentOID)
        setOrgTokenSupply(ts)
        return ts
    }

    const getMemberCount = async (QVContract) => {
        const ts = await QVContract.getOrgMembersCount(currentOID)
        setMemberCount(ts)
        return ts
    }

    const getCurrentOrgData = (meta, org) => {
        const onch = org.contractAddress
        if(onch){
            const addy = onch.toLowerCase()
            const matcher = meta.filter((proposal) => (proposal.contract_address == addy))
            const org = matcher[0]
            setOrgData(org)
        }
    }

    return (
        <div>
            {
                orgData ?
                <div>
                    <div className='lrg-title'>
                        {orgData.contract_name}
                    </div>
                    
                    <img src={orgData.logo_url} alt="" />
                </div>
                :<></>
            }
            
            <div className='mint-btn'>
                <button className='a-btn' onClick={mint}>Get Credits</button>
            </div>
            {
                orgArray.length > 0 ?
                <div>
                    <div className='lrg-title'>Proposals</div>
                    <PropStats 
                        userCredits={Number(userCreditBal)}
                        orgTokenSupply={Number(orgTokenSupply)}
                        memberCount={Number(memberCount)}/>
                    <PropList 
                        contract={contract}
                        currentOID={currentOID}
                        orgArray={orgArray}
                        userCredits={Number(userCreditBal)}
                        meta={props.meta}/>
                </div>
                :
                <div>No Proposals</div>
            }
        </div>
    );
};

export default OrgProfile;
