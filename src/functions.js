import { selectOptions } from "@testing-library/user-event/dist/select-options";

export const detectProvider = () => {
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

export const Chains = (setChains) => {
  // Get all chains
  const endpoint = 'chains'
  const url = 'https://api.covalenthq.com/v1/'+endpoint+"/?key="+process.env.REACT_APP_COVKEY
  fetch(url)
    .then(res => res.json())
    .then(data => {
      setChains(data.data.items)
    })
}

export const getChainContractMeta = (chainId, setMeta) => {
  const chains = [137, 56, 43114]
  if(chains.includes(chainId)){
    const url = `https://api.covalenthq.com/v1/${chainId}/tokens/tokenlists/all/?key=${process.env.REACT_APP_COVKEY}`
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setMeta(data.data.items) 
      })
  }
}

export const getFullContractMeta = () => {
  const chains = [137, 56, 43114]
  const temp = []
  for(let i=0; i<chains.length; i++){
    console.log(i)
    const chainId = chains[i]
    if(chains.includes(chainId)){
      const url = `https://api.covalenthq.com/v1/${chainId}/tokens/tokenlists/all/?key=${process.env.REACT_APP_COVKEY}`
      fetch(url)
        .then(res => res.json())
        .then(data => {
          temp.push(data.data.items)
        })
    }
  }
}

export const getHistorical = async (chainId, contract) => {
  if(contract){
    const url = `https://api.covalenthq.com/v1/pricing/historical_by_addresses_v2/${chainId}/usd/${contract}/?key=${process.env.REACT_APP_COVKEY}`
    const response = await fetch(url);
    const data = await response.json()
    
    if(data.data){
      console.log(data.data)
      return data.data.prices[0]
    }
  }
}

export const getTokenHolders = async (chainId, contract) => {
  // const latestBlock = await getLatestBlock(chainId)
  const url = `https://api.covalenthq.com/v1/${chainId}/tokens/${contract}/token_holders/?key=${process.env.REACT_APP_COVKEY}`
  const response = await fetch(url);
  const data = await response.json()
  return data.data.items
}

export const getTransactions = async (chainId, contract) => {
  const url = `https://api.covalenthq.com/v1/${chainId}/address/${contract}/transactions_v2/?key=${process.env.REACT_APP_COVKEY}`
  const response = await fetch(url);
  const data = await response.json()
  return data.data
}

export const getContractData = async (contract, setContractMeta) => {
  const chains = [137, 56, 43114, 1]
  const dexs = await supportedDex()
  for(let i=0; i<chains.length; i++){
    const data = await getHistorical(chains[i],contract)
    console.log(data)
    if(data && data.contract_decimals){
      if(data.prices){
        const dataframe = data.prices[0]
        dataframe['chain'] = chains[i]
        console.log(dataframe)
        setContractMeta(dataframe)
        return dataframe
      }
    }
  }
}

export const getLatestBlock = async (chainId) => {
  const blockUrl = `https://api.covalenthq.com/v1/${chainId}/block_v2/latest/?key=${process.env.REACT_APP_COVKEY}`
  const blockRes = await fetch(blockUrl);
  const blockData = await blockRes.json()
  const latestBlock = blockData.data.items[0].height
  return latestBlock
}

export const getLogEvents = async (chainId, contract) => {
  const latestBlock = await getLatestBlock(chainId)
  if(latestBlock){
    const url = `https://api.covalenthq.com/v1/${chainId}/events/address/${contract}/?starting-block=${latestBlock-1000}&ending-block=${latestBlock}&key=${process.env.REACT_APP_COVKEY}`
    const response = await fetch(url);
    const data = await response.json()
    return data.data.items
  }
}

export const supportedDex = async () => {
  const url = `https://api.covalenthq.com/v1/xy=k/supported_dexes/?key=${process.env.REACT_APP_COVKEY}`
  const response = await fetch(url);
  const data = await response.json()
  return data.data.items
}
