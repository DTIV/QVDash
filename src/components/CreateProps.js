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

    const [propTitle, setPropTitle] = useState("");
    const [getDuration, setDuration] = useState(300);
    const [organization, setOrg] = useState("");
    const [getError, setgetError] = useState(0);
    const [blog, setBlog] = useState("")

    const createProp = async () => {
        console.log("submitting")
        const provider = detectProvider()
        const eth = new ethers.providers.Web3Provider(provider)
        const signer = eth.getSigner()
        const Contract = new ethers.Contract(contractAddress, abi, signer)
        const prop = (await Contract.createNewProposal(getDuration,propTitle,blog))
        setOrg(prop)
    }

    const handleOnChange = (e, editor) => {
        const data = editor.getData();
        setBlog(data)
    }

    return (
        <div className='create-org'>
            <div className='org-card'>
                <div className='med-title'>Create Your Proposal</div>
                {
                    (propTitle.length < 10) ?
                    <div className='error-card'>
                        Title Less Than 10 Characters
                    </div>
                    :<></>
                }
                {
                    props.connected ? 
                    <div className='org-form-wrap'>
                        <form action="" className='org-form' onSubmit={(e)=>{
                            e.preventDefault()
                            createProp()
                        }}>
                            <div>
                                <input className='title-input' type="text" placeholder='Title' onChange={(e)=>(setPropTitle(e.target.value))}/>
                            </div>
                            <div>
                                <label htmlFor="">Duration</label>
                                <select className='duration-sel' onChange={(e) => {
                                    setDuration(e.target.value)
                                }}>
                                    <option value={300} data-num={300}>5min</option>
                                    <option value={43200} data-num={43200}>12h</option>
                                    <option value={86400} data-num={86400}>Day</option>
                                    <option value={604800} data-num={604800}>Week</option>
                                    <option value={1209600} data-num={1209600}>2 Weeks</option>
                                    <option value={2419200} data-num={2419200}>Month</option>
                                    <option value={7257600} data-num={7257600}>3 Months</option>
                                </select>
                            </div>
                            <div className='ckedit'>
                                <CKEditor
                                    className='ckedit'
                                    editor={ ClassicEditor }
                                    data=""
                                    onChange = {handleOnChange}
                                />
                            </div>
                            {
                                (propTitle.length >= 10) ?
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
