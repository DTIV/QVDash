import React from 'react';
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import PropStats from '../Proposals/PropStats';
import PropList from '../Proposals/PropList';
import Chart from '../Chart/Chart';
import placeholder from '../../img/placeholder.png'
import { getContractData } from '../../functions';

const OrgProfile = (props) => {
    const [orgArray, setOrgArray] = useState("");
    const [contract, setContract] = useState("");
    const [userCreditBal, setUserCreditBal] = useState(0);
    const [orgTokenSupply, setOrgTokenSupply] = useState(0);
    const [memberCount, setMemberCount] = useState(0);
    const [currentOrg, setCurrentOrg] = useState("")
    const [orgData, setOrgData] = useState("");
    const [allProps, setAllProps] = useState("");
    const [mintAllow, setMintAllow] = useState(true)

    const path = window.location.pathname
    const currentOID = Number(path.replace("/org/", ""))
    const QVContract = props.contract;

    const getProps = async (QVContract) => {
        const propz = await QVContract.getOrgProposals(currentOID);
        setOrgArray(propz)
        setAllProps(propz)
    }

    useEffect(() => {
        setContract(QVContract);
        if(QVContract){
            getProps(QVContract)
            getUserCredit(QVContract)
            getTokenSupply(QVContract)
            getMemberCount(QVContract)
            getOrginization(QVContract)
        }
    }, [QVContract]);

    useEffect(() => {
        getContractData(currentOrg.contractAddress,setOrgData)
    }, [currentOrg]);
    
    const mint = async () => {
        if(contract){
            const mint = contract.mint(currentOID);
        }
    }

    const getOrginization = async (QVContract) => {
        const og = await QVContract.getOrganization(currentOID)
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

    const filterEnded = () => {
        const ctime = (Date.now()/1000);
        const newArray = allProps.filter((proposal) => (
            (Number(proposal.creationTime) + Number(proposal.duration)) < (ctime)
        ))
        setOrgArray(newArray)
    }

    const filterActive = () => {
        const ctime = (Date.now()/1000);
        const newArray = allProps.filter((proposal) => (
            (Number(proposal.creationTime) + Number(proposal.duration)) > (ctime)
        ))
        setOrgArray(newArray)
    }

    const filterAll= () => {
        setOrgArray(allProps)
    }

    const allowMint = async () => {
        if(QVContract){
            await QVContract.allowMinting(currentOID);
            setMintAllow(true)
        }
    }

    const blockMint = async () => {
        if(QVContract){
            await QVContract.blockMinting(currentOID);
            setMintAllow(false)
        }
    }

    return (
        <div>
            {
                orgData ?
                <div>
                    <div className='lrg-title'>
                        { 
                            orgData.contract_metadata.contract_name ? 
                            <div>{orgData.contract_metadata.contract_name} </div>
                            : 
                            <div>{currentOrg.name}</div>
                        }
                    </div>
                    <div className='med-title'>
                        ({orgData.contract_metadata.contract_ticker_symbol})
                    </div>
                    <div className='org-logo-wrap'>
                        <img src={orgData.contract_metadata.logo_url} alt="" />
                    </div>
                    <div className='contract-info'>
                        <div>
                            Contract: {orgData.contract_metadata.contract_address}
                        </div>
                    </div>
                    <div className='org-price'>
                        {orgData.price} USD
                    </div>
                </div>
                :
                <div>
                    <div className='lrg-title'>
                        <div>{currentOrg.name}</div>
                    </div>
                    <div className='org-logo-wrap'>
                        <img className='org-logo' src={placeholder} alt="" />
                    </div>
                    
                </div>
            }
            {
                currentOrg.creator !== props.account ?
                <div className='mint-btn'>
                    <button className='a-btn' onClick={mint}>Get Credits</button>
                </div>
                : orgArray ?
                    <div className='control-btn'>
                        {
                            mintAllow ?
                            <button className='a-btn' onClick={blockMint}>Stop Minting</button>
                            :
                            <button className='a-btn' onClick={allowMint}>Reset Minting</button>
                        }
                    </div>
                    :<></>
            }
            
            <div>
                
                <div>
                    <PropStats 
                        userCredits={Number(userCreditBal)}
                        orgTokenSupply={Number(orgTokenSupply)}
                        memberCount={Number(memberCount)}/>
                </div>
                <div className='chart'>
                    <Chart 
                        allProps={allProps}/>
                </div>
                <div className='lrg-title'>Proposals</div>
                <div className='filter-wrap'>
                    <div className='filterbtn-wrap'>
                        <button className='filter-btn' onClick={filterAll}>All</button>
                    </div>
                    <div className='filterbtn-wrap'>
                        <button className='filter-btn' onClick={filterActive}>Active</button>
                    </div>
                    <div className='filterbtn-wrap'>
                        <button className='filter-btn' onClick={filterEnded}>Ended</button>
                    </div>
                </div>
                <PropList
                    contract={contract}
                    currentOID={currentOID}
                    orgArray={orgArray}
                    userCredits={Number(userCreditBal)}
                    creator={currentOrg.creator}
                    account={props.account}
                    />
            </div>
        </div>
    );
};

export default OrgProfile;