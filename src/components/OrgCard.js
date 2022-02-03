import React from 'react';
import { Link } from 'react-router-dom';

const OrgCard = (props) => {
    return (
        <Link to={`/org/${Number(props.oid)}`} key={props.oid} className='orglist-card'>
            <div className='otop-wrap'>
                <div className='org-name'>{props.name}</div>
                <div><small>ID#</small>{Number(props.oid)}</div>
            </div>
            <div className='oprop-wrap'>
                <div className='prop-count'>{Number(props.ProposalCount)}</div>
                <div>Proposals</div>
            </div>
        </Link>
    );
};

export default OrgCard;
