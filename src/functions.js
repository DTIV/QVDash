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

export const getContractData = async (contract, setContractMeta) => {
  const chains = [137, 56, 43114]
  const temp = []
  for(let i=0; i<chains.length; i++){
    const chainId = chains[i]
    const url = `https://api.covalenthq.com/v1/${chainId}/tokens/tokenlists/all/?key=${process.env.REACT_APP_COVKEY}`
    const response = await fetch(url);
    const data = await response.json()
    const meta = data.data.items
    if(contract){
      const addy = contract.toLowerCase()
      const matcher = meta.filter((proposal) => (proposal.contract_address == addy))
      if(matcher.length > 0){
        if(setContractMeta){
          setContractMeta(matcher[0])
          return matcher
        }
      }
    }
  }
}

getContractData("0x9e70e94fcd61373445ff8ea840783e02a852a8b6")
// getFullContractMeta()