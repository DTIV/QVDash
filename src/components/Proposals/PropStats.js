import React from 'react';

const PropStats = (props) => {
    return (
        <div className='user-stats'>
            <div className='userstats-wrap'>
                <div className='user-credit'>
                    <div className='prop-stat'>{props.userCredits}</div>
                    <div>Credits</div>
                </div>
                <div>
                    <div className='prop-stat'>{props.orgTokenSupply}</div>
                    <div>Token Supply</div>
                </div>
                <div>
                    <div className='prop-stat'>{props.memberCount}</div>
                    <div>Members</div>
                </div>
            </div>
        </div>
    );
};

export default PropStats;
