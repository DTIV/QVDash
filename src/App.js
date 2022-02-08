/*
QVDash
Copyright (C) 2021 dtiv & ritikdhasmana
 
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Header from "./components/Header";
import { Routes,Router, Route, Link } from "react-router-dom";

import ContractAddress from './contractData/contracts-address.json'
import ContractAbi from './contractData/abi.json'
// import { detectProvider } from './functions'
import CreateProps from "./components/CreateProps";
import CreateOrg from "./components/Org/CreateOrg";
import OrgProfile from "./components/Org/OrgProfile";
import OrgPage from "./components/Org/OrgPage";

import { getChainContractMeta } from './functions';


function App() {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [getError, setError] = useState(false);
  const [getCurrentAccount, setCurrentAccount] = useState("");
  const [getCurrentNetwork, setCurrentNetwork] = useState("");
  const [getProvider, setProvider] = useState(false);
  const [getEtherBal, setEtherBal] = useState("");
  const [isOrg, setIsOrg] = useState(false)
  const [getContract, setContract] = useState("")
  const [orgActive, setOrgActive] = useState(false)
  const [meta, setMeta] = useState("");
  const contract = ContractAddress.Token
  const abi = ContractAbi.abi
  
  const detectProvider = () => {
      // Get provider
      let provider;
      if(window.ethereum) {
        provider = window.ethereum;
      } else if (window.web3) {
        provider = window.web3.currentProvider;
      }else{
        window.alert("No Ethereum browser detected")
      }
      return provider
  }

  
  

  useEffect(()=> {
    // Set provider and check connection
    const Disconnect = () => {
      setConnected(false)
      setCurrentAccount("")
      setCurrentNetwork("")
    }


    const provider = detectProvider()
    setProvider(provider)
    if(provider){
      provider.request({ method: 'eth_accounts' })
      .then((res) => {
        if(res.length > 0){
          setConnected(true)
          onConnect(provider)
        }else{
          Disconnect()
        }
      })
    }
  },[getCurrentAccount, getProvider])

  useEffect(() => { 
    // Handle account and network changes
    const handleAccountsChanged = async () => {
      const accounts = await getProvider.request({method: 'eth_accounts'})
      setCurrentAccount(accounts)
    }

    const handleNetworkChanged = async () => {
      const chainId = await getProvider.request({ method: 'eth_chainId' });
      setCurrentNetwork(parseInt(chainId))
    }

    if(connected){
      getProvider.on('accountsChanged', handleAccountsChanged);
      getProvider.on('chainChanged', handleNetworkChanged);
      return () => {
        getProvider.removeListener('accountsChanged', handleAccountsChanged);
        getProvider.removeListener('chainChanged', handleNetworkChanged);
      }
    }
  }, [connected, getProvider])
  
  useEffect(() => {
    getChainContractMeta(137, setMeta)
  }, [getCurrentNetwork])

  const Connect = async () => {
    // METAMASK CONNECT
    if(getProvider) {
      if(getProvider !== window.ethereum) {
        console.error("Not window.ethereum provider!")
      }
      setConnecting(true);
      try{
        await getProvider.request({
          method: "eth_requestAccounts"
        })
      }catch(err){
        setError(err);
      }
      onConnect(getProvider)
      setConnecting(false);
    }
  }

  const onConnect = async (provider) => {
    // ETHERS.JS CONNECT
    const chain_id = await provider.request({ method: 'eth_chainId' })
    const eth = new ethers.providers.Web3Provider(provider);
    const accounts = await eth.listAccounts()
    try{
      const signer = eth.getSigner()
      const address = await signer.getAddress()
      const QVContract = new ethers.Contract(contract, abi, signer)
      const weiBalance = (await eth.getBalance(accounts[0])).toString()
      const etherBalance = (Number(weiBalance)/10**18).toFixed(5)
      const tx = await QVContract.checkOrgActive()
      setOrgActive(tx)
      provider.request({ method: 'eth_accounts' })
      .then((res) => {
        if(res.length > 0){
          setConnected(true)
          setCurrentAccount(accounts[0])
          setCurrentNetwork(parseInt(chain_id))
          setEtherBal(etherBalance)
          setContract(QVContract)
          // setIsOrg(isOrganize)
        }else{
          setConnected(false)
        }
      })
    }catch (err) {
      console.log(err)
    }
  }
  
  const closeError = () => {
    setError(false)
    setConnecting(false)
  }

  // console.log(meta)
  return (
    <div className="App">
      <Header 
      connecting={connecting} 
      connected={connected} 
      connect={Connect} 
      account={getCurrentAccount}
      currentNetwork={getCurrentNetwork}
      balance={getEtherBal}
      detect={detectProvider}
      closeError={closeError}
      orgActive={orgActive}
      contract={getContract}/>
      <div className="inner-body">
        <Routes >
          <Route exact path="/create/proposal" element={
            <CreateProps
              connected={connected} 
              connect={Connect}
              abi={abi}
              contract={contract}/>
          }/>
         
          <Route exact path="/create/org" element={ 
            <CreateOrg 
              connected={connected} 
              connect={Connect}
              abi={abi}
              contract={contract}
              currentNetwork={getCurrentNetwork}
              connected={connected}/>
          }/> 

          <Route exact path="/" element={
            <OrgPage 
              contract={getContract}
              orgActive={orgActive}
              currentNetwork={getCurrentNetwork}
              connected={connected}
              />
          }/>
          <Route exact path="/org/:id" element={
            <OrgProfile 
              contract={getContract}
              orgActive={orgActive}
              account={getCurrentAccount}
              />
          }/>
        </Routes>
      </div>
    </div>
  );
}
export default App;
