import React from 'react';
import { ethers } from "ethers";
import { detectProvider } from '../../functions';
import { useState, useEffect } from 'react';
import Error from '../Error';


const CreateOrg = (props) => {
    const abi = props.abi
    const contractAddress = props.contract

    const [orgName, setOrgName] = useState("");
    const [getCPV, setCPV] = useState(0);
    const [organization, setOrg] = useState("");
    const [orgAddress, setOrgAddress] = useState("");
    const [getError, setgetError] = useState(0);
    
    const createOrg = async () => {
        console.log("submitting")
        const provider = detectProvider()
        const eth = new ethers.providers.Web3Provider(provider)
        const signer = eth.getSigner()
        const address = await signer.getAddress()
        const Contract = new ethers.Contract(contractAddress, abi, signer)
        const org = (await Contract.createNewOrganization(orgName, getCPV, orgAddress)).toString()
        setOrg(org)
        window.location.href = '/'
    }

    return (
        
    <div className='create-org'>
            <div className='org-card'>
                <div className='med-title'>Create Your Organization</div>
                <Error name={orgName} cpv={getCPV}/>
                {
                    props.connected ? 
                    <div className='org-form-wrap'>
                        <form action="" className='org-form' onSubmit={(e)=>{
                            e.preventDefault()
                            createOrg()
                        }}>
                            <div>
                                <input className='name-input' type="text" placeholder='Contract Address' onChange={(e)=>(setOrgAddress(e.target.value))}/>
                            </div>
                            <div>
                                <input className='name-input' type="text" placeholder='Name' onChange={(e)=>(setOrgName(e.target.value))}/>
                            </div>
                            <div>
                                <input className='credit-input' type="number" placeholder='Credits Per Voter' onChange={(e)=>(setCPV(e.target.value))}/>
                            </div>
                            {
                                (orgName.length >= 3 && getCPV >= 2) ?
                                <div>
                                    <input className='sub-input' type="submit" value="Submit" />
                                </div> 
                                :
                                <div>
                                    <input className='sub-input' type="submit" value="Submit" disabled/>
                                </div> 
                            }
                        </form>
                    </div>
                    :
                    <div>
                        <button className='create-connect' onClick={props.connect}>Connect</button>
                    </div>
                }
                
            </div>
    </div>
    );
};

export default CreateOrg;
