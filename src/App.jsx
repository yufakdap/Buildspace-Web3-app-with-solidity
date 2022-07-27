import React,{useEffect,useState} from "react";
import {ethers} from "ethers";
import './App.css';
import abi from "./utils/WavePortal.json";

const App=()=> {
  const[message,setMessage]=useState("");
  const [currentAccount, setCurrentAccount] = useState("");

  const [allWaves, setAllWaves]=useState([]);

  const contractAddress="0x64605DE658B5cE6191BeCB204a1635b253BBD301"

  const contractABI=abi.abi;

  const getAllWaves=async ()=>{
    try{
      const {ethereum}=window;
      if(ethereum){
        const provider= new ethers.provider.Web3Provider(ethereum);
        const signer= provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        const waves=await wavePortalContract.getAllWaves();

        let wavesCleaned=[];
        waves.forEach(wave=>{
          wavesCleaned.push({
            address:wave.waver,
            timestamp:new Data(wave.timestamp*1000),
            message:wave.message
            
          });
        });
        setAllWaves(wavesCleaned);
      }else{
        console.log("ethereum object dosen't exist!")
      }
    }catch(error){
      console.log(error);
    }
  }

  const checkIfWalletIsConnected = async () => {
    try{
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
      } else {
        console.log("We have the ethereum object", ethereum);
      }
    const accounts= await ethereum.request({method:"eth_accounts"});
    if(accounts.length !==0){
      const account = accounts[0];
      console.log("Found an Authorised account:",account);
      setCurrentAccount(account)
    }else{
    console.log("no Authorized account Found")
    }
  }catch(error){
    console.log(error);
  }
}

const connectWallet= async()=>{
  try{
    const{ethereum}=window;
    if(!ethereum){
      alert("Get Metamask");
      return;
    }
    const accounts= await ethereum.request({method:"eth_requestAccounts"});
    console.log("Connected",accounts[0]);
    setCurrentAccount(accounts[0]);
  }catch(error){
    console.log(error)
  }
}

const wave = async (message) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        
        const waveTxn = await wavePortalContract.wave(message,{gasLimit: 3000000});
     

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        /*
        * Execute the actual wave from your smart contract
        */
       
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

useEffect(()=>{
  checkIfWalletIsConnected();
  
},[])

  

  return (
    <div classs=" bg">
     
      
      
    <div className="mainContainer" class="nes-container is-riunded is-dark">
        < div class="connect-wallet">
         {!currentAccount &&(
        <button type="button" class="nes-btn is-success"onClick={connectWallet}>Connect Wallet</button>)}
        <h1></h1>
        </div>
            <div class="icon">
            <p class="title">
            <i class="nes-icon twitter is large"></i></p>
            </div>
                <div class="heading">
                <h1>D-twitter</h1>
                </div>
      
      <div className="dataContainer" class="nes-container is-riunded is-dark">
        <div className="header">
        <p>👋 Yoo Hi, What's in your mind..!</p>
          
        </div>

        <div class="nes-container is-riunded is-dark">
      I am Dev and I am trying to make decentralized Twitter, there is nothing fancy right now, you can just tweet something and it will be saved on the blockchain. that's pretty cool, right? Connect your Ethereum wallet and tweet me your thoughts!
          your tweets will be saved on the blockchain
        </div>
       <div class="intractions">  
            <div class="button">
            <button type="button" class="nes-btn is primary" onClick={wave}>
          tweet
            </button>
          </div>
       
          
            <div class="input"> 
            <input class="nes-input is_dark" id="dark_field" type="url" autoComplete="off" placeholder="Write Here.." value={message} onChange={(e) => setMessage(e.target.value)}></input>

              
      {allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })}
        
            </div>
        </div>
      </div>

    </div>

      
   
  </div>
    
  );
}
export default App

