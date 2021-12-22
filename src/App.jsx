import React, { useEffect, useState } from "react";
import './styles/App.css';
import { ethers } from "ethers";
import irodoriNft from './utils/irodoriNFT.json';

const CONTRACT_ADDRESS = "0x0fa7FBE206AE4556a1Ff7D88Da049f973812a559";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [baseFrequency, setBaseFrequency] = useState("");
  const [numOct, setNumOct] = useState("");
  const [seed, setSeed] = useState("");
  
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    let chainId = await ethereum.request({ method: 'eth_chainId' });
    console.log("Connected to chain " + chainId);


    const rinkebyChainId = "0x4"; 
    if (chainId !== rinkebyChainId) {
      alert("You are not connected to the Rinkeby Test Network!");
    }

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account)
      setupEventListener()
    } else {
      console.log("No authorized account found")
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
      setupEventListener() 

    } catch (error) {
      console.log(error)
    }
  }

  const setupEventListener = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, irodoriNft.abi, signer);

        connectedContract.on("NewIrodoriNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          alert(`Your NFT has been minted to your wallet. Please check the NFT in Opensea from the link (It can take 10 minutes to show up in Opensea): https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
        });

        console.log("Setup event listener!")

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const askContractToMintNft = async (_baseFrequency, _numOct, _seed) => {

  try {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, irodoriNft.abi, signer);

      console.log("Going to pop wallet now to pay gas...")
      let nftTxn = await connectedContract.createNFT(_baseFrequency, _numOct, _seed);

      console.log("Mining...please wait.")
      await nftTxn.wait();
      
      console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);

    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log(error)
  }
}

  // render if wallet is not connected
  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  const handleChangeOfBaseFrequency = (e) => {
    setBaseFrequency(e.target.value);
  };

  const handleChangeOfNumOct = (e) => {
    setNumOct(e.target.value);
  };

    const handleChangeOfSeed = (e) => {
    setSeed(e.target.value);
  };

  const handleSubmitOfAttributes = (e) => {
    e.preventDefault();
    askContractToMintNft(baseFrequency, numOct, seed);
  }

  // if wallet is already connected
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Irodori NFT🌈</p>
          <p className="sub-text">
            Discover your fully on-chain NFT today🌞
          </p>
          {currentAccount === "" ? (
            renderNotConnectedContainer()
          ) : (
            <form onSubmit={handleSubmitOfAttributes}>
              <label>
              <p className="sub-text"> 
              Choose numbers you like!
              </p>
              <div>
              <input className="form-control" type="text" placeholder="Base Frequency (0 to 1)" value={baseFrequency} onChange= {handleChangeOfBaseFrequency} />
              </div>

              <div>
              <input className="form-control" type="text" placeholder="Num Octaves (0 to 1000)" value={numOct} onChange= {handleChangeOfNumOct} />
              </div>

              <div>
              <input className="form-control" type="text" placeholder="Seed (Any number)" value={seed} onChange= {handleChangeOfSeed} />
              </div>

              </label>
              <div>
              <input type="submit" value="Mint" className="cta-button mint-button"/>
              </div>
            </form>
          )}
          <div className="footer-container footer-text">
          Reference:
          </div>

          <div className="footer-container">
          <a className=" footer-text" target="_blank" rel="norefferrer" href="https://omochi-bigaku.com/metamask-install-chrome/">メタマスクのダウンロード方法</a>
          </div>

          <div className="footer-container">
          <a className=" footer-text" target="_blank" rel="norefferrer"　href="https://rinkeby.etherscan.io/address/0x0fa7FBE206AE4556a1Ff7D88Da049f973812a559">Get ETH on Rikeby testnet from faucet (Free)</a>
          </div>

          <div className="footer-container">
          <a className=" footer-text" target="_blank" rel="norefferrer"　href="https://rinkeby.etherscan.io/address/0x0fa7FBE206AE4556a1Ff7D88Da049f973812a559">Check the Smart Contract in Rinkeby Etherscan</a>
          </div>

          <div className="footer-container">
          <a className=" footer-text" target="_blank" rel="norefferrer"　href="https://testnets.opensea.io/collection/irodori-kbvlzhb4pb">Check the collection on Opensea</a>
          </div>

          <div className="footer-container">
          <a className=" footer-text"　target="_blank" rel="norefferrer"　href="https://rinkeby.rarible.com/collection/0x0fa7fbe206ae4556a1ff7d88da049f973812a559">Check the collection on Rarible</a>
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;