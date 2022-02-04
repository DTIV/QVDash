import React from 'react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ConnectButton from './ConnectButton';
import { Chains, getContractMeta } from '../functions';

const Header = (props) => {
    const [chains, setChains] = useState("");

    useEffect(() => {
        const elem = document.getElementById('network-select');
        elem.value = props.currentNetwork
        const chains = Chains(setChains)
    }, [props.currentNetwork])

    return (
    <div className='navbar'>
        <div>
            <Link to="/">
                <span className='qv-logo'>QV</span><span className='dash-logo'>dash</span> 
            </Link>
        </div>
        <div className='menu'>
            {
                props.orgActive ?
                <Link to="/create/proposal">
                    Create
                </Link>
                :
                <Link to="/create/org">
                    Create
                </Link>
            } 
        </div>
        <div className='sidenav-netwrap'>
            <div className='account-menu-txt'>
                {props.account.slice(0,2)+"..."+props.account.slice(38,43)}
            </div>
            {
                chains ?
                <select className='select-btn' name="" id="network-select">
                    <option className='select-option' value={4}>Rinkeby</option>
                    {
                        chains.map((chain) => (
                            <option className='select-option' key={chain.chain_id} value={chain.chain_id}>{chain.label}</option>
                        ))
                    }
                </select>
                :
                <select className='select-btn' name="" id="network-select">
                    {/* ADD NETWORKS HERE */}
                    <option value={1}>Mainnet</option>
                    <option value={4}>Rinkeby</option>
                    <option value={56}>BSC</option>
                    <option value={137}>MATIC</option>
                    <option value={43114}>AVAX</option>
                </select>
                
            }
            
            <div>
                <ConnectButton connecting={props.connecting} connected={props.connected} connect={props.connect} />
            </div>
            
        </div>
        
    </div>
    );
};

export default Header;
