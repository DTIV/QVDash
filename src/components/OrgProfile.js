import React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import { BsArrowDownSquareFill, 
    BsArrowDownSquare, 
    BsArrowUpSquareFill, 
    BsArrowUpSquare } from "react-icons/bs";

const OrgProfile = (props) => {
    const [orgArray, setOrgArray] = useState("");

    const getProps = async (QVContract) => {
        const propz = await QVContract.getuserProposals();
        setOrgArray(propz)
        console.log(propz)
        return propz
    }

    useEffect(() => {
        const QVContract = props.contract;
        if(QVContract){
            getProps(QVContract)
        }
    }, [props.contract]);
    return (
        <div>
            {
                orgArray.length > 0 ?
                <div>
                    <div className='lrg-title'>Proposals</div>
                    <div className='proplist-wrap'>
                        {
                            orgArray.map((prop)=>(
                                <div className='prop-card'>
                                    <div className='title-wrap'>
                                        <div className='sm-title'>{prop.title}</div>
                                        <div><small>ID#</small>{Number(prop.pid)}</div>
                                    </div>
                                    <div className='prop-body'>
                                        
                                        <div className='desc-wrap'>
                                            {ReactHtmlParser(prop.description)}
                                        </div>
                                        <div className='voting'>
                                            <div className='form-wrap'>
                                                <form action="" className='vote-side-up'>
                                                    <input className='vote-input' type="number"/>
                                                    <button type='submit' className='vote-btn-up'>
                                                        <BsArrowUpSquare />
                                                    </button>
                                                </form>
                                                <form action="" className='vote-side-down'>  
                                                    <button type='submit' className='vote-btn-down'>
                                                        <BsArrowDownSquare />
                                                    </button>
                                                    <input className='vote-input' type="number"/>
                                                </form>
                                            </div>
                                        </div>
                                        <div className='prop-created'>Created by: {prop.creator}</div>
                                        <div className='time-wrap'>
                                            <div>Created: {Number(prop.creationTime)}</div>
                                            <div>Duration: {Number(prop.duration)}</div>
                                        </div>
                                        
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
                :
                <div>No Proposals</div>
            }
        </div>
    );
};

export default OrgProfile;
