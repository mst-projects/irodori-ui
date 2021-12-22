import React, { useEffect, useState } from "react";
import './styles/App.css';
import { ethers } from "ethers";
import myEpicNft from './utils/irodoriNFT.json';

const TWITTER_HANDLE = '_buildspace';
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;

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

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account)
    } else {
      console.log("No authorized account found")
    }
  }

  /*
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      /*
      * Fancy method to request access to account.
      */
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      /*
      * Boom! This should print out public address once we authorize Metamask.
      */
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
    } catch (error) {
      console.log(error)
    }
  }

  const askContractToMintNft = async (_baseFrequency, _numOct, _seed) => {
  const CONTRACT_ADDRESS = "0xB956A28d847Dc9b78fCA08c6624410aBB600F09F";

  try {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

      console.log("Going to pop wallet now to pay gas...")
      let nftTxn = await connectedContract.makeAnEpicNFT(_baseFrequency, _numOct, _seed);

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

  // Render Methods
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

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  /*
  * Added a conditional render! We don't want to show Connect to Wallet if we're already conencted :).
  */
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Irodori NFT🌈</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today🌞
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
        </div>
      </div>
    </div>
  );
};

export default App;