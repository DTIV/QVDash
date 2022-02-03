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

export const Chains = (key, setChains) => {
  // Get all chains
  const endpoint = 'chains'
  const url = 'https://api.covalenthq.com/v1/'+endpoint+"/?key="+key
  fetch(url)
    .then(res => res.json())
    .then(data => {
      setChains(data.data.items)
    })
}

export const getContractMeta = (chainId, setMeta) => {
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