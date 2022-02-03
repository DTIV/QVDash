import React from 'react';
import { useEffect, useState } from 'react';
import { BsArrowDownSquareFill, 
    BsArrowDownSquare, 
    BsArrowUpSquareFill, 
    BsArrowUpSquare } from "react-icons/bs";
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import Voting from './Voting';

const PropList = ({contract, currentOID, orgArray, userCredits }) => {
    const [downAmount, setDownAmount] = useState(0);
    const [upAmount, setUpAmount] = useState(0);
    const [getResults, setResults] = useState(false)
    const [votesUp, setVotesUp] = useState(0);
    const [votesDown, setVotesDown] = useState(0);
    const [result, setResult] = useState("")
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
            setResults(true)
            return "ENDED"
        }
        return "ACTIVE"
    }

    const checkResults = async (pId, orgId, contract) => {
        if(contract){
            const total = await contract.totalVotes(pId, orgId)
            const upvotes = Number(total[0])
            const downvotes = Number(total[1])
            setVotesUp(upvotes)
            setVotesDown(downvotes)
            if(getResults){
                if(upvotes > downvotes){
                    setResult("PASSED")
                }else if(upvotes < downvotes){
                    setResult("FAILED")
                }else if(upvotes == downvotes){
                    setResult("EQUAL")
                }
            }
        }
    }

    return (
        <div className='proplist-wrap'>
            {
                orgArray.map((prop)=>(
                    <div key={Number(prop.pid)} className='prop-card'>
                        <div className='title-wrap'>
                            <div className='sm-title'>{prop.title}</div>
                            <div className='result-outcome'>{result}</div>
                            <div><small>ID#</small>{Number(prop.pid)}</div>
                        </div>
                        <div className='prop-body'>
                            
                            <div className='desc-wrap'>
                                {ReactHtmlParser(prop.description)}
                            </div>
                            <Voting 
                                getResults={getResults}
                                voteUp={voteUp}
                                voteDown={voteDown}
                                setUpAmount={setUpAmount}
                                setDownAmount={setDownAmount}
                                checkResults={checkResults}
                                pid={prop.pid}
                                upVotes={prop.upVotes}
                                downVotes={prop.downVotes}         
                                contract={contract}
                                oid={currentOID}
                                votesUp={votesUp}
                                votesDown={votesDown}/>
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
