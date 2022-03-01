import React from 'react';
import { Button, Col, Container, Modal, Row, Breadcrumb } from 'react-bootstrap';
import { ToastContainer, Toast, Zoom, Bounce, toast} from 'react-toastify';
import Layout from './Layouts/LayoutInner';
import {
    Link
  } from "react-router-dom";
// import Select from 'react-select';
// import makeAnimated from 'react-select/animated';
import FilterDropdown from './Snippets/FilterDropdown';
import FilterDropdown2 from './Snippets/FilterDropdown2';
// const animatedComponents = makeAnimated();
import MyAlgoConnect from "@randlabs/myalgo-connect";
import algosdk, { Algod,base64 } from "algosdk";





import { useEffect,useState } from "react";
import config from "../configurl";

import axios from 'axios';
import { priceOfCoin1,priceOfCoin2,find_balance,find_balance_escrow,convert1,convert2,readingLocalstate,assetName,decodLocalState } from './formula';
import { assert1Reserve,assert2Reserve,assert3Reserve,asset1_price,rewardasset3,rewardasset1,rewardasset2 } from './formula';
const myAlgoWallet = new MyAlgoConnect();
const algodClient = new algosdk.Algodv2('', 'https://api.testnet.algoexplorer.io', '');
let appID_global = 57691024;
let data = `#pragma version 4
    
// Element Pool LogicSig


// This code should be read in conjunction with validator_approval.teal.
// The validation logic is split between these two programs.

// ensure ASSET_ID_1 > ASSET_ID_2
int Token1   
int Token2   
>
assert

txn CloseRemainderTo
global ZeroAddress
==
assert

txn AssetCloseTo
global ZeroAddress
==
assert

txn RekeyTo
global ZeroAddress
==
assert

global GroupSize
int 1
>
assert

// ensure gtxn 1 is ApplicationCall to Validator App
gtxn 1 Sender
txn Sender
==
assert

gtxn 1 TypeEnum
int appl // ApplicationCall
==
assert

gtxn 1 ApplicationID
int appId
==
assert

// Bootstrap?
gtxn 1 OnCompletion
int OptIn
==
gtxn 1 NumAppArgs
int 3
==
&&
gtxna 1 ApplicationArgs 0
byte "bootstrap"
==
&&
bnz bootstrap


// The remaining operations (Mint/Burn/Swap/Redeem/Fees) must all have OnCompletion=NoOp
gtxn 1 OnCompletion
int NoOp
==
assert

// Swap?
gtxn 1 NumAppArgs
int 2
==
gtxna 1 ApplicationArgs 0
byte "swap"
==
&&
bnz swap


// The remaining operations (Mint/Burn/Redeem/Fees) must all have NumAppArgs=1
gtxn 1 NumAppArgs
int 1
==
assert

// Mint?
gtxna 1 ApplicationArgs 0
byte "mint"
==
bnz mint


// Burn?
gtxna 1 ApplicationArgs 0
byte "burn"
==
bnz burn

// Redeem?
gtxna 1 ApplicationArgs 0
byte "redeem"
==
bnz redeem

// Fees?
gtxna 1 ApplicationArgs 0
byte "fees"
==
bnz redeem_fees

err


bootstrap:
    // Ensure group size is correct 4 or 5:
    // 0: Pay Fees (signed by Pooler)
    // 1: Call App (signed by Pool LogicSig)
    // 2: Asset Creation (signed by Pool LogicSig)
    // 3: Asset Optin (signed by Pool LogicSig)
    // If asset 2 is an ASA:
    // (4): Asset Optin (signed by Pool LogicSig)
    int 5 // 5 if asset 2 is an ASA
    int 4 // 4 if asset 2 is Algo
    int Token2
    int 0 // Algo
    ==
    select
    global GroupSize
    ==
    assert

    gtxna 1 ApplicationArgs 1
    btoi
    int Token1
    ==
    gtxna 1 ApplicationArgs 2
    btoi
    int Token2
    ==
    &&
    assert

    // ensure sender (signer) of AssetConfig tx is same as sender of app call
    gtxn 2 Sender
    txn Sender
    ==
    assert

    // ensure gtxn 2 is type AssetConfig
    gtxn 2 TypeEnum
    int acfg
    ==
    assert

    // ensure a new asset is being created
    gtxn 2 ConfigAsset
    int 0
    ==
    assert

       // ensure asset total amount is max int
          gtxn 2 ConfigAssetTotal
          int 0
          > // inverse of 0 is max int
          assert


    // ensure decimals is 6
    gtxn 2 ConfigAssetDecimals
    int 6
    ==
    assert

    // ensure default frozen is false
    gtxn 2 ConfigAssetDefaultFrozen
    int 0
    ==
    assert

    // ensure unit name is 'TM1POOL'
    gtxn 2 ConfigAssetUnitName
    byte "ELEMPOOL"
    ==
    assert

    // ensure asset name begins with 'Element Pool '
    // the Validator app ensures the name ends with "{asset1_unit_name}-{asset2_unit_name}"
    gtxn 2 ConfigAssetName
    substring 0 13
    byte "Element Pool "
    ==
    assert

    // ensure asset url is 'https://Element.org'
    gtxn 2 ConfigAssetURL
    byte "https://Element.org"
    ==
    assert

    // ensure no asset manager address is set
    gtxn 2 ConfigAssetManager
    global ZeroAddress
    ==
    assert

    // ensure no asset reserve address is set
    gtxn 2 ConfigAssetReserve
    global ZeroAddress
    ==
    assert

    // ensure no asset freeze address is set
    gtxn 2 ConfigAssetFreeze
    global ZeroAddress
    ==
    assert

    // ensure no asset clawback address is set
    gtxn 2 ConfigAssetClawback
    global ZeroAddress
    ==
    assert

    // Asset 1 optin
    // Ensure optin txn is signed by the same sig as this txn
    gtxn 3 Sender
    txn Sender
    ==
    assert

    // ensure txn type is AssetTransfer
    gtxn 3 TypeEnum
    int axfer
    ==
    assert

    // ensure the asset id is the same as asset 1
    gtxn 3 XferAsset
    int Token1
    ==
    assert

    // ensure the receiver is the sender
    gtxn 3 AssetReceiver
    txn Sender
    ==
    assert

    // ensure the amount is 0 for Optin
    gtxn 3 AssetAmount
    int 0
    ==
    assert

    // if asset 2 is not 0 (Algo), it needs an optin
    int Token2
    int 0
    !=
    bnz bootstrap__non_algo

    gtxn 1 Fee
    gtxn 2 Fee
    +
    gtxn 3 Fee
    +
    store 1 // fee_total
    b check_fees


    bootstrap__non_algo:
    // verify 5th txn is asset 2 optin txn
    gtxn 4 Sender
    txn Sender
    ==
    assert
    gtxn 4 TypeEnum
    int axfer
    ==
    assert

    // ensure the asset id is the same as asset 2
    gtxn 4 XferAsset
    int Token2   
    ==
    assert

    // ensure the receiver is the sender
    gtxn 4 AssetReceiver
    txn Sender
    ==
    assert

    // ensure the amount is 0 for Optin
    gtxn 4 AssetAmount
    int 0
    ==
    assert

    gtxn 1 Fee
    gtxn 2 Fee
    +
    gtxn 3 Fee
    +
    gtxn 4 Fee
    +
    store 1 // fee_total
    b check_fees

mint:
    // Mint Checks:
    //
    // # ensure group size is 5
    // global GroupSize == 5

    // 	# ensure transaction fees are covered by txn 0
    // 	# ensure Pool is not paying the fee
    // 	gtxn 0 Sender != txn Sender
    // 	gtxn 0 Receiver == txn Sender
    // 	gtxn 0 Amount >= (gtxn 1 Fee + gtxn 4 Fee)

    // 	# verify the receiver of the liquidity token asset is the one whose local state is updated
    // 	gtxna 1 Accounts 1 != txn Sender
    // 	gtxna 1 Accounts 1 == gtxn 4 AssetReceiver

    // 	# from Pooler to Pool asset 1
    // 	gtxn 2 Sender (Pooler) != txn Sender (Pool)
    // 	gtxn 2 AssetReceiver (Pool) == txn Sender (Pool)
    // 	gtxn 2 Sender (Pooler) == gtxn 3 Sender (Pooler)

    // 	# from Pooler to Pool asset 2
    // 	txn Sender (Pool) == (gtxn 3 AssetReceiver or gtxn 3 Receiver) (Pool)


    // 	# from Pool to Pooler liquidity token
    // 	gtxn 4 AssetReceiver (Pooler) == gtxn 2 Sender (Poooler)
    // 	gtxn 4 Sender (Pool) == txn Sender (Pool)


    // ensure group size is 5:
    // 0: Pay Fees (signed by Pooler)
    // 1: Call App (signed by Pool LogicSig)
    // 2: Asset Transfer/Pay (signed by Pooler)
    // 3: Asset Transfer/Pay (signed by Pooler)
    // 4: Asset Transfer/Pay (signed by Pool LogicSig)
    global GroupSize
    int 5
    ==
    assert

    // verify the receiver of the asset is the one whose local state is updated
    gtxna 1 Accounts 1
    txn Sender
    !=
    assert

    gtxna 1 Accounts 1
    gtxn 4 AssetReceiver
    ==
    assert

    // verify txn 2 is AssetTransfer from Pooler to Pool
    gtxn 2 Sender
    txn Sender
    !=
    assert

    gtxn 2 AssetReceiver
    txn Sender
    ==
    assert

    gtxn 3 Sender
    gtxn 2 Sender
    ==
    assert

    // verify txn 3 is AssetTransfer from Pooler to Pool
    gtxn 3 AssetReceiver
    gtxn 3 Receiver
    gtxn 3 TypeEnum
    int pay
    == // check if Algo
    select
    txn Sender
    ==
    assert

    // verify txn 4 is AssetTransfer from Pool to Pooler
    gtxn 4 Sender
    txn Sender
    ==
    assert

    gtxn 4 AssetReceiver
    gtxn 2 Sender
    ==
    assert

    gtxn 1 Fee
    gtxn 4 Fee
    +
    store 1 // fee_total
    b check_fees


burn:
    // Burn Checks:
    //
    // # ensure group size is 5
    // global GroupSize == 5

    // # ensure transaction fees are covered by txn 0
    // # ensure Pool is not paying the fee
    // gtxn 0 Sender != txn Sender
    // gtxn 0 Receiver == txn Sender
    // gtxn 0 Amount >= (gtxn 1 Fee + gtxn 2 Fee gtxn 3 Fee)

    // # ensure the calculated amounts are not 0
    // calculated_asset1_out != 0
    // calculated_asset2_out != 0

    // # verify the receiver of the assets is the one whose local state is updated
    // gtxna 1 Accounts 1 != txn Sender
    // gtxna 1 Accounts 1 == gtxn 2 AssetReceiver
    // gtxna 1 Accounts 1 == (gtxn 3 AssetReceiver or gtxn 3 Receiver)

    // # from Pool to Pooler asset 1
    // gtxn 2 Sender (Pooler) == txn Sender (Pool)
    // gtxn 2 AssetReceiver (Pool) == gtxn 4 Sender (Pool)
    // gtxn 3 Sender (Pool) == txn Sender (Pool)

    // # from Pool to Pooler asset 2
    // gtxn 4 Sender (Pooler) == (gtxn 3 AssetReceiver or gtxn 3 Receiver) (Pool)


    // # from Pooler to Pool liquidity token
    // gtxn 4 Sender (Pooler) != txn Sender (Pool)
    // gtxn 4 AssetReceiver == txn Sender (Pool)

    // ensure group size is 5:
    // 0: Pay Fees (signed by Pooler)
    // 1: Call App (signed by Pool LogicSig)
    // 2: Asset Transfer/Pay (signed by Pool LogicSig)
    // 3: Asset Transfer/Pay (signed by Pool LogicSig)
    // 4: Asset Transfer/Pay (signed by Pooler)
    global GroupSize
    int 5
    ==
    assert

    // verify the receiver of the assets is the one whose local state is updated
    gtxna 1 Accounts 1
    txn Sender
    !=
    assert

    gtxna 1 Accounts 1
    gtxn 2 AssetReceiver
    ==
    assert

    gtxn 3 AssetReceiver
    gtxn 3 Receiver
    gtxn 3 TypeEnum
    int pay
    ==
    select
    gtxna 1 Accounts 1
    ==
    assert

    // 2: AssetTransfer - from Pool to Pooler asset 1
    gtxn 2 Sender
    txn Sender
    ==
    assert

    gtxn 2 AssetReceiver
    gtxn 4 Sender
    ==
    assert

    gtxn 3 Sender
    txn Sender
    ==
    assert

    // 3: AssetTransfer - from Pool to Pooler asset 2
    gtxn 3 AssetReceiver
    gtxn 3 Receiver
    gtxn 3 TypeEnum
    int pay
    == // if algo
    select
    gtxn 4 Sender
    ==
    assert

    // 4: AssetTransfer - from Pooler to Pool liquidity token
    gtxn 4 Sender
    txn Sender
    !=
    assert

    gtxn 4 AssetReceiver
    txn Sender
    ==
    assert

    gtxn 1 Fee
    gtxn 2 Fee
    +
    gtxn 3 Fee
    +
    store 1 // fee_total
    b check_fees


swap:
    // ensure group size is 4:
    // 0: Pay Fees (signed by Swapper)
    // 1: Call App (signed by Pool LogicSig)
    // 2: Asset Transfer/Pay (signed by Swapper)
    // 3: Asset Transfer/Pay (signed by Pool LogicSig)
    global GroupSize
    int 5
    ==
    assert

    //  ensure accounts[1] is not Pool
    gtxna 1 Accounts 1
    txn Sender
    !=
    assert

    // ensure the sender of asset in is the one whose local state is updated
    gtxn 2 Sender
    gtxna 1 Accounts 1
    ==
    assert

    // ensure txn 2 sender is not the Pool
    gtxn 2 Sender
    txn Sender
    !=
    assert

    // ensure txn 3 sender is the Pool
    gtxn 3 Sender
    txn Sender
    ==
    assert

    // ensure txn 2 receiver is Pool
    gtxn 2 AssetReceiver
    gtxn 2 Receiver
    gtxn 2 TypeEnum
    int pay
    == // if Algo
    select
    txn Sender
    ==
    assert

    // ensure txn 3 receiver is Swapper (sender of txn 2)
    gtxn 3 AssetReceiver
    gtxn 3 Receiver
    gtxn 3 TypeEnum
    int pay
    == // if Algo
    select
    gtxn 2 Sender
    ==
    assert

    gtxn 1 Fee
    gtxn 3 Fee
    +
    store 1 // fee_total
    b check_fees


redeem:
    // ensure group size is 3:
    // 0: Pay Fees (signed by Swapper)
    // 1: Call App (signed by Pool LogicSig)
    // 2: Asset Transfer/Pay (signed by Pool LogicSig)
    global GroupSize
    int 3
    ==
    assert

    //  ensure accounts[1] is not Pool
    gtxna 1 Accounts 1
    txn Sender
    !=
    assert

    // ensure the receiver of the asset is the one whose local state is updated
    gtxn 2 AssetReceiver
    gtxn 2 Receiver
    gtxn 2 TypeEnum
    int pay
    == // if algo
    select
    gtxna 1 Accounts 1
    ==
    assert

    gtxn 1 Fee
    gtxn 2 Fee
    +
    store 1 // fee_total
    b check_fees


redeem_fees:
    // ensure group size is 3:
    // 0: Pay Fees (signed by User)
    // 1: Call App (signed by Pool LogicSig)
    // 2: Asset Transfer/Pay (signed by Pool LogicSig)
    global GroupSize
    int 3
    ==
    assert

    gtxn 1 Fee
    gtxn 2 Fee
    +
    store 1 // fee_total
    b check_fees



check_fees:
    // ensure gtxn 0 amount covers all fees
     // ensure Pool is not paying the fee
    gtxn 0 Sender
    txn Sender
    !=
    assert

     // ensure Pool is receiving the fee
    gtxn 0 Receiver
    txn Sender
    ==
    assert

    gtxn 0 Amount
    load 1 // fee_total
    >=
    return`;
const baseServer = "https://testnet-algorand.api.purestake.io/idx2";
const port = "";

const token = {
    'X-API-key': '9oXsQDRlZ97z9mTNNd7JFaVMwhCaBlID2SXUOJWl',
}
// const express = require('express');
// const app = express();
// const cors = require('cors');
// app.use(express.json());
// app.use(cors());
let indexerClient = new algosdk.Indexer(token, baseServer, port);
function PoolPage() {
    const [show, setShow] = React.useState(false);
    const [liquidity, setLiquidity] = React.useState(false);
    const [pair, setPair] = React.useState(false);
    const [remove, setRemove] = React.useState(false);
    const [manage, setManage] = React.useState(false);
    const [dbcheck, setdbcheck] = React.useState(false);
    const [input1, setValue] = React.useState('0.0');
    const [input2, setValue1] = React.useState('0.0');
    const[pc1 ,setpc1]= useState("");
    const[pc2 ,setpc2]= useState("");
    const [appId,setAppId] = useState("");
    const[as1,setas1] = useState([]);
    const[as2,setas2] = useState([]);
    const[as3,setas3] = useState([]);
    const[rstate,setrstate]= useState([]);
    const[aprice,setaprice]= useState([]);
    const[pooledValue,setpooladdedValue] = useState("");
    const[esdata,setesdata]=useState("");
    const[amount1Out,setamount1Out]= useState([]);
    const[amount2Out,setamount2Out]= useState([]);
    const[gvprice,setgivenprice]=useState("");
    const[amount2Value,setamount2] = useState("");
    const[amount1Value,setamount1] = useState("");
    const[samount1,setsAmount1] = useState("");
    const[samount2,setsAmount2] = useState("");
    const[liquidityamount,setliquidityamount]=useState("");
    const[a1balance,setas1balance]=useState("");
    const[a2balance,setas2balance]=useState("");
    const[excessb,setexcessb] = useState("");
    const [algoPrice, setAlgoPrice] = useState("");
    const [usdcPrice, setUsdcPrice] = useState("");
    const[pr1,setpr1]= useState("");
    const[pr2,setpr2]= useState("");

    const[tk1,sett1] = useState("");
    const[tk2,sett2] = useState("");
    const[swapopt,setoswapopt]= useState(false);
    const[esc,setesc]= useState("");

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleLiquidiy = () => {setLiquidity(!liquidity); setPair(false)};
    const handlePair = () => {setLiquidity(!liquidity); setPair(!pair)};
    const handleManage = () => {setManage(!manage); setShow(!show)};
    const handleRemove = () => setRemove(!remove);
    
    const [showOptInButton, setShowOptInButton] = React.useState(false);
    const [showMintButton, setShowMintButton] = React.useState(false);
    const [s1, sets1] = useState("");
    const [s2, sets2] = useState("");
    const [ilt, setilt] = useState("");
    const[dbdata,setdbdata] = useState([]);
    const[asPrice,setasprice] = useState([]);
    const[unclaimed_protocol_fees,setunclaimed_protocol_fees]= useState("");
    const[outstanding_asset1_amount,setoutstanding_asset1_amount]= useState("")
    const[outstanding_asset2_amount,setoutstanding_asset2_amount]= useState("")
    const[outstanding_liquidity_amount,setoutstanding_liquidity_amount]= useState("")
    console.log("dbdata",dbdata)
    useEffect(() =>{ufirst()},[])

    // useEffect(() =>{callp()},[])

    const callapi=  async()=>{      
      // let userjsonkey ={
      //   "client_id":"cEZoGE19mLmQdIPPjXtj2osurm8NRLHK",
      //   "client_secret":"VNe8u0lpgcCvE9NsE7Khcft7gA22RMvW",
      //   "grant_type":"client_credentials",
      //   "scope":"email"	
      // }  
      
     
    //   axios
    //   .post(`${config}/create`)
    //   .then((res) =>
    //    {
    //      axios.get(`${config}/news`,{
    //       params: {
    //         foo: res.data.access_token,
    //       }
    //     })
    //      .then((res)=>console.log("response",res.data))  
    //   },
    //   // l = res.data.access_token,

    //   console.log('Book Created')
    //   )
    //   .catch(err => {
    //     console.error(err);
    //   });
    // console.log("created")
       let access_token = "h0U4jYb17czsY5cum8iLrPN6OU3krT3u";
        //  await axios.get('https://api.elementpad.io/elementsapi/v1/users/', {
        //     //  headers: {'Authorization' : `Bearer ${access_token}`} 
        //     headers:{
        //       'Authorization':access_token
        //   }

        //   })
        //   .then((res) => {
        //     console.log("result",res.data)
        //   })
        //   .catch((error) => {
        //     console.error("error result",error)
        //   })


      // const options = {
      //     method: 'GET',
      //     url: 'https://api.elementpad.io/elementsapi/v1/users',
      //     headers:{
      //         'Authorization':`Bearer ${access_token}`
      //     }
      // }
  
      //     axios.request(options).then((response)=>{
      //         console.log("resultdata",response.data);
      //         // console.log("result")
      //     })
//       let params={
            
//         client_id:process.env.REACT_CLIENT_ID,
//         client_secret:process.env.REACT_CLIENT_SECRET,
//         grant_type:"client_credentials",
//         scope:"email"	
      
// }
//     axios.post("https://api.elementpad.io/elementsapi/oauth2/token",params).then((response)=>{
//                 console.log(response.data)
//                 //    console.log("result",response.data.access_token)
//                    token=(response.data.access_token);
//                    console.log("token",token)
//                 })


                const requestOptions = {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ 
                    client_id:process.env.REACT_CLIENT_ID,
                    client_secret:process.env.REACT_CLIENT_SECRET,
                    grant_type:"client_credentials",
                    scope:"email"	 
                  })
              };
              const response = await fetch('https://api.elementpad.io/elementsapi/oauth2/token', requestOptions);
              const data = await response.json();     
  
        }

    const ufirst =() =>{
      if(dbdata.length <= 0){
        first();
       
     }
     console.log("tk1")
     
    }
    const callp1 =() =>{
      if(tk1){
        console.log("tk1")
         call_price1();
      }
    }
    const callp2 =() =>{
      if(tk2){
         call_price2();
      }
    }
    
    const call_price1 =async()=>{
      let p1;
      console.log("k1",tk1)
      if(tk1 === "Algo"){
        p1 =  algoPrice;
        console.log("first",p1);
      }
      else if(tk1 === "USDC"){
        console.log("firstvalue",p1);
        p1 = usdcPrice;
        console.log("first",p1);
      }
      console.log("p1",p1)
      setpr1(p1);
    }
    const call_price2 =async()=>{
      let p2;
      if(tk2 === "Algo"){
       p2 = algoPrice;
      }
      else if(tk2 === "USDC"){
        p2 = usdcPrice;
      }
      console.log("p2",p2)
      setpr2(p2);
    }
    
    const first = async() =>{
      
      axios.get(`${config}`).then(async(e)=>{
        // setdbdata(e.data);
       
        let arrayvalue =[];
        let arrayvalue1 =[];
        let arrayvalue2 =[];
        let assetprice =[];
        let edata=[];
        for(let i=0;i<e.data.length ; i++){
          console.log("data1",e.data);
          let a1,a2;
          if(e.data[i].profileURL === localStorage.getItem("walletAddress")){
          // if(e.data[i].profileURL){
            edata.push(e.data[i])
            console.log("equal");
            // const assets = await indexerClient.lookupAssetByID(e.data[i].accountType).do();
            // const assets2 = await indexerClient.lookupAssetByID(e.data[i].profileName).do();
            // setas1(assets.asset.params.name);
            // arrayvalue.push(assets.asset.params.name)
            // arrayvalue1.push(assets2.asset.params.name)
            a1 = await readingLocalstate(algodClient,e.data[i].algoAddress);
            console.log("name",assert1Reserve(await readingLocalstate(algodClient,e.data[i].algoAddress)))
            arrayvalue.push(assert1Reserve(a1))
            console.log("as1",as1)
            a2 = await readingLocalstate(algodClient,e.data[i].algoAddress);
            arrayvalue1.push(assert2Reserve(a2))
            arrayvalue2.push(assert3Reserve(await readingLocalstate(algodClient,e.data[i].algoAddress)))
            assetprice.push(asset1_price(assert1Reserve(a1),assert2Reserve(a2)))
          }
          else{
            console.log("notequal")
          }
          
        }
        console.log("arrayvalue",assetprice)
       setas1(arrayvalue);
       setas2(arrayvalue1);
       setas3(arrayvalue2);
       setasprice(assetprice);
       setdbdata(edata)
       
      });
      let pk1 = await priceOfCoin1();
      setAlgoPrice(pk1);
      
    console.log("pk1",pk1);
    let pk2 = await priceOfCoin2();

    setUsdcPrice(pk2);
    console.log("pk2",pk2);
    }
    console.log("as1",as1)
    console.log("as2",dbdata)

    
    async function readLocalState(client, account, index1,asset1,asset2,asset3){
        let accountInfoResponse = await readingLocalstate(client,account);
        console.log("accinfo",accountInfoResponse);
        for(let i=0;i<15;i++){
          let keys = accountInfoResponse['apps-local-state'][0]['key-value'][i]['key'];
          // console.log("keys",keys)
          if(keys === "czE="){
           sets1(accountInfoResponse['apps-local-state'][0]['key-value'][i]['value']['uint'])
            console.log("s1",s1)
          }
          if(keys === "czI="){
              sets2(accountInfoResponse['apps-local-state'][0]['key-value'][i]['value']['uint'])
              console.log("s2",s2)
          }
          if(keys === "aWx0"){
              setilt(accountInfoResponse['apps-local-state'][0]['key-value'][i]['value']['uint'])
              console.log("ilt",ilt)
            } 
          if(keys === "cA=="){
            setunclaimed_protocol_fees(accountInfoResponse['apps-local-state'][0]['key-value'][i]['value']['uint'])
            console.log("ilt", unclaimed_protocol_fees )
          } 
          if(keys.slice(0,2) === "bw"){
            let a1 = decodLocalState(String(keys));
            console.log("a1",a1)
            if(decodLocalState(keys) === asset1){
              setoutstanding_asset1_amount(accountInfoResponse['apps-local-state'][0]['key-value'][i]['value']['uint'])
              console.log("outstanding",  outstanding_asset1_amount  )
            } 
            if(decodLocalState(keys) === asset2){
              setoutstanding_asset2_amount(accountInfoResponse['apps-local-state'][0]['key-value'][i]['value']['uint'])
              console.log("ilt", outstanding_asset2_amount )
            } 
            if(decodLocalState(keys) === asset3){
              setoutstanding_liquidity_amount(accountInfoResponse['apps-local-state'][0]['key-value'][i]['value']['uint'])
              console.log("ilt",outstanding_liquidity_amount )
            }
          }          
         
          // let a2 = decodLocalState(asset2);
          // let a3 = decodLocalState(asset3);
          // if(decodLocalState(keys) === asset1){
          //   setoutstanding_asset1_amount(accountInfoResponse['apps-local-state'][0]['key-value'][i]['value']['uint'])
          //   console.log("outstanding",  outstanding_asset1_amount  )
          // } 
          // if(keys === a2){
          //   setoutstanding_asset2_amount(accountInfoResponse['apps-local-state'][0]['key-value'][i]['value']['uint'])
          //   console.log("ilt", outstanding_asset2_amount )
          // } 
          // if(keys === a3){
          //   setoutstanding_liquidity_amount(accountInfoResponse['apps-local-state'][0]['key-value'][i]['value']['uint'])
          //   console.log("ilt",outstanding_liquidity_amount )
          // } 
        }
      //   for (let i = 0; i < accountInfoResponse['apps-local-state'].length; i++) { 
      //     if (accountInfoResponse['apps-local-state'][i].id == index1) {
      //         console.log("Application's global state:");
      //         for (let n = 0; n < accountInfoResponse['apps-local-state'][i]['key-value'].length; n++) {
      //            // console.log(accountInfoResponse['apps-local-state'][i]['key-value']);
      //             let enc = accountInfoResponse['apps-local-state'][i]['key-value'][n];
      //             if(enc['key'] === "czE="){
      //               sets1(enc.value.uint)
      //               console.log("s1",s1)
      //             }
      //             if(enc['key'] === "czI="){
      //               sets2(enc.value.uint)
      //               console.log("s2",s2)
      //             }
      //             if(enc['key'] === "aWx0"){
      //               setilt(enc.value.uint)
      //             }                  
      //         }
              
      //     }
      // }
    }
    // useEffect(() =>{},[s1,s2])
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
    const bootstrap = async (appid) => {
        const algodClient = new algosdk.Algodv2(
          "",
          "https://api.testnet.algoexplorer.io",
          ""
        );
        let t1;
        let t2;

       

        let tokenid1 = localStorage.getItem("tokenid1");
        let tokenid2 = localStorage.getItem("tokenid2");
    if(parseInt(tokenid1) > parseInt(tokenid2) ){
      localStorage.setItem("tokenid1",tokenid1);
      localStorage.setItem("tokenid2",tokenid2);
      t1 = tokenid1;
      t2 = tokenid2;
      console.log(t1)
      console.log(t2)
    }
    else{
      localStorage.setItem("tokenid1",tokenid2);
      localStorage.setItem("tokenid2",tokenid1);
       t1 = tokenid2;
       t2 = tokenid1;
      console.log(t1)
      console.log(t2)
    }
    
        let index = parseInt(appID_global);
        console.log("appId inside donate", index);
        let replacedData = data.replaceAll("Token1",t1)
        let replacedData2 = replacedData.replaceAll("Token2",t2)
        let replacedData3 = replacedData2.replaceAll("appId",appID_global);
        let results = await algodClient.compile(replacedData3).do();
        console.log("Hash = " + results.hash);
        console.log("Result = " + results.result);
        localStorage.setItem("escrow",results.hash)
    
        let program = new Uint8Array(Buffer.from(results.result, "base64"));
    
        let lsig = algosdk.makeLogicSig(program);
        console.log("Escrow =", lsig.address());
        try {
          const accounts = await myAlgoWallet.connect();
          const addresses = accounts.map((account) => account.address);
          const params = await algodClient.getTransactionParams().do();
    
          let sender =  localStorage.getItem("walletAddress");;
          let recv_escrow = lsig.address();
          let amount ;
         
          
          if(parseInt(t2) == 0){
            let accountasset1 = await algodClient.getAssetByID(t1).do();
            // let accountasset2 = await algodClient.getAssetByID(t2).do();
            let unit1 = accountasset1.params['unit-name'];
            console.log(unit1)
            let unit2 ="ALGO";
            amount = 860000;
            let transaction1 = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
              from: sender,
              to: recv_escrow,
              amount: amount,
              note: undefined,
              suggestedParams: params,
            });
      
            let appArg = [];
            appArg.push(new Uint8Array(Buffer.from("bootstrap")));
            appArg.push(algosdk.encodeUint64(parseInt(t1)));
            appArg.push(algosdk.encodeUint64(parseInt(t2)));
            let foreignassets = [];
            foreignassets.push(parseInt(t1));
            // foreignassets.push(parseInt(t2));
            const transaction2 = algosdk.makeApplicationOptInTxnFromObject({
              from: recv_escrow,
              appIndex: index,
              appArgs: appArg,
              accounts: [sender],
              foreignAssets: foreignassets,
              suggestedParams: params,
            });
      
            const transaction3 =
              algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
                from: recv_escrow,
                assetName: "Element Pool "+unit1+"-"+"ALGO",
                unitName: "ELEMPOOL",
                assetURL: "https://Element.org",
                total: 18446744073709551615n,
                decimals: 6,
                note: undefined,
                suggestedParams: params,
              });
      
            const transaction4 =
              algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                from: recv_escrow,
                to: recv_escrow,
                assetIndex: parseInt(t1),
                note: undefined,
                amount: 0,
                suggestedParams: params,
              });
      
            
      
            const groupID = algosdk.computeGroupID([
              transaction1,
              transaction2,
              transaction3,
              transaction4
            ]);
            const txs = [
              transaction1,
              transaction2,
              transaction3,
              transaction4              
            ];
            txs[0].group = groupID;
            txs[1].group = groupID;
            txs[2].group = groupID;
            txs[3].group = groupID;
      
            const signedTx1 = await myAlgoWallet.signTransaction(txs[0].toByte());
            const signedTx2 = algosdk.signLogicSigTransaction(txs[1], lsig);
      
            const signedTx3 = algosdk.signLogicSigTransaction(txs[2], lsig);
            const signedTx4 = algosdk.signLogicSigTransaction(txs[3], lsig);
            
      
            
            toast.warn("Transaction in Progress"); 
            const response = await algodClient
              .sendRawTransaction([
                signedTx1.blob,
                signedTx2.blob,
                signedTx3.blob,
                signedTx4.blob
              ])
              .do();
          console.log("TxID", JSON.stringify(response, null, 1));
          await waitForConfirmation(algodClient, response.txId);
          toast.success(`Transaction Success ${response.txId}`);
          setShowOptInButton(true);
          }
          else{
            let accountasset1 = await algodClient.getAssetByID(t1).do();
            let accountasset2 = await algodClient.getAssetByID(t2).do();
            let unit1 =accountasset1.params['unit-name']
            console.log(unit1)
            amount = 961000;
            let unit2 =accountasset2.params['unit-name']
          let transaction1 = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            from: sender,
            to: recv_escrow,
            amount: amount,
            note: undefined,
            suggestedParams: params,
          });
    
          let appArg = [];
          appArg.push(new Uint8Array(Buffer.from("bootstrap")));
          appArg.push(algosdk.encodeUint64(parseInt(t1)));
          appArg.push(algosdk.encodeUint64(parseInt(t2)));
          let foreignassets = [];
          foreignassets.push(parseInt(t1));
          foreignassets.push(parseInt(t2));
          const transaction2 = algosdk.makeApplicationOptInTxnFromObject({
            from: recv_escrow,
            appIndex: index,
            appArgs: appArg,
            accounts: [sender],
            foreignAssets: foreignassets,
            suggestedParams: params,
          });
    
          const transaction3 =
            algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
              from: recv_escrow,
              assetName: "Element Pool " + unit1 + "-" + unit2,
              unitName: "ELEMPOOL",
              assetURL: "https://Element.org",
              total: 18446744073709551615n,
              decimals: 6,
              note: undefined,
              suggestedParams: params,
            });
    
          const transaction4 =
            algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
              from: recv_escrow,
              to: recv_escrow,
              assetIndex: parseInt(t1),
              note: undefined,
              amount: 0,
              suggestedParams: params,
            });
    
          const transaction5 =
            algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
              from: recv_escrow,
              to: recv_escrow,
              assetIndex: parseInt(t2),
              note: undefined,
              amount: 0,
              suggestedParams: params,
            });
    
          const groupID = algosdk.computeGroupID([
            transaction1,
            transaction2,
            transaction3,
            transaction4,
            transaction5,
          ]);
          const txs = [
            transaction1,
            transaction2,
            transaction3,
            transaction4,
            transaction5,
          ];
          txs[0].group = groupID;
          txs[1].group = groupID;
          txs[2].group = groupID;
          txs[3].group = groupID;
          txs[4].group = groupID;
    
          const signedTx1 = await myAlgoWallet.signTransaction(txs[0].toByte());
          const signedTx2 = algosdk.signLogicSigTransaction(txs[1], lsig);
    
          const signedTx3 = algosdk.signLogicSigTransaction(txs[2], lsig);
          const signedTx4 = algosdk.signLogicSigTransaction(txs[3], lsig);
          const signedTx5 = algosdk.signLogicSigTransaction(txs[4], lsig);
    
          
          toast.warn("Transaction in Progress");
          const response = await algodClient
            .sendRawTransaction([
              signedTx1.blob,
              signedTx2.blob,
              signedTx3.blob,
              signedTx4.blob,
              signedTx5.blob,
            ])
            .do();
          console.log("TxID", JSON.stringify(response, null, 1));
          await waitForConfirmation(algodClient, response.txId);
          toast.success(`Transaction Success ${response.txId}`);
          setShowOptInButton(true);
          }
          
          
         
          //setShowOptInButton(true);
        } catch (err) {
          toast.error(`Transaction Failed due to ${err}`);
          console.error(err);
        }
      };
      const optIn =async (appid) => {

        const algodClient = new algosdk.Algodv2('', 'https://api.testnet.algoexplorer.io', '');
        const params = await algodClient.getTransactionParams().do();
        let escrowaddress = localStorage.getItem("escrow");
        let accountInfoResponse = await algodClient.accountInformation(escrowaddress).do();
        console.log("account",accountInfoResponse);
        let assetId3 = accountInfoResponse['created-assets'][0]['index'];
        localStorage.setItem("newasset",assetId3);
        console.log('Asset 3 ID: ', assetId3);
  
  
      
    let index = parseInt(appid);
    console.log("appId inside donate", index)
  try {
    

    let optinTranscation = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from:localStorage.getItem("walletAddress"),
      to :localStorage.getItem("walletAddress"),
      assetIndex: assetId3 ,
      amount: 0,
      suggestedParams:params,
      appIndex:index
    });

    
      
      const signedTx1 = await myAlgoWallet.signTransaction(optinTranscation.toByte());
      toast.warn("Transaction in Progress");

  const response = await algodClient.sendRawTransaction(signedTx1.blob).do();
  console.log("TxID", JSON.stringify(response, null, 1));
  await waitForConfirmation(algodClient, response.txId);
  toast.success(`Transaction Success ${response.txId}`);
  setShowMintButton(true);
    } catch (err) {
      toast.error(`Transaction Failed due to ${err}`);
      console.error(err);
    }

     
  }
  const mint = async (appid) => {
 
    let index = parseInt(appid);
    console.log("appId inside donate", index);
    console.log("input1",input1)
    console.log("input2",input2)
    setAppId(appid);
    let tokenid1 = localStorage.getItem("tokenid1");
    let tokenid2 = localStorage.getItem("tokenid2");
      
    let replacedData = data.replaceAll("Token1",tokenid1).replaceAll("Token2",tokenid2).replaceAll("appId",appID_global);
    let results = await algodClient.compile(replacedData).do();

    console.log("Hash = " + results.hash);
    console.log("Result = " + results.result);

    
    let assetId3 = localStorage.getItem("newasset")
    console.log(assetId3)

    let program = new Uint8Array(Buffer.from(results.result, "base64"));

    let lsig = algosdk.makeLogicSig(program);
    console.log("Escrow =", lsig.address()); 

    readLocalState(algodClient,results.hash,appId,tokenid1,tokenid2,assetId3);


    let total;
    console.log("s1",ilt)
    if (s1 === undefined || s2 === "") {
      total = Math.floor(Math.sqrt(input1 * input2)) - 1000;
      console.log("Total,: ", total);
    } else {
      let liquidity_asset_amount = Math.min(
        (input1 * ilt) / s1,
        (input2 * ilt) / s2
      );
      total = Math.floor((liquidity_asset_amount - liquidity_asset_amount )* 0.5);
      console.log("Total 2: ", total);
    }
    let asset1Name = await assetName(tokenid1);
    let asset2Name = await assetName(tokenid2);

    const userjsonkey= {
      "algoAddress": results.hash,
      "creationTime": "",
      "accountType": tokenid1,    
      "profileName": tokenid2,
      "twitterName": assetId3,   
      "profileURL": localStorage.getItem("walletAddress"),
      "asset1Name": asset1Name,
      "asset2Name": asset2Name,
      "escrowData": results.result
  }
    await axios.post(`${config}/users`,userjsonkey)
        .then(async(responseuser) => {
          console.log("uploadeduser",responseuser)                        
          // this.setState({setLoading:false}) ;  
          // this.setState({setisOpenmkyc:true}); 
          try {

            const params = await algodClient.getTransactionParams().do();
            let sender = localStorage.getItem("walletAddress");
      
            let recv_escrow = lsig.address();
            let amount = 3000;
      
            let note1 = [];
            note1.push(new Uint8Array(Buffer.from("fee")));
            if(parseInt(tokenid2) == 0){
      
              let transaction1 = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
                from: sender,
                to: recv_escrow,
                amount: amount,
                suggestedParams: params,
              });
        
              let appArg = [];
              appArg.push(new Uint8Array(Buffer.from("mint")));
        
              let foreignassets = [];
              foreignassets.push(parseInt(tokenid1));
              // foreignassets.push(parseInt(tokenid2));
              foreignassets.push(parseInt(assetId3));
              const transaction2 = algosdk.makeApplicationNoOpTxnFromObject({
                from: recv_escrow,
                appIndex: index,
                appArgs: appArg,
                appAccounts: sender,
                accounts: [sender],
                foreignAssets: foreignassets,
                suggestedParams: params,
              });
        
              const transaction3 =
                algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                  from: sender,
                  to: recv_escrow,
                  assetIndex: parseInt(tokenid1),
                  note: undefined,
                  accounts: sender,
                  amount: parseInt(input1),
                  suggestedParams: params,
                });
        
              const transaction4 =
                algosdk.makePaymentTxnWithSuggestedParamsFromObject({
                  from: sender,
                  to: recv_escrow,
                  note: undefined,
                  accounts: sender,
                  amount: parseInt(input2),
                  suggestedParams: params,
                });
        
              let foreignassetliquidity = [];
              foreignassetliquidity.push(parseInt(assetId3));
              console.log(total.toFixed(0));
              const transaction5 =
                algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                  from: recv_escrow,
                  to: sender,
                  assetIndex: parseInt(assetId3),
                  note: undefined,
                  accounts: [recv_escrow],
                  appAccounts: recv_escrow,
                  foreignAssets: foreignassetliquidity,
                  amount: parseInt(total.toFixed(0)),
                  suggestedParams: params,
                });
                const groupID = algosdk.computeGroupID([
                  transaction1,
                  transaction2,
                  transaction3,
                  transaction4,
                  transaction5,
                ]);
                const txs = [
                  transaction1,
                  transaction2,
                  transaction3,
                  transaction4,
                  transaction5,
                ];
                for (let i = 0; i <= 4; i++) txs[i].group = groupID;
          
                const signedTx1 = algosdk.signLogicSigTransaction(txs[1], lsig);
                const signedTx2 = algosdk.signLogicSigTransaction(txs[4], lsig);
        
                const signedTxArray = await myAlgoWallet.signTransaction([txs[0].toByte(),txs[2].toByte(),txs[3].toByte()]);
                toast.warn("Transaction in Progress");
                const response = await algodClient
                  .sendRawTransaction([
                    signedTxArray[0].blob,
                    signedTx1.blob,
                    signedTxArray[1].blob,
                    signedTxArray[2].blob,
                    signedTx2.blob,
                  ])
                  .do();
                console.log("TxID", JSON.stringify(response, null, 1));
                await waitForConfirmation(algodClient, response.txId);
      
                toast.success(`Transaction Success ${response.txId}`);
              //   setTxId(response.txId);
            }
            else{
            let transaction1 = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
              from: sender,
              to: recv_escrow,
              amount: amount,
              suggestedParams: params,
            });
      
            let appArg = [];
            appArg.push(new Uint8Array(Buffer.from("mint")));
      
            let foreignassets = [];
            foreignassets.push(parseInt(tokenid1));
            foreignassets.push(parseInt(tokenid2));
            foreignassets.push(parseInt(assetId3));
            const transaction2 = algosdk.makeApplicationNoOpTxnFromObject({
              from: recv_escrow,
              appIndex: index,
              appArgs: appArg,
              appAccounts: sender,
              accounts: [sender],
              foreignAssets: foreignassets,
              suggestedParams: params,
            });
      
            const transaction3 =
              algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                from: sender,
                to: recv_escrow,
                assetIndex: parseInt(tokenid1),
                note: undefined,
                accounts: sender,
                amount: parseInt(input1),
                suggestedParams: params,
              });
      
            const transaction4 =
              algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                from: sender,
                to: recv_escrow,
                assetIndex: parseInt(tokenid2),
                note: undefined,
                accounts: sender,
                amount: parseInt(input2),
                suggestedParams: params,
              });
      
            let foreignassetliquidity = [];
            foreignassetliquidity.push(parseInt(assetId3));
            console.log(total.toFixed(0));
            const transaction5 =
              algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                from: recv_escrow,
                to: sender,
                assetIndex: parseInt(assetId3),
                note: undefined,
                accounts: [recv_escrow],
                appAccounts: recv_escrow,
                foreignAssets: foreignassetliquidity,
                amount: parseInt(Math.round(total)),
                suggestedParams: params,
              });
              const groupID = algosdk.computeGroupID([
                transaction1,
                transaction2,
                transaction3,
                transaction4,
                transaction5,
              ]);
              const txs = [
                transaction1,
                transaction2,
                transaction3,
                transaction4,
                transaction5,
              ];
              for (let i = 0; i <= 4; i++) txs[i].group = groupID;
        
              const signedTx1 = algosdk.signLogicSigTransaction(txs[1], lsig);
              const signedTx2 = algosdk.signLogicSigTransaction(txs[4], lsig);
      
              const signedTxArray = await myAlgoWallet.signTransaction([txs[0].toByte(),txs[2].toByte(),txs[3].toByte()]);
              toast.warn("Transaction in Progress");
              const response = await algodClient
                .sendRawTransaction([
                  signedTxArray[0].blob,
                  signedTx1.blob,
                  signedTxArray[1].blob,
                  signedTxArray[2].blob,
                  signedTx2.blob,
                ])
                .do();
              console.log("TxID", JSON.stringify(response, null, 1));
              await waitForConfirmation(algodClient, response.txId);
              toast.success(`Transaction Success ${response.txId}`);
              // setTxId(response.txId);
            }
            
           
            setShow(true);
          } catch (err) {
            toast.error(`Transaction Failed due to ${err}`);
            console.error(err);
          }                                         
        })
        .catch((e) => {
          console.log(e);  
        })
    
  };
  const mint1call = async (appid,a1,a2) => {
 
    let index = parseInt(appid);
    console.log("appId inside donate", index);
    console.log("input1",a1)
    console.log("input2",a2)
    setAppId(appid);
    let tokenid1 = rstate.accountType;
    let tokenid2 = rstate.profileName;
      
    let replacedData = data.replaceAll("Token1",tokenid1).replaceAll("Token2",tokenid2).replaceAll("appId",appID_global);
    let results = await algodClient.compile(replacedData).do();

    console.log("Hash = " + results.hash);
    console.log("Result = " + results.result);

    
    let assetId3 = rstate.twitterName;
    console.log(assetId3)

    let program = new Uint8Array(Buffer.from(results.result, "base64"));

    let lsig = algosdk.makeLogicSig(program);
    console.log("Escrow =", lsig.address()); 

    readLocalState(algodClient,results.hash,appId,tokenid1,tokenid2,assetId3);

let i1 = Math.floor(a1);
let i2 = Math.floor(a2);
console.log("input1",i1)
    console.log("input2",ilt)

    let total;
   

      let liquidity_asset_amount = Math.min(
        (i1 * ilt) / s1,
        (i2 * ilt) / s2
      );
      //  let liquidity_asset_amount = Math.min(
      //   (i1 * aprice[3]) / aprice[0],
      //   (i2 * aprice[3]) / aprice[1]
      // );
      console.log("liquidity_asset_amount",liquidity_asset_amount)
      // total = Math.floor((liquidity_asset_amount - liquidity_asset_amount )* 0.5);
      total = Math.floor(liquidity_asset_amount)
      console.log("Total 2: ", total);
   

                          
          // this.setState({setLoading:false}) ;  
          // this.setState({setisOpenmkyc:true}); 
          try {

            const params = await algodClient.getTransactionParams().do();
            let sender = localStorage.getItem("walletAddress");
      
            let recv_escrow = lsig.address();
            let amount = 3000;
      
            let note1 = [];
            note1.push(new Uint8Array(Buffer.from("fee")));
            if(parseInt(tokenid2) == 0){
      
              let transaction1 = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
                from: sender,
                to: recv_escrow,
                amount: amount,
                suggestedParams: params,
              });
        
              let appArg = [];
              appArg.push(new Uint8Array(Buffer.from("mint")));
        
              let foreignassets = [];
              foreignassets.push(parseInt(tokenid1));
              // foreignassets.push(parseInt(tokenid2));
              foreignassets.push(parseInt(assetId3));
              const transaction2 = algosdk.makeApplicationNoOpTxnFromObject({
                from: recv_escrow,
                appIndex: index,
                appArgs: appArg,
                appAccounts: sender,
                accounts: [sender],
                foreignAssets: foreignassets,
                suggestedParams: params,
              });
        console.log("3rdtran",i1)
              const transaction3 =
                algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                  from: sender,
                  to: recv_escrow,
                  assetIndex: parseInt(tokenid1),
                  note: undefined,
                  accounts: sender,
                  amount: parseInt(i1),
                  suggestedParams: params,
                });
        
              const transaction4 =
                algosdk.makePaymentTxnWithSuggestedParamsFromObject({
                  from: sender,
                  to: recv_escrow,
                  note: undefined,
                  accounts: sender,
                  amount: parseInt(i2),
                  suggestedParams: params,
                });
        
              let foreignassetliquidity = [];
              foreignassetliquidity.push(parseInt(assetId3));
              console.log(total.toFixed(0));
              const transaction5 =
                algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                  from: recv_escrow,
                  to: sender,
                  assetIndex: parseInt(assetId3),
                  note: undefined,
                  accounts: [recv_escrow],
                  appAccounts: recv_escrow,
                  foreignAssets: foreignassetliquidity,
                  amount: (total),
                  suggestedParams: params,
                });
                const groupID = algosdk.computeGroupID([
                  transaction1,
                  transaction2,
                  transaction3,
                  transaction4,
                  transaction5,
                ]);
                const txs = [
                  transaction1,
                  transaction2,
                  transaction3,
                  transaction4,
                  transaction5,
                ];
                for (let i = 0; i <= 4; i++) txs[i].group = groupID;
          
                const signedTx1 = algosdk.signLogicSigTransaction(txs[1], lsig);
                const signedTx2 = algosdk.signLogicSigTransaction(txs[4], lsig);
        
                const signedTxArray = await myAlgoWallet.signTransaction([txs[0].toByte(),txs[2].toByte(),txs[3].toByte()]);
                toast.warn("Transaction in Progress");
                const response = await algodClient
                  .sendRawTransaction([
                    signedTxArray[0].blob,
                    signedTx1.blob,
                    signedTxArray[1].blob,
                    signedTxArray[2].blob,
                    signedTx2.blob,
                  ])
                  .do();
                console.log("TxID", JSON.stringify(response, null, 1));
                await waitForConfirmation(algodClient, response.txId);
      
                toast.success(`Transaction Success ${response.txId}`);
              //   setTxId(response.txId);
            }
            else{
            let transaction1 = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
              from: sender,
              to: recv_escrow,
              amount: amount,
              suggestedParams: params,
            });
      
            let appArg = [];
            appArg.push(new Uint8Array(Buffer.from("mint")));
      
            let foreignassets = [];
            foreignassets.push(parseInt(tokenid1));
            foreignassets.push(parseInt(tokenid2));
            foreignassets.push(parseInt(assetId3));
            const transaction2 = algosdk.makeApplicationNoOpTxnFromObject({
              from: recv_escrow,
              appIndex: index,
              appArgs: appArg,
              appAccounts: sender,
              accounts: [sender],
              foreignAssets: foreignassets,
              suggestedParams: params,
            });
      
            const transaction3 =
              algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                from: sender,
                to: recv_escrow,
                assetIndex: parseInt(tokenid1),
                note: undefined,
                accounts: sender,
                amount: parseInt(i1),
                suggestedParams: params,
              });
      
            const transaction4 =
              algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                from: sender,
                to: recv_escrow,
                assetIndex: parseInt(tokenid2),
                note: undefined,
                accounts: sender,
                amount: parseInt(i2),
                suggestedParams: params,
              });
      
            let foreignassetliquidity = [];
            foreignassetliquidity.push(parseInt(assetId3));
            console.log(total.toFixed(0));
            const transaction5 =
              algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                from: recv_escrow,
                to: sender,
                assetIndex: parseInt(assetId3),
                note: undefined,
                accounts: [recv_escrow],
                appAccounts: recv_escrow,
                foreignAssets: foreignassetliquidity,
                amount: parseInt((total)),
                suggestedParams: params,
              });
              const groupID = algosdk.computeGroupID([
                transaction1,
                transaction2,
                transaction3,
                transaction4,
                transaction5,
              ]);
              const txs = [
                transaction1,
                transaction2,
                transaction3,
                transaction4,
                transaction5,
              ];
              for (let i = 0; i <= 4; i++) txs[i].group = groupID;
        
              const signedTx1 = algosdk.signLogicSigTransaction(txs[1], lsig);
              const signedTx2 = algosdk.signLogicSigTransaction(txs[4], lsig);
             
              const signedTxArray = await myAlgoWallet.signTransaction([txs[0].toByte(),txs[2].toByte(),txs[3].toByte()]);
              toast.warn("Transaction in Progress");
              const response = await algodClient
                .sendRawTransaction([
                  signedTxArray[0].blob,
                  signedTx1.blob,
                  signedTxArray[1].blob,
                  signedTxArray[2].blob,
                  signedTx2.blob,
                ])
                .do();
              console.log("TxID", JSON.stringify(response, null, 1));
              await waitForConfirmation(algodClient, response.txId);
              toast.success(`Transaction Success ${response.txId}`);
              // setTxId(response.txId);
            }
            
           
            
          } catch (err) {
            toast.error(`Transaction Failed due to ${err}`);
            console.error(err);
          }                                         
        
    
  };
  
 const optin =async () => {
   
    const myAlgoWallet = new MyAlgoConnect();
    const algodClient = new algosdk.Algodv2('', 'https://api.testnet.algoexplorer.io', '');
    
    
    
    let index = parseInt(appID_global);
    console.log("appId inside donate", index)
  try {
   
    const params = await algodClient.getTransactionParams().do();

    let optinTranscation = algosdk.makeApplicationOptInTxnFromObject({
      from:localStorage.getItem("walletAddress"),
      suggestedParams:params,
      appIndex:index
    });

    
      
      const signedTx1 = await myAlgoWallet.signTransaction(optinTranscation.toByte());
      
      toast.warn("Transaction in Progress");
  const response = await algodClient.sendRawTransaction(signedTx1.blob).do();
  console.log("TxID", JSON.stringify(response, null, 1));
  await waitForConfirmation(algodClient, response.txId);
  toast.success(`Transaction Success ${response.txId}`);
    } catch (err) {
      toast.error(`Transaction Failed due to ${err}`);
      console.error(err);
    }
  }

  const rem = async(a1,a2,a3) =>{
    let escrowaddress = rstate.algoAddress;
    await readLocalState(algodClient,escrowaddress,appID_global,a1,a2,a3);
      
    handleRemove()
  }
  const addli = async() =>{
    let s1 =  await find_balance(rstate.accountType);
    console.log("b1",s1)
    setas1balance(s1);
    let s2 = await find_balance(rstate.profileName);
    setas2balance(s2);
    console.log("b2",s2)
    // const assets1 = await indexerClient.lookupAssetBalances(rstate.accountType).do();
    // console.log("asset",assets1)
    // assets1.balances.map((a)=>{
    //   if(a.address == localStorage.getItem("walletAddress")){
    //     setas1balance(a.amount)
    //   }
    // })
    // const assets2 = await indexerClient.lookupAssetBalances(rstate.profileName).do();
    // assets2.balances.map((a)=>{
    //   if(a.address == localStorage.getItem("walletAddress")){
    //     setas2balance(a.amount)
    //   }
    // })
    
  }
  const percent = async(entered_percent) =>{
       let liquidity_asset_in = gvprice * entered_percent / 100;
       setliquidityamount(liquidity_asset_in);
        console.log("v",liquidity_asset_in) 
  
        let asset1_amount = (liquidity_asset_in * s1) / ilt ;
        console.log(asset1_amount)
        let asset2_amount = (liquidity_asset_in * s2) / ilt ;
        let asset1_amount_out = asset1_amount - (asset1_amount * 0.5)
        setamount1Out(asset1_amount_out)
        let asset2_amount_out = asset2_amount - (asset2_amount * 0.5)
        setamount2Out(asset2_amount_out)

        console.log("asset1_amount_out",asset1_amount_out)
        
        console.log("asset2_amount_out",asset2_amount_out)

  }
    const percent1 = async () => {
      let tokenid1 = rstate.accountType;
      let tokenid2 = rstate.profileName;
      let index = parseInt(appID_global);
      console.log("appId inside donate", tokenid2);

      
      let t1,t2;
      if(tokenid1 > tokenid2 ){
          t2 = tokenid2;
          t1 = tokenid1;
          
      }
      else{
          t2 = tokenid1;
          t1 = tokenid2;
          
      }
  
      
    // let replacedData = data.replaceAll("Token1",tokenid1).replaceAll("Token2",tokenid2).replaceAll("appId",appId);
    // let results = await algodClient.compile(replacedData).do();
      let replacedData = data.replaceAll("Token1",t1).replaceAll("Token2",t2).replaceAll("appId",appID_global);
      let results = await algodClient.compile(replacedData).do();
   console.log("data")
      setesdata(results);
      console.log("Hash = " + results.hash);
      console.log("Result = " + results.result);
      let escrowaddress = results.hash;
      console.log("escrow",escrowaddress)
      let program = new Uint8Array(Buffer.from(results.result, "base64"));
  
      let lsig = algosdk.makeLogicSig(program);
      console.log("Escrow =", lsig.address()); 
            // let accountInfoResponse = await algodClient.accountInformation(results.hash).do();
      // console.log("account",accountInfoResponse);
      // let assetId3 = accountInfoResponse['created-assets'][0]['index'];
      
      // let k = await indexerClient.lookupAccountByID(rstate.algoAddress).do();
     
      // console.log("k",k)
     
          try {
            // const accounts = await myAlgoWallet.connect();
            // const addresses = accounts.map(account => account.address);
            const params = await algodClient.getTransactionParams().do();
            
            let sender =  localStorage.getItem("walletAddress");
            let recv_escrow = lsig.address();
            let amount = 3000;
            
            let note1=[];
            note1.push(new Uint8Array(Buffer.from("fee")));
            let transaction1 = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
              from:  localStorage.getItem("walletAddress"), 
              to: recv_escrow, 
              amount: amount, 
              //  note: note1,  
               suggestedParams: params
             });
           
             let appArg = [];
             appArg.push(new Uint8Array(Buffer.from("burn")));
             
             let foreignassets = [];
            //  let decAddr = algosdk.decodeAddress(addresses[0]);
            //  foreignassets.push(decAddr.publicKey);
             foreignassets.push(parseInt(t1));
             foreignassets.push(parseInt(t2));
             foreignassets.push(parseInt(rstate.twitterName));
             const transaction2 = algosdk.makeApplicationNoOpTxnFromObject({
                 from: recv_escrow, 
                 appIndex: index,
                 appArgs: appArg,
                 appAccounts: localStorage.getItem("walletAddress"),
                 accounts: [ localStorage.getItem("walletAddress")],
                 foreignAssets:foreignassets,
                 suggestedParams: params
               });
      
             
              console.log(parseInt(amount1Out).toFixed(0))
              const transaction3 = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                from:recv_escrow ,
                to:  localStorage.getItem("walletAddress"),
                assetIndex: parseInt(t1),
                note: undefined,
                accounts:  localStorage.getItem("walletAddress"),
                amount: parseInt(parseInt(amount1Out.toFixed(0))),
                suggestedParams: params
              });
  
              const transaction4 = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                from:recv_escrow ,
                to:  localStorage.getItem("walletAddress"),
                assetIndex: parseInt(t2),
                note: undefined,
                accounts:  localStorage.getItem("walletAddress"),
                amount: parseInt(amount2Out.toFixed(0)),
                suggestedParams: params
              });
              
              let foreignassetliquidity =[];
              foreignassetliquidity.push(parseInt(rstate.twitterName));
              // let decAddr = algosdk.decodeAddress(recv_escrow);
              // let acc =[];
              // acc.push(decAddr.publicKey);
              const transaction5 = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                from:  localStorage.getItem("walletAddress") ,
                to:recv_escrow ,
                assetIndex: parseInt(rstate.twitterName),
                note: undefined,
                accounts: [recv_escrow],
                appAccounts:recv_escrow,
                foreignAssets:foreignassetliquidity,
                amount: parseInt(liquidityamount),
                suggestedParams: params
              });
      
          
            const groupID = algosdk.computeGroupID([ transaction1, transaction2, transaction3, transaction4, transaction5]);
            const txs = [ transaction1, transaction2, transaction3, transaction4, transaction5];
            txs[0].group = groupID;
            txs[1].group = groupID;
            txs[2].group = groupID;
            txs[3].group = groupID;
            txs[4].group = groupID;
            
            const signedTx1 = await myAlgoWallet.signTransaction([txs[0].toByte(),txs[4].toByte()]);
            const signedTx2 = algosdk.signLogicSigTransaction(txs[1], lsig);
            const signedTx3 = algosdk.signLogicSigTransaction(txs[2], lsig);
            const signedTx4 = algosdk.signLogicSigTransaction(txs[3], lsig);
            // const signedTx5 = await myAlgoWallet.signTransaction(txs[4].toByte());
            toast.warn("Swapping in Progress");
      const response = await algodClient.sendRawTransaction([ signedTx1[0].blob, signedTx2.blob, signedTx3.blob, signedTx4.blob, signedTx1[1].blob ]).do();
         
    console.log("TxID", JSON.stringify(response, null, 1));
    
    
    await waitForConfirmation(algodClient, response.txId);
    toast.success(`Transaction Completed Successfully ${response.txId}`);
      } catch (err) {
        toast.error(`Transaction Failed due to ${err}`);
        console.error(err);
      }
    };

const manager = async(r,a,b,c) =>{
let l=[];
l.push(a);
l.push(b);
l.push(c)
  setrstate(r);
  setaprice(l)
  let p = await readingLocalstate(algodClient,r.algoAddress);
  console.log("prime",p)
    let p1 =await rewardasset1(p, r.accountType);
   console.log("afterp1",p1)
    let p2 = rewardasset2(p,r.profileName);
    let p3 = await rewardasset3(p,r.twitterName);
    
    let added = p1 + p2 + p3;
    console.log("rewardasset3",added)
    setpooladdedValue(added);
    console.log("pooled",pooledValue)
  handleManage();
}
const manager1 = async() =>{
  let v = await find_balance_escrow(rstate.twitterName,rstate.algoAddress)
  console.log("balance",v)
  setexcessb(v);
  let s =  await find_balance(rstate.twitterName);
  setgivenprice(s)
  // // let a =  (algosdk.encodeUint64((65613731)));

  // console.log("ssetgiven",s);
    
  

}
console.log("rstate",rstate);

const pool= async()=>{
  callapi()
  first()
  handleShow()
}
function SetValue1(Amountin){
  let amount2 = convert1((Amountin * 1000000),aprice[0],aprice[1]);
  console.log("amout2",amount2)
  setamount2(amount2/1000000);
  setsAmount1(Amountin * 1000000)
  setsAmount2(amount2)
}
function SetValue2(Amountin){
  let amount2 = convert2((Amountin * 1000000),aprice[0],aprice[1]);
  console.log("amout2",amount2)
  setamount1(amount2/1000000);
  setsAmount1(amount2)
  setsAmount2(Amountin * 1000000)
}



// const pooladdedvalues= async(k) =>{
    
// }
// useEffect(() =>{()},[])
// const asset_reserve= (escrAddr,a1,a2,a3) =>{
//   readLocalState(algodClient,escrAddr,appID_global,a1,a2,a3)
//   let s =[];
//   s.push(s1);
//   console.log("arrayvalues",s1)
// }
// const findBalance = async() =>{
//   let v = await find_balance(rstate.twitterName)
//   console.log("balance",v)
//   setexcessb(v);
// }

 const setVal =(k) =>{
  setValue(k);
  callp1();
  setpc1(pr1 * (k/1000000));
  console.log("price1",pr1*k)
 }
 const setVal2 =(k) =>{
  setValue1(k);
   callp2();
  setpc2(pr2 * (k/1000000));
  console.log("price1",pr2*k)
 }
    
    return (
        <Layout>
            <div className="page-content">
                <Container fluid="sm">
                    <div className="card-base text-center mb-30 card-pool card-dark">
                        <Button className='card-close' variant='reset'>
                            <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g opacity="0.3">
                                <path d="M17.5004 32.0832C9.44597 32.0832 2.91699 25.5542 2.91699 17.4998C2.91699 9.44546 9.44597 2.9165 17.5004 2.9165C25.5548 2.9165 32.0837 9.44546 32.0837 17.4998C32.0837 25.5542 25.5548 32.0832 17.5004 32.0832ZM17.5004 29.1665C20.5946 29.1665 23.562 27.9373 25.75 25.7494C27.9379 23.5615 29.1671 20.594 29.1671 17.4998C29.1671 14.4056 27.9379 11.4382 25.75 9.25026C23.562 7.06233 20.5946 5.83317 17.5004 5.83317C14.4062 5.83317 11.4387 7.06233 9.25076 9.25026C7.06283 11.4382 5.83367 14.4056 5.83367 17.4998C5.83367 20.594 7.06283 23.5615 9.25076 25.7494C11.4387 27.9373 14.4062 29.1665 17.5004 29.1665ZM17.5004 15.4378L21.6245 11.3121L23.6881 13.3757L19.5625 17.4998L23.6881 21.624L21.6245 23.6875L17.5004 19.5619L13.3762 23.6875L11.3126 21.624L15.4383 17.4998L11.3126 13.3757L13.3762 11.3121L17.5004 15.4378Z" fill="white"/>
                                </g>
                            </svg>
                        </Button>
                        <h3>Liquidity provider rewards</h3>
                        <p>Liquidity providers earn a 0.20% fee on all trades proportional to their share of the pool. Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity.</p>
                    </div>

                    <div className="card-base text-center card-pool card-dark">
                        <h3 >My liquidity positions</h3>
                        <Button onClick={()=>pool()} className='btn btn-grad btn-xl' >Liquidity</Button>
                    </div>
                </Container>
            </div>

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
                   

                    {!liquidity ? (
                        <div className="text-center">
                            <Row className='justify-content-center mb-100'>
                                <Col md={9}>
                                    <h3>Liquidity provider rewards</h3>
                                    <p>Liquidity providers earn a 0.20% fee on all trades proportional to their share of the pool. Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity.</p>

                                    <Link to="/" className='btn-link-purple text-underline'>Learn more about providing liquidity</Link>
                                </Col>
                            </Row>

                            <div className="d-flex flex-sm-row mb-10 flex-column justify-content-sm-between align-items-center">
                                <h6 className='mb-sm-0 mb-3'>Liquidity</h6>
                                {/* <div className="modal-manage" color="white">
                                <h6 className='mb-sm-0 mb-3'>Your liquidity</h6>
                    {dbdata.map(function (role, i) { <div >
                      
                      <h6 className='mb-sm-0 mb-3 "modal-manage"' >Your liquidity</h6>
                                  {(role.profileURL === localStorage.getItem("walletAddress"))?(<>
                                  <h1>Hello</h1>
                                  <h6 className='mb-sm-0 mb-3'>Your liquidity</h6>
                                    </>
                                  ):(<> <h6 className='mb-sm-0 mb-3'>Your liquidity</h6></>)}
                                    
                                </div>
                                })}
                                </div> */}
                                <div className="d-flex">
                                    <Button variant='grad' onClick={handlePair} className='text-none  ms-2'>Create Pair</Button>
                                    <Button variant='grad' onClick={()=>optin()} className='text-none ms-2'>Optin To App</Button>
                                </div>
                            </div>
                            
                          
                            <div className="modal-manage">
                            {dbdata.map((r,i)=>{
                             
                              if(r.profileURL == localStorage.getItem("walletAddress")){
                                // if(r.profileURL){
                                console.log("rvalue",r)
                                return (<div> 
                                  <div className="d-flex flex-sm-row mb-30 flex-column justify-content-sm-between align-items-center">
                                  <Breadcrumb className='mb-sm-0 mb-3'>
                                    
                                  {/* {dbdata ? (  <h1>{dbdata[0].profileURL}</h1>):(<></>)
                                    } */}
                                      <Breadcrumb.Item>
                                          <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                              <rect width="30.1212" height="30" rx="15" fill="#FA84B5"/>
                                              <path d="M21.943 11.2538C21.4418 12.1245 20.965 12.8983 20.5494 13.6964C20.4394 13.914 20.3905 14.2284 20.4516 14.4582C21.1117 16.9612 21.7963 19.4642 22.4686 21.9671C22.5053 22.1122 22.542 22.2694 22.5909 22.4871C21.8452 22.4871 21.1728 22.5113 20.4883 22.4629C20.366 22.4508 20.1826 22.2211 20.146 22.0518C19.6937 20.4678 19.278 18.8837 18.8379 17.2997C18.8013 17.1788 18.7646 17.0579 18.7035 16.8644C18.5446 17.1304 18.4223 17.3239 18.3001 17.5295C17.4077 19.0651 16.5031 20.5887 15.6107 22.1364C15.464 22.3904 15.3051 22.4992 14.9994 22.4871C14.2904 22.4629 13.5814 22.475 12.7746 22.475C12.8968 22.2453 12.9824 22.076 13.0802 21.9067C14.596 19.307 16.0997 16.7193 17.6277 14.1317C17.7989 13.8415 17.8478 13.5997 17.75 13.2732C17.5055 12.463 17.2977 11.6287 17.0409 10.6976C16.9065 10.9274 16.8087 11.0725 16.7231 11.2176C14.6083 14.833 12.5056 18.4364 10.403 22.0639C10.2197 22.3904 10.0118 22.5113 9.63289 22.4992C8.96054 22.4629 8.27597 22.4871 7.53027 22.4871C7.64029 22.2694 7.72587 22.1122 7.81144 21.9671C10.5375 17.2997 13.2636 12.6444 15.9652 7.97698C16.173 7.61423 16.393 7.46913 16.8087 7.50541C17.2488 7.54168 17.6888 7.52959 18.1289 7.50541C18.4345 7.49331 18.5812 7.57796 18.6668 7.90443C18.9113 8.88387 19.2047 9.8633 19.4614 10.8427C19.5347 11.145 19.6692 11.2659 19.9871 11.2538C20.5983 11.2297 21.2217 11.2538 21.943 11.2538Z" fill="black"/>
                                          </svg>
             
                                        {r.asset1Name}
                                          </Breadcrumb.Item>
                                      <Breadcrumb.Item>
                                          <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                              <rect width="30.1213" height="30" rx="15" fill="#FACB84"/>
                                              <path d="M14.7348 23.25C13.673 23.25 13.673 23.25 13.673 22.2035C13.673 21.2267 13.6376 21.4012 12.8589 21.2267C12.2218 21.0872 11.5493 20.8779 10.9476 20.6337C10.5228 20.4593 10.4874 20.2849 10.5936 19.8663C10.6998 19.4477 10.8414 18.9942 10.983 18.5756C11.0538 18.157 11.1953 18.0872 11.5493 18.2965C12.2926 18.6802 13.0713 18.8895 13.9207 18.9942C14.4163 19.064 14.9118 18.9942 15.4073 18.7849C16.3276 18.4012 16.4691 17.3547 15.6905 16.7616C15.3365 16.4826 14.9118 16.3081 14.487 16.0988C13.8145 15.7849 13.142 15.5407 12.5049 15.1919C11.6555 14.7384 10.983 14.0756 10.6998 13.1337C10.2751 11.564 10.983 9.9593 12.4695 9.19186C12.7173 9.05233 13.0005 8.94767 13.2836 8.84302C13.8145 8.63372 13.8145 8.63372 13.8145 8.07558C13.8145 7.76163 13.8145 7.48256 13.8499 7.1686C13.8145 6.88953 13.9915 6.75 14.2393 6.75C14.6286 6.75 15.018 6.75 15.4073 6.75C15.6905 6.75 15.8674 6.92442 15.8674 7.20349C15.8674 7.44767 15.8674 7.69186 15.9028 7.93605C15.9382 8.42442 15.9736 8.4593 16.4691 8.59884C17.0355 8.73837 17.6018 8.87791 18.1327 9.05233C18.6282 9.22674 18.6636 9.40116 18.522 9.85465C18.4159 10.2384 18.3097 10.6221 18.1681 11.0058C18.0265 11.4942 17.8849 11.5291 17.4248 11.3198C16.5753 10.936 15.6905 10.7616 14.7348 10.8663C14.5224 10.9012 14.2747 10.936 14.0623 11.0407C13.3544 11.3895 13.2482 12.157 13.8499 12.6453C14.2039 12.9244 14.5932 13.0988 15.018 13.3081C15.7259 13.657 16.4691 13.9012 17.1416 14.2849C18.876 15.2616 19.5839 17.2849 18.7344 18.9942C18.2389 20.0058 17.4248 20.6337 16.363 20.9826C15.7613 21.157 15.7259 21.2267 15.7259 21.8547C15.7259 22.1337 15.7259 22.3779 15.7259 22.657C15.7259 23.0756 15.5843 23.2151 15.1241 23.25C15.0534 23.25 14.8764 23.25 14.7348 23.25Z" fill="black"/>
                                          </svg>

                                          {r.asset2Name}
                                      </Breadcrumb.Item>
                                  </Breadcrumb>

                                  <h6 className='mb-0'>1 {r.asset1Name}  = {parseFloat(asPrice[i]).toFixed(3)} {r.asset2Name}</h6>
                              </div>

                              <div className="d-flex flex-md-row flex-column justify-content-md-between align-items-center">
                                  <Row className='mb-md-0 mb-30 text-nowrap align-items-center text-sm-start'>
                                      <Col sm={3} >
                                          {/* <h6>99.99%</h6> */}
                                          <p>Pool Share  </p>
                                      </Col>
                                      <Col sm={5} className='text-center py-sm-0 py-3'>
                                          <h6 >{parseFloat(as3[i]/1000000).toFixed(3)} </h6>
                                          
                                      </Col>
                                      <Col sm={4}>
                                          <h6 >{parseFloat(as1[i]/1000000).toFixed(3)}  {r.asset1Name}</h6>
                                          <h6>{parseFloat(as2[i]/1000000).toFixed(3)}  {r.asset2Name}</h6>
                                          {/* <h6>~$1,070.67</h6> */}
                                      </Col>
                                  </Row>

                                  <Button variant='grad' onClick={()=>manager(r,as1[i],as2[i],as3[i])} className='text-none ms-2'>Manage</Button>
                              </div>   
                              </div>  )
                              }
                                       })}
                             
                            </div>
                        </div>
                    ):(
                         (
                            <>
                                <div className="modal_header mb-50 d-flex align-items-center">
                                    <Button variant='reset' onClick={handleLiquidiy} className='p-0 me-4'>
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3.828 7.00017H16V9.00017H3.828L9.192 14.3642L7.778 15.7782L0 8.00017L7.778 0.222168L9.192 1.63617L3.828 7.00017Z" fill="white"/>
                                        </svg>
                                    </Button>

                                    <h2 className="h3 mb-0">CREATE LIQUIDITY</h2>     
                                </div>

                                <Row className='justify-content-center' >
                                    <Col md={7}>
                                        <div className="mb-2">
                                            <label className='d-flex align-items-center justify-content-between' >From:
                                            {(tk1 == "Algo")||(tk1 == "USDC") ? (<><small>price:${pc1>0 ? parseFloat(pc1).toFixed(4) : pr1} {tk1}</small></>):(<></>) }
                                            
                                             </label>

                                            <div className="balance-card d-flex align-items-center justify-content-between" >
                                            <input type='text' className='m-0 form-control p-0 border-0 text-white' onChange={(e) => setVal((e.target.value)*1000000)} value={input1/1000000} placeholder='0.0' />

                                              

                                            <FilterDropdown setk = {(t1)=>sett1(t1)} ></FilterDropdown>
                                            </div>
                                        </div>

                                        <div className="mb-2 pt-1 text-center">
                                            <Button variant='reset'>
                                                <svg width="62" height="61" viewBox="0 0 62 61" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect x="0.919922" y="60.1743" width="60.0313" height="60.1591" rx="30" transform="rotate(-90 0.919922 60.1743)" fill="white"/>
                                                    <path d="M30 29.1584V23.1553H32V29.1584H38V31.1595H32V37.1626H30V31.1595H24V29.1584H30Z" fill="black"/>
                                                </svg>
                                            </Button>
                                        </div>

                                        <div className="mb-20">
                                            <label className='d-flex align-items-center justify-content-between'>To: 
                                            {(tk2 == "Algo")||(tk2 == "USDC") ? (<><small >price:${pc2>0 ? parseFloat(pc2).toFixed(4) : pr2}  {tk2}</small></>):(<></>) }
                                            </label>

                                            <div className="balance-card d-flex align-items-center justify-content-between">
                                            <input type='text' className='m-0 form-control p-0 border-0 text-white' onChange={(e) => setVal2((e.target.value)*1000000)} value={input2/1000000} placeholder='0.0' />
                                            
                                            
                                            <FilterDropdown2 setMax ={(value)=>sets1(value)} setMax1 ={(value)=>sets2(value)} setMax2 ={(value)=>setoswapopt(value)} setMax3 ={(value)=>setesc(value)} setk1 ={(k1)=>sett2(k1)}/>

                                            </div>
                                        </div>

                                        <div className="balance-card py-2 mb-10 d-flex align-items-center justify-content-between">
                                            <label>Creating pool fee</label>

                                            <h6>0.86 ALGO</h6>
                                        </div>

                                        <p className="text-red">
                                            {/* <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi me-2 bi-info-circle" viewBox="0 0 16 16">
                                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                            </svg> */}
                                           
                                        </p>
                                        { (!showOptInButton && !showMintButton )?(<>
                                            <Button className='btn w-100 mb-20 text-none btn-grad btn-xl'  onClick={()=>bootstrap(appID_global)}>CREATE POOL</Button>
                                        </>):(showOptInButton && !showMintButton)?(<>
                                            <Button className='btn w-100 mb-20 text-none btn-grad btn-xl'  onClick={()=>optIn(appID_global)}>OPTIN</Button>
                                        </>):(<>
                                            <Button className='btn w-100 mb-20 text-none btn-grad btn-xl'  onClick={()=>mint(appID_global)}>CREATE LIQUIDITY</Button>
                                        </>)
                                        }

                                        <p className='d-flex'>
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi me-2 bi-info-circle" viewBox="0 0 16 16">
                                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                                    <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                                </svg>
                                            </span>
                                            Once you create the pool, other users will be able to add liquidity to it.
                                        </p>

                                    </Col>
                                </Row>
                            </>
                        )
                    )}
                </Modal.Body>
            </Modal>


            <Modal show={manage} centered={true} size="lg" onHide={handleManage}>
            <ToastContainer position='top-center' draggable = {false} transition={Zoom} autoClose={8000} closeOnClick = {false}/>
                <Modal.Body className='modal-liquidity-body'>
                    <Button className='modal-close' onClick={handleManage} variant='reset'>
                        <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g opacity="0.3">
                            <path d="M17.5004 32.0832C9.44597 32.0832 2.91699 25.5542 2.91699 17.4998C2.91699 9.44546 9.44597 2.9165 17.5004 2.9165C25.5548 2.9165 32.0837 9.44546 32.0837 17.4998C32.0837 25.5542 25.5548 32.0832 17.5004 32.0832ZM17.5004 29.1665C20.5946 29.1665 23.562 27.9373 25.75 25.7494C27.9379 23.5615 29.1671 20.594 29.1671 17.4998C29.1671 14.4056 27.9379 11.4382 25.75 9.25026C23.562 7.06233 20.5946 5.83317 17.5004 5.83317C14.4062 5.83317 11.4387 7.06233 9.25076 9.25026C7.06283 11.4382 5.83367 14.4056 5.83367 17.4998C5.83367 20.594 7.06283 23.5615 9.25076 25.7494C11.4387 27.9373 14.4062 29.1665 17.5004 29.1665ZM17.5004 15.4378L21.6245 11.3121L23.6881 13.3757L19.5625 17.4998L23.6881 21.624L21.6245 23.6875L17.5004 19.5619L13.3762 23.6875L11.3126 21.624L15.4383 17.4998L11.3126 13.3757L13.3762 11.3121L17.5004 15.4378Z" fill="white"/>
                            </g>
                        </svg>
                    </Button>
                    
                    {(!remove  && !liquidity) ?(
                        <>
                            <div className="modal_header mb-50 d-flex align-items-center">
                                <Button variant='reset' onClick={handleManage} className='p-0 me-4'>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3.828 7.00017H16V9.00017H3.828L9.192 14.3642L7.778 15.7782L0 8.00017L7.778 0.222168L9.192 1.63617L3.828 7.00017Z" fill="white"/>
                                    </svg>
                                </Button>
  
                                <h2 className="h3 mb-0"  >{rstate.asset1Name} / {rstate.asset2Name}</h2>     
                            </div>
                        
                            <div className="text-center mb-md-5 mb-4">
                                <Button variant='grad' onClick={handleLiquidiy} className='m-2 py-3'>Add</Button>
                                 {/* <Button variant='grad' onClick={handleLiquidiy} className='text-none ms-2'>Add liquidity</Button> */}
                                <Button variant='grad' onClick={()=>rem(rstate.accountType,rstate.profileName,rstate.twitterName)} className='m-2 py-3'>Remove</Button>
                            </div>
                    
                            <Row className='text-center justify-content-center'>
                                <Col md={8}>
                                    <p>Your Pool tokens (including excess amounts)</p>
                                                                
                                    <div className="balance-card mb-10 d-flex align-items-center justify-content-between">
                                        <label onClick={manager1()} >{rstate.asset1Name} / {rstate.asset2Name} Pool Tokens</label>

                                        <div className='h3 m-0' >{(parseFloat(pooledValue)/1000000).toFixed(4)}</div>
                                    </div>
                                </Col>
                            </Row>
                        </>
                    ) :(remove && !liquidity) ? (
                        <>
                            <div className="modal_header mb-50 d-flex align-items-center">
                                <Button variant='reset' onClick={handleRemove} className='p-0 me-4'>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3.828 7.00017H16V9.00017H3.828L9.192 14.3642L7.778 15.7782L0 8.00017L7.778 0.222168L9.192 1.63617L3.828 7.00017Z" fill="white"/>
                                    </svg>
                                </Button>

                                <h2 className="h3 mb-0">Remove liquidity</h2>     
                            </div>

                            <div className="modal-manage mb-30">
                                <Row className='mb-md-0 text-nowrap align-items-center text-center'>
                                    <Col sm={4}>
                                        {/* <h6>99.99%</h6> */}
                                        <p>Pool Share</p>
                                    </Col>
                                    <Col sm={4} className='py-sm-0 py-3'>
                                        <h6>{parseFloat(aprice[2]/1000000).toFixed(4)} </h6>
                                    </Col>
                                    <Col sm={4}>
                                        <h6>{parseFloat(aprice[0]/1000000).toFixed(4)} {rstate.asset1Name}</h6>
                                        <h6>{parseFloat(aprice[1]/1000000).toFixed(4)} {rstate.asset2Name}</h6>
                                    </Col>
                                </Row>
                            </div>
                            
                            <label className='mb-20'>Remove Amount</label>

                            <Row className='mb-30'>
                                <Col xs={6} sm={3} className='mb-3'>
                                    <input type="radio" hidden id='radio1' name="amount" />
                                    <label htmlFor="radio1"  variant="grad" className='btn btn-default px-2 w-100' onClick={()=>percent(25)}>25%</label>
                                </Col>
                                <Col xs={6} sm={3} className='mb-3'>
                                    <input type="radio" hidden id='radio2' name="amount" />
                                    <label htmlFor="radio2" className='btn btn-default px-2 w-100'  onClick={()=>percent(50)}>50%</label>
                                </Col>
                                <Col xs={6} sm={3} className='mb-3'>
                                    <input type="radio" hidden id='radio3' name="amount" />
                                    <label htmlFor="radio3" className='btn btn-default px-2 w-100'  onClick={()=>percent(75)}>75%</label>
                                </Col>
                                <Col xs={6} sm={3} className='mb-3'>
                                    <input type="radio" hidden id='radio4' name="amount" />
                                    <label htmlFor="radio4" className='btn btn-default px-2 w-100'  onClick={()=>percent(100)}>Max</label>
                                </Col>
                            </Row>

                            <Row className='justify-content-center'>
                                <Col md={6}>
                                    <div className="balance-card mb-20 d-flex align-items-center justify-content-between">
                                        <label className='h6'>{rstate.asset1Name}</label>

                                        <h6  >{amount1Out > 0 ? parseFloat(amount1Out/1000000).toFixed(3) :"0.00"}</h6>
                                    </div>

                                    <div className="balance-card mb-30 d-flex align-items-center justify-content-between">
                                        <label className='h6'>{rstate.asset2Name}</label>

                                        <h6 >{amount2Out > 0 ? parseFloat(amount2Out/1000000).toFixed(3) :"0.00"} 
                                        {/* <small className='d-block text-gray'>~$0.16</small> */}
                                        </h6>
                                    </div>

                                    <Button variant='grad' className='btn-lg w-100' onClick={()=>{percent1()}}>Remove</Button>
                                </Col>
                            </Row>

                        </>
                    ):
                    (
                        <>
                            <div className="modal_header mb-50 d-flex align-items-center">
                                <Button variant='reset' onClick={handleLiquidiy} className='p-0 me-4'>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3.828 7.00017H16V9.00017H3.828L9.192 14.3642L7.778 15.7782L0 8.00017L7.778 0.222168L9.192 1.63617L3.828 7.00017Z" fill="white"/>
                                    </svg>
                                </Button>

                                <h2 className="h3 mb-0" onClick={addli()}>Add Liquidity</h2>     
                            </div>

                            <Row className='justify-content-center'>
                                <Col md={7}>
                                    <div className="mb-2">
                                        <label className='d-flex align-items-center justify-content-between'>From: <small>Balance: {parseFloat(a1balance/1000000).toFixed(3)} {rstate.asset1Name}</small></label>

                                        <div className="balance-card d-flex align-items-center justify-content-between">
                                          {amount1Value ? (<>
                                            <input type='text' className='m-0 form-control p-0 border-0 text-white'  value={amount1Value}  placeholder="0.0" autoComplete='off'/>
                                          </>):(<>
                                            <input type='text' className='m-0 form-control p-0 border-0 text-white'  onChange={e => SetValue1(e.target.value)}  placeholder="0.0" autoComplete='off'/>
                                          </>)}

                                      </div>
                                    </div>

                                    <div className="mb-2 pt-1 text-center">
                                        <Button variant='reset'>
                                            <svg width="62" height="61" viewBox="0 0 62 61" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect x="0.919922" y="60.1743" width="60.0313" height="60.1591" rx="30" transform="rotate(-90 0.919922 60.1743)" fill="white"/>
                                                <path d="M30 29.1584V23.1553H32V29.1584H38V31.1595H32V37.1626H30V31.1595H24V29.1584H30Z" fill="black"/>
                                            </svg>
                                        </Button>
                                    </div>

                                    <div className="mb-20">
                                        <label className='d-flex align-items-center justify-content-between'>T0 <small>Balance: {parseFloat(a2balance/100000).toFixed(4)}  {rstate.asset2Name}</small></label>

                                        <div className="balance-card d-flex align-items-center justify-content-between">
                                          {amount2Value ? (<>
                                            <input type='text' className='m-0 form-control p-0 border-0 text-white'  value={amount2Value}  placeholder="0.0" autoComplete='off'></input>
                                          </>):(<>
                                            <input type='text' className='m-0 form-control p-0 border-0 text-white'  onChange={e => SetValue2(e.target.value)}  placeholder="0.0" autoComplete='off'></input>
                                          </>)}

                                            {/* <FilterDropdown2 /> */}
                                        </div>
                                    </div>

                                    <div className="balance-card py-2 mb-10 d-flex align-items-center justify-content-between">
                                        <label>Creating pool fee</label>

                                        <h6>0.86 ALGO</h6>
                                    </div>

                                    <p className="text-red">
                                        {/* <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi me-2 bi-info-circle" viewBox="0 0 16 16">
                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                        </svg>
                                        unverified assets alert, be careful! */}
                                    </p>

                                    <Button className='btn w-100 mb-20 text-none btn-grad btn-xl' onClick={()=>mint1call(appID_global,samount1,samount2)}>ADD LIQUIDITY</Button>

                                    <p className='d-flex'>
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi me-2 bi-info-circle" viewBox="0 0 16 16">
                                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                            </svg>
                                        </span>
                                        Once you create the pool, other users will be able to add liquidity to it.
                                    </p>

                                </Col>
                            </Row>
                        </>
                        )}




                </Modal.Body>
            </Modal>

        </Layout>
    );
                    }

export default PoolPage;