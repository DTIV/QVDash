import React from 'react';
import { ethers } from "ethers";
import { detectProvider } from '../functions';
import { useState } from 'react';
import Error from './Error';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const CreateProps = (props) => {
    const abi = props.abi
    const contractAddress = props.contract

    const [orgName, setOrgName] = useState("");
    const [getCPV, setCPV] = useState(0);
    const [organization, setOrg] = useState("");
    const [getError, setgetError] = useState(0);
    const [blog, setBlog] = useState("")

    const createProp = async () => {
        console.log("submitting")
        const provider = detectProvider()
        const eth = new ethers.providers.Web3Provider(provider)
        const signer = eth.getSigner()
        // const address = await signer.getAddress()
        // const Contract = new ethers.Contract(contractAddress, abi, signer)
        // const org = (await Contract.createNewOrganization(orgName, getCPV)).toString()
        // setOrg(org)
    }

    const handleOnChange = (e, editor) => {
        const data = editor.getData();
        setBlog(data)
    }
    return (
        <div className='create-org'>
            <div className='org-card'>
                <div className='med-title'>Create Your Proposal</div>
                <Error name={orgName} cpv={getCPV}/>
                {
                    props.connected ? 
                    <div className='org-form-wrap'>
                        <form action="" className='org-form' onSubmit={(e)=>{
                            e.preventDefault()
                            createProp()
                        }}>
                            <div>
                                <input className='name-input' type="text" placeholder='Name' onChange={(e)=>(setOrgName(e.target.value))}/>
                            </div>
                            <div>
                                <label htmlFor="">Duration</label>
                                <select className='duration-sel'>
                                    <option>12h</option>
                                    <option>24h</option>
                                    <option>Day</option>
                                    <option>2 Weeks</option>
                                    <option>Month</option>
                                    <option>3 Months</option>
                                </select>
                            </div>
                            <CKEditor
                                editor={ ClassicEditor }
                                data=""
                                onChange = {handleOnChange}
                            />
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

export default CreateProps;
