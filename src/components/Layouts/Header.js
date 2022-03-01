import React from 'react';
import {Container, Navbar, Nav, Badge, Dropdown, Modal, Row, Col, Button} from 'react-bootstrap';
import { ToastContainer, Toast, Zoom, Bounce, toast} from 'react-toastify';
import {
    NavLink as Link
  } from "react-router-dom";
import { useState } from "react";
import url from "../../configurl"
import { useEffect } from "react";
import Logo from '../../assets/images/logo.png';
import colorLogo from '../../assets/images/modal-logo.png'
import MyAlgoConnect from '@randlabs/myalgo-connect';
import algosdk from "algosdk";
import config from "../../configurl";
import {b64decode,base64} from "algosdk";
import axios from 'axios';
import { asset3id,asset1id,asset2id,asset1WithId,asset2WithId,readingLocalstateWithAppid ,escrowdata,readingLocalstate,rewardasset3,rewardasset1,rewardasset2} from '../formula';

const myAlgoWallet = new MyAlgoConnect();

const algodClient = new algosdk.Algodv2('', 'https://api.testnet.algoexplorer.io', '');
const baseServer = "https://testnet-algorand.api.purestake.io/idx2";
const port = "";

const token = {
    'X-API-key': '9oXsQDRlZ97z9mTNNd7JFaVMwhCaBlID2SXUOJWl',
}

let indexerClient = new algosdk.Indexer(token, baseServer, port);

let appID_global = 57691024;

function Header() {
    
    const [show, setShow] = React.useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const[as1,setas1] = useState([]);
    const[as2,setas2] = useState([]);
    const[as3,setas3] = useState([]);
    const[getData,setGet] = useState("");
    const[dbdata,setdbdata] = useState([]);
    const[asPrice,setasprice] = useState([]);
    const[esassets,setesassets] = useState([]);
    // const[tok1,settok1] = useState([]);
    // const[tok2,settok2] = useState([]); 

    const connectWallet = async () => {
       try {
          const accounts = await myAlgoWallet.connect();
          const addresses = accounts.map((account) => account.address);
//get start
await axios.get(`${url}/users/`).then(async (response)=>{
    console.log("get method =",response.data['length']);
    let get = response.data;
    let len = response.data['length'];
    for(let i = 0; i < len; i++)
    {
        let accountFind= get[i]['algoAddress'];
        if(accountFind === addresses[0])
        {

            // let userResponse =
            // {
            //     "userKey": "8",
            //     "algoAddress": "SNLUOQXMVQXQVOWV2UT2WGORJCJBEIC5J7HCRARUQVSN3QMH3QRPEOO6NE",
            //     "creationTime": "2022-02-08 07:48:45",
            //     "accountType": null,
            //     "profileName": null,
            //     "twitterName": "Launchpad tested",
            //     "profileURL": null,
            //     "asset1Name": null,
            //     "asset2Name": null,
            //     "escrowData": null
            // }
            // userResponse.accountType = "walletconnect"
            // console.log(userResponse);
            // setGet(get[i]);
            let getData = (get[i]);
            getData.accountType = "connected wallet";
            console.log(getData);
            // let postData = getData.replace('"profileName": null,','"profileName": "postCheck",');
            // console.log()
            await axios.post(`${url}/users`,getData)
        .then(async(responseuser) => {
            console.log("post method = ",responseuser.data);
       }).catch((e) => {
           // toast.error("Error = ",e);
             console.error(e);
            });
            break;
        }
    }
    }).catch((e) => {
        toast.error("Error = ",e);
          console.error(e);
         });
//get end



          //axios post start

        //   let userjsonkey= {
        //     "algoAddress": addresses[0],
        //     "creationTime": new Date(),
        //     "accountType": "Connected wallet" 
        // }
        // console.log(getData);
    
        
         //axios post end



          console.log("addresses : ", addresses);
          localStorage.setItem("walletAddress", addresses[0]);
        // window.location.reload();
          setShowButton(false);
        } catch (err) {
          console.error(err);
        }
      };
      const [showButton, setShowButton] = useState(true);
      const[wb,setwb]=useState("");
      let walletAddress = localStorage.getItem("walletAddress");
      const wallet = async() => {
        let v = localStorage.getItem("walletAddress");
        let account1_info = (await algodClient.accountInformation(v).do());      
        let calc=JSON.stringify(account1_info.amount)/1000000; 
        setwb(calc)
        console.log("walletbalance",calc)
        if(v){
          setShowButton(false)
        }
        else{
          setShowButton(true)
        }
        // first()
      }
      useEffect(() =>{wallet()},[localStorage.getItem("walletAddress"),showButton])
    useEffect(() =>{funUsefirst()},[])
     
    
      const Disconnect = async() => {
        localStorage.setItem("walletAddress", "");
        window.location.reload();
        setShowButton(true)
      }
      let asset1 =[];

      const funUsefirst = () =>{
        if(dbdata.length <= 0){
            first();
         }
      }

      const first = async() =>{
        let a = await readingLocalstateWithAppid(algodClient,localStorage.getItem("walletAddress"),appID_global);
        console.log("avalue",a)
        // setdbdata(a);
        let edata =[];
        a.map(async(v)=>{
            console.log("v",v['key'])
            let set = Buffer.from(v['key'], 'base64');
            
        //for decoding escrow address
            let b = (algosdk.encodeAddress(set.slice(0,32)))        
            // escAddr.push(b);

         //get three assets
         let escData = await readingLocalstate(algodClient,b);  
         console.log("escdata",escData.assets) 
        
        //  asset1.push(escData.assets);
         console.log(asset1)
         
           // assetid1
        //    let esc = await asset1id(escData);
        //    assertId1.push(esc);
        //    console.log("assert1id",assertId1)
        //    if(esc){
        //     assertId2.push(await asset2id(escData));
        //     console.log("assert2id",assertId2)
        //    }
        let esc = await asset3id(escData);
        let asname =  await indexerClient.lookupAssetByID(esc).do();
            
        // assertId1.push(asname.asset.params.name);
           
    
        //for decoding asset address
            let cal =  (algosdk.decodeUint64(set.slice(33,41)));
            console.log("cal",cal)
            // assetid.push(cal)

      
        //asset id
            let assId =  await indexerClient.lookupAssetByID(cal).do();
            console.log((assId.asset.params.name));
            // assetname.push(assId.asset.params.name);

            let assBalance = v['value']['uint']
            console.log("balance",assBalance)
            // assetBalance.push(assBalance);

           let  ebdata ={
                "escrowAddress":b,
                "thirdasset":asname.asset.params.name,
                "assetid":cal,
                "assetname":assId.asset.params.name,
                "asbalance":assBalance
            }
            edata.push(ebdata)
            console.log("edata",edata)
        })
       
        setdbdata(edata);
        setesassets(asset1);
        // setas1(assetid);
        // setas2(assetname);
        // setas3(assetBalance)
        // setas4(escAddr)
        // settok1(assertId1);
        // settok2(assertId2);
        console.log("asserts",edata)
        
        
       
      }
      const redeem =()=>{
          console.log("esassets",dbdata.length)
         if(dbdata.length > 0){
            handleShow();
         }
         else{
            first();
            handleShow();
         }
          
          
            
          
          
      }
      const waitForConfirmation = async function (algodclient, txId) {
        let status = await algodclient.status().do();
        let lastRound = status["last-round"];
        while (true) {
          const pendingInfo = await algodclient
            .pendingTransactionInformation(txId)
            .do();
          if (
            pendingInfo["confirmed-round"] !== null &&
            pendingInfo["confirmed-round"] > 0
          ) {
            //Got the completed Transaction
            console.log(
              "Transaction " +
                txId +
                " confirmed in round " +
                pendingInfo["confirmed-round"]
            );
            break;
          }
          lastRound++;
          await algodclient.statusAfterBlock(lastRound).do();
        }
      };
      const RedeemAmount =async (appid,t,assetid,amt) => {
        
        let index = parseInt(appid);
        console.log("appId inside donate", index)
        let accinfo = await readingLocalstate(algodClient,t);
        let Id1 = await asset1WithId(accinfo);
        let Id2 = await asset2WithId(accinfo);
        let Id3 = await asset3id(accinfo);
        let lsig = await escrowdata(appID_global,Id1,Id2);
        console.log("lsigaddress",lsig.address())
        try {
          const params = await algodClient.getTransactionParams().do();
          
          let sender =localStorage.getItem("walletAddress");;
          let recv_escrow = lsig.address();
          let amount = 3000;
          
          let note1=[];
          note1.push(new Uint8Array(Buffer.from("fee")));
          let transaction1 = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            from: sender, 
            to: recv_escrow, 
            amount: amount, 
            //  note: note1,  
             suggestedParams: params
           });
         
           let appArg = [];
           appArg.push(new Uint8Array(Buffer.from("redeem")));
          //  appArg.push(new Uint8Array(Buffer.from("fi")));

           let foreignassets = [];
          //  let decAddr = algosdk.decodeAddress(addresses[0]);
          //  foreignassets.push(decAddr.publicKey);
           foreignassets.push(parseInt(Id1));
           foreignassets.push(parseInt(Id2));
           foreignassets.push(parseInt(Id3));
           const transaction2 = algosdk.makeApplicationNoOpTxnFromObject({
               from: recv_escrow, 
               appIndex: index,
               appArgs: appArg,
               appAccounts:sender,
               accounts: [sender],
               foreignAssets:foreignassets,
               suggestedParams: params
             });
    
           
            
            const transaction3 = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
              from:recv_escrow,
              to:  sender,
              assetIndex: parseInt(assetid),
              note: undefined,
              accounts:sender,
              amount: parseInt(amt), 
              suggestedParams: params
            });

          
    
        
          const groupID = algosdk.computeGroupID([ transaction1, transaction2, transaction3]);
          const txs = [ transaction1, transaction2, transaction3];
          txs[0].group = groupID;
          txs[1].group = groupID;
          txs[2].group = groupID;
         
          
          
          const signedTx1 = await myAlgoWallet.signTransaction(txs[0].toByte());
          const signedTx2 = algosdk.signLogicSigTransaction(txs[1], lsig);

          const signedTx3 = algosdk.signLogicSigTransaction(txs[2], lsig);
          toast.warn("Transaction in Progress");
          // const signedTx5 = await myAlgoWallet.signTransaction(txs[4].toByte());
          // const signedTxnarray = await myAlgoWallet.signTransaction([txs[0].toByte(),txs[2].toByte()])
    // console.log("signedtxn",signedTxnarray);
      const response = await algodClient.sendRawTransaction([signedTx1.blob, signedTx2.blob, signedTx3.blob]).do();
      console.log("TxID", JSON.stringify(response, null, 1));
      await waitForConfirmation(algodClient, response.txId);
      toast.success(`Transaction Success ${response.txId}`);
        } catch (err) {
          toast.error(`Transaction Failed due to ${err}`);
          console.error(err);
        }
    
    first()
      
            //  mapTotal();
            //  mapGoal();
            
              
              // Use the AlgoSigner encoding library to make the transactions base
              
      
        }

    return (
        <>
            <header className="header">
                <Navbar expand="xl" className='p-0'>
                    <Container fluid="lg">
                        <Navbar.Brand href="/"><img src={colorLogo} alt="logo" /></Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav">
                            <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16.9214 18.6127V20.6127H5.92139V18.6127H16.9214ZM21.9214 11.6127V13.6127H3.92139V11.6127H21.9214ZM19.9214 4.61267V6.61267H8.92139V4.61267H19.9214Z" fill="white"/>
                            </svg>
                        </Navbar.Toggle>
                        <Navbar.Collapse id="basic-navbar-nav">
                            <div className="d-flex mb-4 d-xl-none align-items-center justify-content-between">
                                <Navbar.Brand href="/"><img src={colorLogo} alt="logo" /></Navbar.Brand>

                                <Navbar.Toggle aria-controls="basic-navbar-nav">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#fff" class="bi bi-x-lg" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"/>
                                        <path fill-rule="evenodd" d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z"/>
                                    </svg>
                                </Navbar.Toggle>
                            </div>
                            <div className="navbar-controls order-xl-2 d-flex align-items-center">
                                <button className='btn me-2 btn-grad px-3'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" class="bi m-0 bi-plus-circle" viewBox="0 0 16 16">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                                    </svg>
                                </button>

                                { showButton ? 
                                <button className='btn me-0 btn-grad' onClick={()=>connectWallet()}>Connect Wallet</button>
                                : <>
                               
                                {/* <button className='btn me-3 btn-grad' onClick={()=>connectWallet()}>{(localStorage.getItem("walletAddress")).substring(0, 4)}...{(localStorage.getItem("walletAddress")).substring((localStorage.getItem("walletAddress")).length -4, (localStorage.getItem("walletAddress")).length)}</button><br /> */}
                                {/* <button className='btn me-3 btn-grad' onClick={() =>Disconnect()}>Disconnect</button> */}
                            
                                <Dropdown >
                                    <Dropdown.Toggle variant="grad" className='dropdown-noarrow' id="dropdown-basic">
                                    {(localStorage.getItem("walletAddress")).substring(0, 4)}...{(localStorage.getItem("walletAddress")).substring((localStorage.getItem("walletAddress")).length -4, (localStorage.getItem("walletAddress")).length)}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu className="dropdown-menu-end dropdown-menu-setting p-3">
                                        <div className="dropdown-menu-header mb-3">
                                            <h6 className='mb-0' >{(localStorage.getItem("walletAddress")).substring(0, 4)}...{(localStorage.getItem("walletAddress")).substring((localStorage.getItem("walletAddress")).length -4, (localStorage.getItem("walletAddress")).length)}</h6>
                                            <p className='text-gray'><small>{wb} Algo's</small></p>
                                        </div>

                                        <div className="card p-2 dropdown-menu-card mb-3">
                                            <Link to="/" className="d-flex align-items-center">
                                                <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="30.1212" height="30" rx="15" fill="#FA84B5"></rect><path d="M21.943 11.2538C21.4418 12.1245 20.965 12.8983 20.5494 13.6964C20.4394 13.914 20.3905 14.2284 20.4516 14.4582C21.1117 16.9612 21.7963 19.4642 22.4686 21.9671C22.5053 22.1122 22.542 22.2694 22.5909 22.4871C21.8452 22.4871 21.1728 22.5113 20.4883 22.4629C20.366 22.4508 20.1826 22.2211 20.146 22.0518C19.6937 20.4678 19.278 18.8837 18.8379 17.2997C18.8013 17.1788 18.7646 17.0579 18.7035 16.8644C18.5446 17.1304 18.4223 17.3239 18.3001 17.5295C17.4077 19.0651 16.5031 20.5887 15.6107 22.1364C15.464 22.3904 15.3051 22.4992 14.9994 22.4871C14.2904 22.4629 13.5814 22.475 12.7746 22.475C12.8968 22.2453 12.9824 22.076 13.0802 21.9067C14.596 19.307 16.0997 16.7193 17.6277 14.1317C17.7989 13.8415 17.8478 13.5997 17.75 13.2732C17.5055 12.463 17.2977 11.6287 17.0409 10.6976C16.9065 10.9274 16.8087 11.0725 16.7231 11.2176C14.6083 14.833 12.5056 18.4364 10.403 22.0639C10.2197 22.3904 10.0118 22.5113 9.63289 22.4992C8.96054 22.4629 8.27597 22.4871 7.53027 22.4871C7.64029 22.2694 7.72587 22.1122 7.81144 21.9671C10.5375 17.2997 13.2636 12.6444 15.9652 7.97698C16.173 7.61423 16.393 7.46913 16.8087 7.50541C17.2488 7.54168 17.6888 7.52959 18.1289 7.50541C18.4345 7.49331 18.5812 7.57796 18.6668 7.90443C18.9113 8.88387 19.2047 9.8633 19.4614 10.8427C19.5347 11.145 19.6692 11.2659 19.9871 11.2538C20.5983 11.2297 21.2217 11.2538 21.943 11.2538Z" fill="currentColor"></path></svg>
                                                <span className='ms-2'>
                                                    <h6 className='m-0'>ALGO</h6>
                                                    <p className='text-gray'><small>$12.89</small></p>
                                                </span>
                                            </Link>
                                            <Link to="/" className="d-flex align-items-center">
                                                <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="30.1212" height="30" rx="15" fill="#FA84B5"></rect><path d="M21.943 11.2538C21.4418 12.1245 20.965 12.8983 20.5494 13.6964C20.4394 13.914 20.3905 14.2284 20.4516 14.4582C21.1117 16.9612 21.7963 19.4642 22.4686 21.9671C22.5053 22.1122 22.542 22.2694 22.5909 22.4871C21.8452 22.4871 21.1728 22.5113 20.4883 22.4629C20.366 22.4508 20.1826 22.2211 20.146 22.0518C19.6937 20.4678 19.278 18.8837 18.8379 17.2997C18.8013 17.1788 18.7646 17.0579 18.7035 16.8644C18.5446 17.1304 18.4223 17.3239 18.3001 17.5295C17.4077 19.0651 16.5031 20.5887 15.6107 22.1364C15.464 22.3904 15.3051 22.4992 14.9994 22.4871C14.2904 22.4629 13.5814 22.475 12.7746 22.475C12.8968 22.2453 12.9824 22.076 13.0802 21.9067C14.596 19.307 16.0997 16.7193 17.6277 14.1317C17.7989 13.8415 17.8478 13.5997 17.75 13.2732C17.5055 12.463 17.2977 11.6287 17.0409 10.6976C16.9065 10.9274 16.8087 11.0725 16.7231 11.2176C14.6083 14.833 12.5056 18.4364 10.403 22.0639C10.2197 22.3904 10.0118 22.5113 9.63289 22.4992C8.96054 22.4629 8.27597 22.4871 7.53027 22.4871C7.64029 22.2694 7.72587 22.1122 7.81144 21.9671C10.5375 17.2997 13.2636 12.6444 15.9652 7.97698C16.173 7.61423 16.393 7.46913 16.8087 7.50541C17.2488 7.54168 17.6888 7.52959 18.1289 7.50541C18.4345 7.49331 18.5812 7.57796 18.6668 7.90443C18.9113 8.88387 19.2047 9.8633 19.4614 10.8427C19.5347 11.145 19.6692 11.2659 19.9871 11.2538C20.5983 11.2297 21.2217 11.2538 21.943 11.2538Z" fill="currentColor"></path></svg>
                                                <span className='ms-2'>
                                                    <h6 className='m-0'>USDC</h6>
                                                    <p className='text-gray'><small>$6</small></p>
                                                </span>
                                            </Link>
                                            {/* <Link to="/" className="d-flex align-items-center">
                                                <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="30.1212" height="30" rx="15" fill="#FA84B5"></rect><path d="M21.943 11.2538C21.4418 12.1245 20.965 12.8983 20.5494 13.6964C20.4394 13.914 20.3905 14.2284 20.4516 14.4582C21.1117 16.9612 21.7963 19.4642 22.4686 21.9671C22.5053 22.1122 22.542 22.2694 22.5909 22.4871C21.8452 22.4871 21.1728 22.5113 20.4883 22.4629C20.366 22.4508 20.1826 22.2211 20.146 22.0518C19.6937 20.4678 19.278 18.8837 18.8379 17.2997C18.8013 17.1788 18.7646 17.0579 18.7035 16.8644C18.5446 17.1304 18.4223 17.3239 18.3001 17.5295C17.4077 19.0651 16.5031 20.5887 15.6107 22.1364C15.464 22.3904 15.3051 22.4992 14.9994 22.4871C14.2904 22.4629 13.5814 22.475 12.7746 22.475C12.8968 22.2453 12.9824 22.076 13.0802 21.9067C14.596 19.307 16.0997 16.7193 17.6277 14.1317C17.7989 13.8415 17.8478 13.5997 17.75 13.2732C17.5055 12.463 17.2977 11.6287 17.0409 10.6976C16.9065 10.9274 16.8087 11.0725 16.7231 11.2176C14.6083 14.833 12.5056 18.4364 10.403 22.0639C10.2197 22.3904 10.0118 22.5113 9.63289 22.4992C8.96054 22.4629 8.27597 22.4871 7.53027 22.4871C7.64029 22.2694 7.72587 22.1122 7.81144 21.9671C10.5375 17.2997 13.2636 12.6444 15.9652 7.97698C16.173 7.61423 16.393 7.46913 16.8087 7.50541C17.2488 7.54168 17.6888 7.52959 18.1289 7.50541C18.4345 7.49331 18.5812 7.57796 18.6668 7.90443C18.9113 8.88387 19.2047 9.8633 19.4614 10.8427C19.5347 11.145 19.6692 11.2659 19.9871 11.2538C20.5983 11.2297 21.2217 11.2538 21.943 11.2538Z" fill="currentColor"></path></svg>
                                                <span className='ms-2'>
                                                    <h6 className='m-0'>ALGO</h6>
                                                    <p className='text-gray'><small>$ALGO</small></p>
                                                </span>
                                            </Link>
                                            <Link to="/" className="d-flex align-items-center">
                                                <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="30.1212" height="30" rx="15" fill="#FA84B5"></rect><path d="M21.943 11.2538C21.4418 12.1245 20.965 12.8983 20.5494 13.6964C20.4394 13.914 20.3905 14.2284 20.4516 14.4582C21.1117 16.9612 21.7963 19.4642 22.4686 21.9671C22.5053 22.1122 22.542 22.2694 22.5909 22.4871C21.8452 22.4871 21.1728 22.5113 20.4883 22.4629C20.366 22.4508 20.1826 22.2211 20.146 22.0518C19.6937 20.4678 19.278 18.8837 18.8379 17.2997C18.8013 17.1788 18.7646 17.0579 18.7035 16.8644C18.5446 17.1304 18.4223 17.3239 18.3001 17.5295C17.4077 19.0651 16.5031 20.5887 15.6107 22.1364C15.464 22.3904 15.3051 22.4992 14.9994 22.4871C14.2904 22.4629 13.5814 22.475 12.7746 22.475C12.8968 22.2453 12.9824 22.076 13.0802 21.9067C14.596 19.307 16.0997 16.7193 17.6277 14.1317C17.7989 13.8415 17.8478 13.5997 17.75 13.2732C17.5055 12.463 17.2977 11.6287 17.0409 10.6976C16.9065 10.9274 16.8087 11.0725 16.7231 11.2176C14.6083 14.833 12.5056 18.4364 10.403 22.0639C10.2197 22.3904 10.0118 22.5113 9.63289 22.4992C8.96054 22.4629 8.27597 22.4871 7.53027 22.4871C7.64029 22.2694 7.72587 22.1122 7.81144 21.9671C10.5375 17.2997 13.2636 12.6444 15.9652 7.97698C16.173 7.61423 16.393 7.46913 16.8087 7.50541C17.2488 7.54168 17.6888 7.52959 18.1289 7.50541C18.4345 7.49331 18.5812 7.57796 18.6668 7.90443C18.9113 8.88387 19.2047 9.8633 19.4614 10.8427C19.5347 11.145 19.6692 11.2659 19.9871 11.2538C20.5983 11.2297 21.2217 11.2538 21.943 11.2538Z" fill="currentColor"></path></svg>
                                                <span className='ms-2'>
                                                    <h6 className='m-0'>ALGO</h6>
                                                    <p className='text-gray'><small>$ALGO</small></p>
                                                </span>
                                            </Link> */}
                                        </div>
                                        <Dropdown.Item className='d-flex align-items-center p-2 rounded' onClick={()=>redeem()} href="javascript:void(0)"> 
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi me-2 bi-download" viewBox="0 0 16 16">
                                                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                                                <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                                            </svg>
                                            Redeem excess amounts</Dropdown.Item>
                                        <Dropdown.Item className='d-flex align-items-center p-2 rounded' href="#/action-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi me-2 bi-person" viewBox="0 0 16 16">
                                                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                                            </svg>
                                            Account</Dropdown.Item>
                                        <Dropdown.Item className='d-flex align-items-center p-2 rounded' href="#/action-3" onClick={() =>Disconnect()}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi me-2 bi-box-arrow-right" viewBox="0 0 16 16">
                                                <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                                                <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                                            </svg>
                                            Disconnect
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                                </>
                                }
                            </div>

                            <Nav className="mx-auto navbar-nav-inner">
                                <Link className='nav-link' to="/swap" activeClassName="active">Swap</Link>
                                <Link className='nav-link' to="/pool" activeClassName="active">Pool</Link>
                                <Link className='nav-link' to="/farm" activeClassName="active">Farm</Link>
                                <Link className='nav-link' to="/vaults" activeClassName="active">Vaults</Link>
                                <Link className='nav-link' to="/stake" activeClassName="active">Stake <Badge>New</Badge></Link>
                                <Link className='nav-link' to="/bridge" activeClassName="active">Bridge</Link>
                                <Link className='nav-link' to="/launchpad" activeClassName="active">Launchpad</Link>
                                <Link className='nav-link' to="/analytics" activeClassName="active">Analytics</Link>
                                <Link className='nav-link' to="/analytics" activeClassName="active">TAU Currency</Link>
                                <Link className='nav-link' to="/analytics" activeClassName="active">Credit <Badge>Upcoming</Badge></Link>
                                <Link className='nav-link' to="/analytics" activeClassName="active">Money Market <Badge>Upcoming</Badge></Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                    </Navbar>
            </header>
            
            <Modal show={show} centered={true} size="lg" onHide={handleClose}>
            <ToastContainer position='top-center' draggable = {false} transition={Zoom} autoClose={8000} closeOnClick = {false}/>

                <Modal.Body className='modal-liquidity-body'>
                    <Button className='modal-close' onClick={handleClose} variant='reset'>
                        <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g opacity="0.3">
                            <path d="M17.5004 32.0832C9.44597 32.0832 2.91699 25.5542 2.91699 17.4998C2.91699 9.44546 9.44597 2.9165 17.5004 2.9165C25.5548 2.9165 32.0837 9.44546 32.0837 17.4998C32.0837 25.5542 25.5548 32.0832 17.5004 32.0832ZM17.5004 29.1665C20.5946 29.1665 23.562 27.9373 25.75 25.7494C27.9379 23.5615 29.1671 20.594 29.1671 17.4998C29.1671 14.4056 27.9379 11.4382 25.75 9.25026C23.562 7.06233 20.5946 5.83317 17.5004 5.83317C14.4062 5.83317 11.4387 7.06233 9.25076 9.25026C7.06283 11.4382 5.83367 14.4056 5.83367 17.4998C5.83367 20.594 7.06283 23.5615 9.25076 25.7494C11.4387 27.9373 14.4062 29.1665 17.5004 29.1665ZM17.5004 15.4378L21.6245 11.3121L23.6881 13.3757L19.5625 17.4998L23.6881 21.624L21.6245 23.6875L17.5004 19.5619L13.3762 23.6875L11.3126 21.624L15.4383 17.4998L11.3126 13.3757L13.3762 11.3121L17.5004 15.4378Z" fill="white"/>
                            </g>
                        </svg>
                    </Button>

                    <Row className='text-center justify-content-center mb-60'>
                        <Col md={9}>
                            <h3>Redeemable Amounts</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsa, obcaecati nisi adipisci possimus maiores qui non! Architecto dolor sunt ut. Assumenda neque id magnam eaque odio facilis sed voluptates tempora!</p>

                            {/* <Link to="/" className='btn btn-grad'>Redeem All</Link> */}
                        </Col>
                    </Row>
                    <Row className='justify-content-center align-items-center mb-100'>
                        <Col md={3}>
                            <h2 className='mb-0'>{dbdata.length} </h2>
                            <h6>Excess Tokens</h6>
                        </Col>
                        <Col md={9}>
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsa, obcaecati nisi adipisci possimus maiores qui non! Architecto dolor sunt ut. Assumenda neque id magnam eaque odio facilis sed voluptates tempora!</p>

                            <Link to="/" className='btn-link-purple text-underline'>Learn more about excess and redeeming</Link>
                        </Col>
                    </Row><div>
                     
                    <div className="table-group-outer table-group-redeem" >
                        <div className="table-group-head">
                            <div className="table-group-tr justify-content-between">
                                <div className="table-group-td">Token</div>
                                <div className="table-group-td">Stored In</div>
                                <div className="table-group-td">Amount</div>
                                
                            </div>
                        </div>
                        
                        {dbdata.map((r,i)=>{
                             
                            //  if(){
 if(r){
                               console.log("rvalue",r)
                               return (<div>
                        <div className="table-group-body">
                            <div className="table-group-tr">
                                <div className="table-group-td">
                                    <div className="dropdown-menu-card">
                                        <h6 className='m-0' >{r.assetname}</h6>
                                        <p className='text-gray text-uppercase'><small>{r.assetid}</small></p>
                                    </div>
                                </div>
                                <div className="table-group-td">{r.thirdasset}</div>
                                <div className="table-group-td">{parseFloat(r.asbalance/1000000).toFixed(6)} 
                                    <Button variant='grad' className='btn-auto px-2 ms-3' onClick={()=>RedeemAmount(appID_global,r.escrowAddress,r.assetid,r.asbalance)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi me-2 bi-download" viewBox="0 0 16 16">
                                            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                                            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                                        </svg>
                                    </Button>
                                </div>
                              
                               
                            </div>
                            
                        </div>
                        </div>
                    )}
                    else{
                        <h5>Loading</h5>
                    }})}
                    </div>
                    </div>
                    
                </Modal.Body>
            </Modal>
        </>
    );
}

export default Header;