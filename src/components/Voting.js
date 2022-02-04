import React from 'react';
import { BsArrowDownSquareFill, 
    BsArrowDownSquare, 
    BsArrowUpSquareFill, 
    BsArrowUpSquare } from "react-icons/bs";
import { useEffect, useState } from 'react';

const Voting = (props) => {
    const creation = props.creation
    const duration = props.duration
    const edate = creation + duration
    const cdate = Date.now()/1000

    if(cdate > edate){
        return (
            <div className='vote-end-wrap'>
                <div className='sm-title'>Voting Has Ended.</div>
                <div className='result-stats'>
                    <div className='up-wrap'>
                        <div className='vote-count'>{props.votesUp}</div>
                        <div>Up Votes</div>
                    </div>
                    <div className='down-wrap'>
                        <div className='vote-count'>{props.votesDown}</div>
                        <div>Down Votes</div>
                    </div>
                </div>
            </div>
        );
    }else{
        return(
            <div className='voting'>
                <div className='form-wrap'>
                    <form action="" onSubmit={(e) => {
                        e.preventDefault()
                        props.voteUp(props.pid)
                    }}>
                        <div className='vote-count'>{Number(props.upVotes)}</div>
                        <div className='vote-side-up'>
                            <input className='vote-input' type="number" onChange={(e)=>{props.setUpAmount(e.target.value)}}/>
                            <button type='submit' className='vote-btn-up'>
                                <BsArrowUpSquare />
                            </button>
                        </div>
                    </form>
                    <form action="" onSubmit={(e)=> {
                        e.preventDefault()
                        props.voteDown(props.pid)
                    }}>
                        <div className='vote-count'>{Number(props.downVotes)}</div>
                        <div className='vote-side-down'>
                            <button type='submit' className='vote-btn-down'>
                                <BsArrowDownSquare />
                            </button>
                            <input className='vote-input' type="number" onChange={(e)=>{props.setDownAmount(e.target.value)}}/>
                        </div>  
                    </form>
                </div>
            </div>
        )
        
    }
    
};

export default Voting;
