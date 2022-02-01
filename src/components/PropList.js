import React from 'react';
import { useEffect, useState } from 'react';
import { BsArrowDownSquareFill, 
    BsArrowDownSquare, 
    BsArrowUpSquareFill, 
    BsArrowUpSquare } from "react-icons/bs";
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';

const PropList = ({contract, currentOID, orgArray, userCredits }) => {
    const [downAmount, setDownAmount] = useState(0);
    const [upAmount, setUpAmount] = useState(0);

    const voteUp = async (pId) => {
        console.log("voting up")
        if(contract && upAmount <= userCredits){
            if(upAmount > 0){
                const vote = contract.castVote(currentOID, pId,1,upAmount)
            }
        }
    }

    const voteDown = async (pId) => {
        if(contract && downAmount <= userCredits){
            if(downAmount > 0){
                const vote = contract.castVote(currentOID, pId,0,downAmount)
            }
        }
    }

    const isActive = (creation, duration) => {
        const edate = creation + duration
        const cdate = Date.now()/1000
        if(cdate > edate){
            return "ENDED"
        }
        return "ACTIVE"
    }

    return (
        <div className='proplist-wrap'>
            {
                orgArray.map((prop)=>(
                    <div key={Number(prop.pid)} className='prop-card'>
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
                                    <form action="" onSubmit={(e) => {
                                        e.preventDefault()
                                        voteUp(prop.pid)
                                    }}>
                                        <div className='vote-count'>{Number(prop.upVotes)}</div>
                                        <div className='vote-side-up'>
                                            <input className='vote-input' type="number" onChange={(e)=>{setUpAmount(e.target.value)}}/>
                                            <button type='submit' className='vote-btn-up'>
                                                <BsArrowUpSquare />
                                            </button>
                                        </div>
                                    </form>
                                    <form action="" onSubmit={(e)=> {
                                        e.preventDefault()
                                        voteDown(prop.pid)
                                    }}>
                                        <div className='vote-count'>{Number(prop.downVotes)}</div>
                                        <div className='vote-side-down'>
                                            <button type='submit' className='vote-btn-down'>
                                                <BsArrowDownSquare />
                                            </button>
                                            <input className='vote-input' type="number" onChange={(e)=>{setDownAmount(e.target.value)}}/>
                                        </div>  
                                    </form>
                                </div>
                            </div>
                            <div className='prop-created'>Created by: {prop.creator}</div>
                            <div className='time-wrap'>
                                <div>Created: {Number(prop.creationTime)}</div>
                                <div>Duration: {Number(prop.duration)}</div>
                                <div>State : {isActive(Number(prop.creationTime),Number(prop.duration))}</div>
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    );
};

export default PropList;
