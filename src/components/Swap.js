import React from 'react';
import { Col, Container, Row, Breadcrumb, Dropdown, Button, ButtonGroup, DropdownButton, InputGroup, FormControl, Modal } from 'react-bootstrap';
import Layout from './Layouts/LayoutInner';
// import {Container} from 'react-bootstrap';
import SwapChart from './Snippets/SwapChart';
// import Select from 'react-select';
// import makeAnimated from 'react-select/animated';
import FilterDropdown from './Snippets/FilterDropdown';
import FilterDropdown2 from './Snippets/FilterDropdown2';
// const animatedComponents = makeAnimated();
import { useState } from "react";
import { useEffect } from "react";
import MyAlgoConnect from "@randlabs/myalgo-connect";
import { ToastContainer, Toast, Zoom, Bounce, toast} from 'react-toastify';
import algosdk from "algosdk";
import {amount_out_with_slippage,asset1_price,asset2_price, price,priceOfCoin1,priceOfCoin2} from './formula';
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

function SwapPage() {
    const [input1, setValue] = React.useState('0.0');
    const [input2, setValue1] = React.useState('0.0');
    const [s1, sets1] = useState("");
    const[tk1,sett1] = useState("");
    const[tk2,sett2] = useState("");
    const [s2, sets2] = useState("");
    const[samount1,setsamount1] = useState("");
    const[samount2,setsamount2] = useState("");
    const[swapfees,setswapfees]= useState("");
    const[swapamount,set_inp_goal] = useState("");
    const [appId,setAppId] = useState("");
    const [ilt, setilt] = useState("");
    const[optinbutton,setoptinbutton] = useState("");
    const[swapopt,setoswapopt]= useState(false);
    const[esc,setesc]= useState("");
    const[fee,setfees] = useState("");
    const[swf,setswf] = useState("");
    const[swapdetail,setswapdetail]= useState(false);
    const[pricechange,setpricechange]= useState(false);
    const[AssWithFee,setasswithfee] = useState("");
    const[price1,setprice1]= useState("");
    const[price2,setprice2]= useState("");
    // const[gain,setgain] = useState("");
    const [algoPrice, setAlgoPrice] = useState("");
    const [usdcPrice, setUsdcPrice] = useState("");
    const[pr1,setpr1]= useState("");
    const[pr2,setpr2]= useState("");
    const[pc1 ,setpc1]= useState("");
    const[pc2 ,setpc2]= useState("");
    // const[gain1,setgain1] = useState("");
    useEffect(() =>{ren()},[])
    console.log("gain",tk1)
    console.log("gain1",tk2)
  const ren =()=>{
    if(!fee){
      setfees(0.05);
    }
    if(!AssWithFee){
    }
    if(!localStorage.getItem("assetname1")){
    }
    if(!localStorage.getItem("assetname2")){
    }
    callfirst();
    
  }
  const callfirst =async()=>{
    let pk1 = await priceOfCoin1();
      setAlgoPrice(pk1);
      
    console.log("pk1",pk1);
    let pk2 = await priceOfCoin2();

    setUsdcPrice(pk2);
    console.log("pk2",pk2);
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
  const pricelisting=async(s1,s2)=>{
    let p1 =await asset1_price(s1,s2);
    console.log("p1",p1)
    setprice1(p1);
    let p2 = await asset2_price(s1,s2);
    setprice2(p2);
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
  
    //   async function readLocalState(client, account, index1){
    //       let accountInfoResponse = await client.accountInformation(account).do();
    //       console.log("accinfo",accountInfoResponse);
    //       if(accountInfoResponse['apps-local-state'].length > 0){
    //         for(let i = 0; i< accountInfoResponse['apps-local-state'][0]['key-value'].length;i++){
    //           if(accountInfoResponse['apps-local-state'][0]['key-value'][i]['key'] === "czE="){
    //            sets1(accountInfoResponse['apps-local-state'][0]['key-value'][i]['value']['uint'])
    //            console.log(accountInfoResponse['apps-local-state'][0]['key-value'][i]['value']['uint'])
    //           }
    //           else if(accountInfoResponse['apps-local-state'][0]['key-value'][i]['key'] === "czI="){
    //            sets2(accountInfoResponse['apps-local-state'][0]['key-value'][i]['value']['uint'])
    //            console.log(accountInfoResponse['apps-local-state'][0]['key-value'][i]['value']['uint'])
    //           }
    //           else if(accountInfoResponse['apps-local-state'][0]['key-value'][i]['key'] ===  "aWx0"){
    //            setilt(accountInfoResponse['apps-local-state'][0]['key-value'][i]['value']['uint'])
    //            console.log(accountInfoResponse['apps-local-state'][0]['key-value'][i]['value']['uint'])
    //           }
    //         }
    //       }
         
    //       // for (let i = 0; i < accountInfoResponse['apps-local-state'].length; i++) { 
    //       //   if (accountInfoResponse['apps-local-state'][i].id == index1) {
    //       //       console.log("Application's global state:");
    //       //       for (let n = 0; n < accountInfoResponse['apps-local-state'][i]['key-value'].length; n++) {
    //       //          // console.log(accountInfoResponse['apps-local-state'][i]['key-value']);
    //       //           let enc = accountInfoResponse['apps-local-state'][i]['key-value'][n];
    //       //           if(enc['key'] === "czE="){
    //       //             sets1(enc.value.uint)
    //       //           }
    //       //           if(enc['key'] === "czI="){
    //       //             sets2(enc.value.uint)
    //       //           }
    //       //           if(enc['key'] === "aWx0"){
    //       //             setilt(enc.value.uint)
    //       //           }             
    //       //       }
                
    //   //        }
    //   //   }
    //   }
    const swap = async (appid,asset_in_amount) => {
        let tokenid1 = localStorage.getItem("tokenid1");
        let tokenid2 = localStorage.getItem("tokenid2");
        let index = parseInt(appid);
        console.log("appId inside donate", index);
  
        setAppId(appid);
        let tt1;
        let tt2;
          if(tokenid1 > tokenid2){
              tt1 =tokenid1;
              tt2 = tokenid2;
          }
          else{
              tt1 =tokenid2;
              tt2 = tokenid1;
          }
        console.log("data",esc.hash)
        console.log("data1",esc.result)
        
     
  
        
        let escrowaddress = esc.hash
        console.log("escrow",escrowaddress)
        let accountInfoResponse = await algodClient.accountInformation(escrowaddress).do();
        console.log("account",accountInfoResponse);
        let assetId3 = accountInfoResponse['created-assets'][0]['index'];
        console.log('Asset 3 ID: ', assetId3);
      
      
    
        let program = new Uint8Array(Buffer.from(esc.result, "base64"));
    
        let lsig = algosdk.makeLogicSig(program);
        console.log("Escrow =", lsig.address()); 
  
        // readLocalState(algodClient,escrowaddress,appId);
        
       console.log(s1)
       let r1,r2;
       let t1 ,t2;
          if(tokenid1 > tokenid2){
              r1 = s1;
              r2 = s2;
              t1 = tokenid1;
              t2 = tokenid2;
          }
          else{
              r1 = s2;
              r2 = s1;
              t1 = tokenid1;
              t2 = tokenid2;
          }    
        let k = r1 * r2 ;
        let asset_in_amount_minus_fee = (asset_in_amount * 997) / 1000
            
        let swap_fees = asset_in_amount - asset_in_amount_minus_fee
            
        let l = asset_in_amount_minus_fee - swap_fees;
        let asset_out_amount_withoutfees = r2 - (k / (r1 + l ))  
        let asset_out_amount = amount_out_with_slippage(asset_out_amount_withoutfees,fee); 
        
        try {
  
          const params = await algodClient.getTransactionParams().do();
          let optinTranscation = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
            from:localStorage.getItem("walletAddress"),
            to :localStorage.getItem("walletAddress"),
            assetIndex: parseInt(57692249) ,
            amount: 0,
            suggestedParams:params
          });
      
          
            
          const signedTx11 = await myAlgoWallet.signTransaction(optinTranscation.toByte());
          toast.warn("Transaction in Progress");
      
        const response1 = await algodClient.sendRawTransaction(signedTx11.blob).do();
        console.log("TxID", JSON.stringify(response1, null, 1));
        await waitForConfirmation(algodClient, response1.txId);
        toast.warn("Optin Completed");
          
          let sender = localStorage.getItem("walletAddress");
          let recv_escrow = lsig.address();
          let amount = 2000;
          
          let transaction1 = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            from: sender, 
            to: recv_escrow, 
            amount: amount,  
             suggestedParams: params
           });
         
           let appArg = [];
           appArg.push(new Uint8Array(Buffer.from("swap")));
           appArg.push(new Uint8Array(Buffer.from("fi")));
  
           let foreignassets = [];
  
           if(parseInt(t1)==0){
            // foreignassets.push(parseInt(tokenid1));
            foreignassets.push(parseInt(t2));
            foreignassets.push(parseInt(assetId3));
           }
           else if(parseInt(t2)==0){
            foreignassets.push(parseInt(t1));
            // foreignassets.push(parseInt(tokenid2));
            foreignassets.push(parseInt(assetId3));
           }
           else{
            foreignassets.push(parseInt(t1));
            foreignassets.push(parseInt(t2));
            foreignassets.push(parseInt(assetId3));
           }
           
           
           const transaction2 = algosdk.makeApplicationNoOpTxnFromObject({
               from: recv_escrow, 
               appIndex: index,
               appArgs: appArg,
               appAccounts:sender,
               accounts: [sender],
               foreignAssets:foreignassets,
               suggestedParams: params
             });
             let transaction3;
             let transaction4;
             if(parseInt(t1)==0){
              transaction3 = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
                from: sender,
                to: recv_escrow,
                note: undefined,
                accounts:sender,
                amount: parseInt(asset_in_amount), 
                suggestedParams: params
              });
             }
             else{
               console.log("asset1",t1);
              transaction3 = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                from: sender,
                to: recv_escrow,
                assetIndex: parseInt(t1),
                note: undefined,
                accounts:sender,
                amount: parseInt(asset_in_amount), 
                suggestedParams: params
              });
             }
            
            if(parseInt(t2)==0){
             transaction4 = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
                from: recv_escrow ,
                to: sender,               
                note: undefined,
                accounts: recv_escrow,
                amount: parseInt(parseInt(asset_out_amount).toFixed(0)),
                suggestedParams: params
              });
            }
            else{
              transaction4 = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                from: recv_escrow ,
                to: sender,
                assetIndex:parseInt(t2), 
                note: undefined,
                accounts: recv_escrow,
                amount: parseInt(parseInt(asset_out_amount).toFixed(0)),
                suggestedParams: params
              });
            }
   let newescrow = `#pragma version 5
  
   txn TypeEnum
   int axfer
   ==
   bnz success
   global GroupSize
   int 5
   ==
   gtxn 4 TypeEnum
   int axfer
   ==
   &&
   gtxn 1 ApplicationID
   int 57691024
   ==
   &&
   gtxn 2 AssetSender
   gtxn 4 AssetReceiver
   ==
   &&
   int 0
   gtxn 2 AssetAmount
   int 997
   *
   int 1000
   /
   store 1
   int 0
   gtxn 2 AssetAmount
   load 1
   -
   store 2
   int 0
   gtxn 4 AssetAmount
   load 2
   ==
   gtxn 4 XferAsset
   int 57692249
   ==
   &&
   bnz success
   bz failed
   
   failed:
   int 0
   return
   
   success:
   int 1
   return`;
   let results1 = await algodClient.compile(newescrow).do(); 
   console.log("escrownew",results1.hash)  
   let program1 = new Uint8Array(Buffer.from(results1.result, "base64"));
    
        let lsig1 = algosdk.makeLogicSig(program1);
           let transaction5 = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
              from: results1.hash ,
              to: sender,
              assetIndex:parseInt(57692249), 
              note: undefined,
              accounts: recv_escrow,
              amount: parseInt(parseInt(swap_fees).toFixed(0)),
              suggestedParams: params
            });
            
            
          const groupID = algosdk.computeGroupID([ transaction1, transaction2, transaction3, transaction4,transaction5]);
          const txs = [ transaction1, transaction2, transaction3, transaction4, transaction5];
          for (let i = 0; i <= 4; i++) txs[i].group = groupID;
        
          const signedTx2 = algosdk.signLogicSigTransaction(txs[1], lsig);
          const signedTx4 = algosdk.signLogicSigTransaction(txs[3], lsig);
          const signedTx5 = algosdk.signLogicSigTransaction(txs[4], lsig1);
          const signedTxnarray = await myAlgoWallet.signTransaction([txs[0].toByte(),txs[2].toByte()]);
          toast.warn("Swapping in Progress");
      const response = await algodClient.sendRawTransaction([signedTxnarray[0].blob, signedTx2.blob, signedTxnarray[1].blob, signedTx4.blob, signedTx5.blob]).do();
      console.log("TxID", JSON.stringify(response, null, 1));
    //   setTxId(response.txId);
    //   setShow(true);
      await waitForConfirmation(algodClient, response.txId);
      toast.success(`Swapping Completed Successfully ${response.txId}`);
        } catch (err) {
          toast.error(`Transaction Failed due to ${err}`);
          console.error(err);
        }
      };
  
      function setvalueA1(asset_in_amount){
          callp1();
          setpc1(pr1 * (asset_in_amount/1000000));
          let r1,r2;
          let tokenid1 = localStorage.getItem("tokenid1");
          let tokenid2 = localStorage.getItem("tokenid2");
          if(tokenid1 > tokenid2){
              r1 = s1;
              r2 = s2;
          }
          else{
              r1 = s2;
              r2 = s1;
          }
          pricelisting(s1,s2);
          setswf((asset_in_amount)/1000000 * 0.003);
          set_inp_goal(asset_in_amount);
          let k = r1 * r2 ;
          console.log('s1', s1);
          console.log('s2', s2);
          let asset_in_amount_minus_fee = (asset_in_amount * 997) / 1000;
          console.log('asset_in_amount', asset_in_amount);
              
          let swap_fees = asset_in_amount - asset_in_amount_minus_fee;
          console.log('swap_fees', swap_fees);
          setswapfees(swap_fees)
              
          let l = asset_in_amount_minus_fee - swap_fees;
          console.log('l', l);
  
          let asset_out_amount = r2 - (k / (r1 + l ))   ;
          let asswithfee = amount_out_with_slippage(asset_out_amount,fee);
          console.log("asswithfee",asswithfee);
          setasswithfee(asswithfee)
          setsamount1(asset_in_amount);
          setsamount2(asset_out_amount);
          setswapdetail(true);
      
      }
  
      function setvalueA2(asset_out){
        callp2();
        setpc2(pr2 * (asset_out/1000000));
        //   first();
        let tokenid1 = localStorage.getItem("tokenid1");
        let tokenid2 = localStorage.getItem("tokenid2");
          let r1,r2;
          if(tokenid1 > tokenid2){
              r1 = s1;
              r2 = s2;
          }
          else{
              r1 = s2;
              r2 = s1;
          }
          pricelisting(s1,s2);
          let k = r1 * r2 ;
          console.log('s1', s1);
          console.log('s2', s2);
          let asset_in_amount_minus_fee = (asset_out * 997) / 1000;
          console.log('asset_in_amount', asset_out);
              
          let swap_fees = asset_out - asset_in_amount_minus_fee;
          console.log('swap_fees', swap_fees);
          setswapfees(swap_fees)
              
          let l = asset_in_amount_minus_fee - swap_fees;
          console.log('l', l);
  
          let asset_out_amount = r2 - (k / (r1 + l ));
          let asswithfee = amount_out_with_slippage(asset_out_amount,fee);
          setasswithfee(asswithfee)
          setswf((asset_out_amount)/1000000 * 0.003);
          console.log("s",asset_out_amount);
          set_inp_goal(asset_out_amount);
          setsamount2(asset_out);
          setsamount1(asset_out_amount);
          setswapdetail(true);
      
    
    }
     
      const optinassert =async () => {

        const algodClient = new algosdk.Algodv2('', 'https://api.testnet.algoexplorer.io', '');
        const params = await algodClient.getTransactionParams().do();
  try {
    

    let optinTranscation = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from:localStorage.getItem("walletAddress"),
      to :localStorage.getItem("walletAddress"),
      assetIndex: parseInt(localStorage.getItem("tokenid2")) ,
      amount: 0,
      suggestedParams:params
    });

    
      
      const signedTx1 = await myAlgoWallet.signTransaction(optinTranscation.toByte());
      toast.warn("Transaction in Progress");

  const response = await algodClient.sendRawTransaction(signedTx1.blob).do();
  console.log("TxID", JSON.stringify(response, null, 1));
  await waitForConfirmation(algodClient, response.txId);
  toast.success(`Transaction Success ${response.txId}`);
  setoswapopt(false);
    } catch (err) {
      toast.error(`Transaction Failed due to ${err}`);
      console.error(err);
    }

     
  }

  const feesAmount =(f) =>{
    setfees(f);
    handleCloseModal();
  }
  const setpChange =() =>{
    if(pricechange){
      setpricechange(false)
    }
    else{
      setpricechange(true)
    }
    
  }

  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);


    return (
        <Layout>
            <div className="page-content">
            <Modal centered size="lg" show={showModal} onHide={handleCloseModal}>
              <Modal.Body>
                <Button className='modal-close' onClick={handleCloseModal} variant='reset'>
                  <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g opacity="0.3">
                      <path d="M17.5004 32.0832C9.44597 32.0832 2.91699 25.5542 2.91699 17.4998C2.91699 9.44546 9.44597 2.9165 17.5004 2.9165C25.5548 2.9165 32.0837 9.44546 32.0837 17.4998C32.0837 25.5542 25.5548 32.0832 17.5004 32.0832ZM17.5004 29.1665C20.5946 29.1665 23.562 27.9373 25.75 25.7494C27.9379 23.5615 29.1671 20.594 29.1671 17.4998C29.1671 14.4056 27.9379 11.4382 25.75 9.25026C23.562 7.06233 20.5946 5.83317 17.5004 5.83317C14.4062 5.83317 11.4387 7.06233 9.25076 9.25026C7.06283 11.4382 5.83367 14.4056 5.83367 17.4998C5.83367 20.594 7.06283 23.5615 9.25076 25.7494C11.4387 27.9373 14.4062 29.1665 17.5004 29.1665ZM17.5004 15.4378L21.6245 11.3121L23.6881 13.3757L19.5625 17.4998L23.6881 21.624L21.6245 23.6875L17.5004 19.5619L13.3762 23.6875L11.3126 21.624L15.4383 17.4998L11.3126 13.3757L13.3762 11.3121L17.5004 15.4378Z" fill="white"/>
                      </g>
                  </svg>
                </Button>

                <h2 className="h3 mb-0">Slippage tolerance</h2>  

                <div className="pt-md-5 pt-3">
                  <Row className='mb-30'>
                    <Col sm={4} md={3} className='mb-2'>
                        <input type="radio" hidden id='radio1' name="amount" />
                        <label htmlFor="radio1"  variant="grad" className='btn btn-default px-2 w-100' onClick={()=>feesAmount(0.05)} >0.05%</label>
                        {/* <Button className='mt-4 btn btn-xl w-100 btn-grad' onClick={()=>feesAmount(0.05)}>0.05%</Button> */}
                    </Col>
                    <Col sm={4} md={3} className='mb-2'>
                        <input type="radio" hidden id='radio2' name="amount" />
                        <label htmlFor="radio1"  variant="grad" className='btn btn-default px-2 w-100' onClick={()=>feesAmount(0.01)} >0.01%</label>

                        {/* <Button className='mt-4 btn btn-xl w-100 btn-grad' onClick={()=>feesAmount(0.01)}>0.01%</Button> */}
                    </Col>
                    <Col sm={4} md={3} className='mb-2'>
                    <label htmlFor="radio1"  variant="grad" className='btn btn-default px-2 w-100' onClick={()=>feesAmount(0.5)} >0.5%</label>

                        <input type="radio" hidden id='radio3' name="amount" />
                        {/* <Button className='mt-4 btn btn-xl w-100 btn-grad' onClick={()=>feesAmount(0.5)}>0.5%</Button> */}
                    </Col>
                    {/* <Col sm={12} md={3} className='mb-md-2'>
                      <InputGroup className='mb-2 py-2 input-reload'>
                        <FormControl
                          className='m-0 form-control py-0 pe-1 ps-2  border-0 text-white'
                          aria-label="Recipient's username"
                          aria-describedby="basic-addon2"
                        />
                        <InputGroup.Text id="basic-addon2" style={{opacity: '0.5'}} className='px-1'>0.50%</InputGroup.Text>
                      </InputGroup>
                    </Col> */}
                  </Row>
                </div>
              </Modal.Body>
              
            </Modal>
                <Container>
                <ToastContainer position='top-center' draggable = {false} transition={Zoom} autoClose={8000} closeOnClick = {false}/>
                    <Row>
                        <Col lg={6} className='mb-lg-0 mb-4 order-lg-2'>
                            <div className="card-base card-shadow card-dark" style={{minHeight: '640px'}}>
                                <h6 className='text-uppercase mb-4'>swap</h6>

                                <div className="d-flex mb-1 justify-content-end">
                                    <Button variant='reset' onClick={handleShowModal}>
                                      <svg width="24" height="29" viewBox="0 0 24 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6.17 21.4721C6.3766 20.8052 6.75974 20.2278 7.2666 19.8193C7.77346 19.4109 8.37909 19.1915 9 19.1915C9.62091 19.1915 10.2265 19.4109 10.7334 19.8193C11.2403 20.2278 11.6234 20.8052 11.83 21.4721H22V23.7499H11.83C11.6234 24.4167 11.2403 24.9942 10.7334 25.4027C10.2265 25.8111 9.62091 26.0305 9 26.0305C8.37909 26.0305 7.77346 25.8111 7.2666 25.4027C6.75974 24.9942 6.3766 24.4167 6.17 23.7499H2V21.4721H6.17ZM12.17 13.4999C12.3766 12.833 12.7597 12.2556 13.2666 11.8471C13.7735 11.4386 14.3791 11.2193 15 11.2193C15.6209 11.2193 16.2265 11.4386 16.7334 11.8471C17.2403 12.2556 17.6234 12.833 17.83 13.4999H22V15.7777H17.83C17.6234 16.4445 17.2403 17.022 16.7334 17.4304C16.2265 17.8389 15.6209 18.0582 15 18.0582C14.3791 18.0582 13.7735 17.8389 13.2666 17.4304C12.7597 17.022 12.3766 16.4445 12.17 15.7777H2V13.4999H12.17ZM6.17 5.52764C6.3766 4.86078 6.75974 4.28333 7.2666 3.87487C7.77346 3.46642 8.37909 3.24707 9 3.24707C9.62091 3.24707 10.2265 3.46642 10.7334 3.87487C11.2403 4.28333 11.6234 4.86078 11.83 5.52764H22V7.80542H11.83C11.6234 8.47228 11.2403 9.04973 10.7334 9.45819C10.2265 9.86665 9.62091 10.086 9 10.086C8.37909 10.086 7.77346 9.86665 7.2666 9.45819C6.75974 9.04973 6.3766 8.47228 6.17 7.80542H2V5.52764H6.17ZM9 7.80542C9.26522 7.80542 9.51957 7.68543 9.70711 7.47185C9.89464 7.25827 10 6.96858 10 6.66653C10 6.36448 9.89464 6.0748 9.70711 5.86121C9.51957 5.64763 9.26522 5.52764 9 5.52764C8.73478 5.52764 8.48043 5.64763 8.29289 5.86121C8.10536 6.0748 8 6.36448 8 6.66653C8 6.96858 8.10536 7.25827 8.29289 7.47185C8.48043 7.68543 8.73478 7.80542 9 7.80542ZM15 15.7777C15.2652 15.7777 15.5196 15.6577 15.7071 15.4441C15.8946 15.2305 16 14.9408 16 14.6388C16 14.3367 15.8946 14.047 15.7071 13.8334C15.5196 13.6199 15.2652 13.4999 15 13.4999C14.7348 13.4999 14.4804 13.6199 14.2929 13.8334C14.1054 14.047 14 14.3367 14 14.6388C14 14.9408 14.1054 15.2305 14.2929 15.4441C14.4804 15.6577 14.7348 15.7777 15 15.7777ZM9 23.7499C9.26522 23.7499 9.51957 23.6299 9.70711 23.4163C9.89464 23.2027 10 22.913 10 22.611C10 22.3089 9.89464 22.0193 9.70711 21.8057C9.51957 21.5921 9.26522 21.4721 9 21.4721C8.73478 21.4721 8.48043 21.5921 8.29289 21.8057C8.10536 22.0193 8 22.3089 8 22.611C8 22.913 8.10536 23.2027 8.29289 23.4163C8.48043 23.6299 8.73478 23.7499 9 23.7499Z" fill="white"/>
                                    </svg>
                                    </Button>
                                    <DropdownButton
                                        as={ButtonGroup}
                                        drop={'start'}
                                        variant="secondary"
                                        className='dropdown-reset d-none'
                                        title={<svg width="24" height="29" viewBox="0 0 24 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M6.17 21.4721C6.3766 20.8052 6.75974 20.2278 7.2666 19.8193C7.77346 19.4109 8.37909 19.1915 9 19.1915C9.62091 19.1915 10.2265 19.4109 10.7334 19.8193C11.2403 20.2278 11.6234 20.8052 11.83 21.4721H22V23.7499H11.83C11.6234 24.4167 11.2403 24.9942 10.7334 25.4027C10.2265 25.8111 9.62091 26.0305 9 26.0305C8.37909 26.0305 7.77346 25.8111 7.2666 25.4027C6.75974 24.9942 6.3766 24.4167 6.17 23.7499H2V21.4721H6.17ZM12.17 13.4999C12.3766 12.833 12.7597 12.2556 13.2666 11.8471C13.7735 11.4386 14.3791 11.2193 15 11.2193C15.6209 11.2193 16.2265 11.4386 16.7334 11.8471C17.2403 12.2556 17.6234 12.833 17.83 13.4999H22V15.7777H17.83C17.6234 16.4445 17.2403 17.022 16.7334 17.4304C16.2265 17.8389 15.6209 18.0582 15 18.0582C14.3791 18.0582 13.7735 17.8389 13.2666 17.4304C12.7597 17.022 12.3766 16.4445 12.17 15.7777H2V13.4999H12.17ZM6.17 5.52764C6.3766 4.86078 6.75974 4.28333 7.2666 3.87487C7.77346 3.46642 8.37909 3.24707 9 3.24707C9.62091 3.24707 10.2265 3.46642 10.7334 3.87487C11.2403 4.28333 11.6234 4.86078 11.83 5.52764H22V7.80542H11.83C11.6234 8.47228 11.2403 9.04973 10.7334 9.45819C10.2265 9.86665 9.62091 10.086 9 10.086C8.37909 10.086 7.77346 9.86665 7.2666 9.45819C6.75974 9.04973 6.3766 8.47228 6.17 7.80542H2V5.52764H6.17ZM9 7.80542C9.26522 7.80542 9.51957 7.68543 9.70711 7.47185C9.89464 7.25827 10 6.96858 10 6.66653C10 6.36448 9.89464 6.0748 9.70711 5.86121C9.51957 5.64763 9.26522 5.52764 9 5.52764C8.73478 5.52764 8.48043 5.64763 8.29289 5.86121C8.10536 6.0748 8 6.36448 8 6.66653C8 6.96858 8.10536 7.25827 8.29289 7.47185C8.48043 7.68543 8.73478 7.80542 9 7.80542ZM15 15.7777C15.2652 15.7777 15.5196 15.6577 15.7071 15.4441C15.8946 15.2305 16 14.9408 16 14.6388C16 14.3367 15.8946 14.047 15.7071 13.8334C15.5196 13.6199 15.2652 13.4999 15 13.4999C14.7348 13.4999 14.4804 13.6199 14.2929 13.8334C14.1054 14.047 14 14.3367 14 14.6388C14 14.9408 14.1054 15.2305 14.2929 15.4441C14.4804 15.6577 14.7348 15.7777 15 15.7777ZM9 23.7499C9.26522 23.7499 9.51957 23.6299 9.70711 23.4163C9.89464 23.2027 10 22.913 10 22.611C10 22.3089 9.89464 22.0193 9.70711 21.8057C9.51957 21.5921 9.26522 21.4721 9 21.4721C8.73478 21.4721 8.48043 21.5921 8.29289 21.8057C8.10536 22.0193 8 22.3089 8 22.611C8 22.913 8.10536 23.2027 8.29289 23.4163C8.48043 23.6299 8.73478 23.7499 9 23.7499Z" fill="white"/>
                                            </svg>}
                                    >
                                        <Dropdown.Item eventKey="1">Action</Dropdown.Item>
                                        <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
                                        <Dropdown.Item eventKey="3">Something else here</Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
                                    </DropdownButton>
                                </div>

                                <div className="mb-2">
                                    <label className='d-flex align-items-center justify-content-between'>From:
                                    {(tk1 == "Algo")||(tk1 == "USDC") ? (<><small>price:${pc1>0 ? parseFloat(pc1).toFixed(4) : pr1} {tk1}</small></>):(<></>) }
                                            
                                     </label>

                                    <div className="balance-card d-flex align-items-center justify-content-between">
                                        {/* <input type="text" onChange={(e) => setValue(e.target.value)} placeholder='Enter Token' className='form-control' value={value} />
                                 <div className="card-base card-dark card-token mb-30">      
                            <input  type="text" onChange={(e) => setValue(e.target.value)} placeholder='Enter Token' className='form-control' value={value} />
                        </div> */}
                                        <input type='text' id="sf" className='m-0 form-control p-0 border-0 text-white' placeholder='0.0'  autoComplete='off' value={((parseInt(samount1)/1000000 == NaN)||(samount1 == 0)) ? '' : parseInt(samount1)/1000000 } onChange={event => setvalueA1((event.target.value)* 1000000)} />

                                        <FilterDropdown setk = {(t1)=>sett1(t1)} ></FilterDropdown>
                                    </div>
                                </div>

                                <div className="mb-2 pt-1 text-center">
                                    <Button variant='reset'>
                                        <svg width="62" height="61" viewBox="0 0 62 61" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect x="0.919922" y="60.0796" width="60" height="60.1591" rx="30" transform="rotate(-90 0.919922 60.0796)" fill="white"/>
                                            <path d="M31.0488 26.0296L35.9988 21.0796L40.9488 26.0296L39.5348 27.4436L36.9978 24.9076L36.9988 38.0796H34.9988V24.9076L32.4628 27.4436L31.0488 26.0296ZM21.0488 34.1296L22.4628 32.7156L24.9988 35.2516V22.0796H26.9988V35.2516L29.5348 32.7156L30.9488 34.1296L25.9988 39.0796L21.0488 34.1296Z" fill="black"/>
                                        </svg>
                                    </Button>
                                </div>

                                <div className="mb-2">
                                    <label className='d-flex align-items-center justify-content-between'>To(.est) 
                                    {(tk2 == "Algo")||(tk2 == "USDC") ? (<><small >price:${pc2>0 ? parseFloat(pc2).toFixed(4) : pr2}  {tk2}</small></>):(<></>) }

                                    </label>

                                    <div className="balance-card d-flex align-items-center justify-content-between">
                                    <input type='text' className='m-0 form-control p-0 border-0 text-white' placeholder="0.0" autoComplete='off' value={((parseInt(samount2)/1000000 == NaN)||(samount2 == 0))  ? '' :(parseInt(samount2)/1000000)} onChange={event => setvalueA2((event.target.value)* 1000000)} />

                                        <FilterDropdown2 setMax ={(value)=>sets1(value)} setMax1 ={(value)=>sets2(value)} setMax2 ={(value)=>setoswapopt(value)} setMax3 ={(value)=>setesc(value)} setk1 ={(k1)=>sett2(k1)}/>
                                    </div>
                                </div>
                                {swapdetail ? (<>
                                  <InputGroup className='mb-2 input-reload'>
                                  <FormControl
                                    className='m-0 form-control py-0 pe-0 ps-2  border-0 text-white' placeholder="Price"
                                    placeholder="Price"
                                    aria-label="Recipient's username"
                                    aria-describedby="basic-addon2"
                                  />
                                  
                                    <InputGroup.Text id="basic-addon2" className='px-1'>{ price1 > 0 ? parseFloat(price1).toFixed(4) : "0"} {tk1} per {tk2}</InputGroup.Text>
                                  
                                    
                                  {/* <Button variant="reset" id="button-addon2" >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-arrow-repeat" viewBox="0 0 16 16">
                                      <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
                                      <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>
                                    </svg>
                                  </Button> */}
                                </InputGroup>

                                <div className="card card-stack mb-2">
                                  <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                      <span>Minimum received</span>
                                      <strong>{parseFloat(AssWithFee/1000000).toFixed(4)} USDC</strong>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                      <span>Slippage Tolerance</span>
                                      <strong>{fee}%</strong>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                      <span>Swap Free</span>
                                      <strong >{swf > 0 ? parseFloat(swf).toFixed(3) : "0" } ALGO</strong>
                                    </div>                        
                                  </div>
                                </div> 
                                </>):(<>
                                </>)}
                               

                                {swapopt ? (<>
                                    <Button className='mt-4 btn btn-xl w-100 btn-grad' onClick={()=>optinassert()}>Optin Assert</Button>
                                </>):(<>
                                    <Button className='mt-4 btn btn-xl w-100 btn-grad' onClick={()=>swap(appID_global,swapamount)}>Swap</Button>
                                </>)}
                                
                               
                            </div>
                        </Col>
                        <Col lg={6}>
                            <div className="card-base card-chart" style={{minHeight: '640px'}}>
                                <Breadcrumb className='mb-50'>
                                    <Breadcrumb.Item>
                                        <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect width="30.1212" height="30" rx="15" fill="#FA84B5"/>
                                            <path d="M21.943 11.2538C21.4418 12.1245 20.965 12.8983 20.5494 13.6964C20.4394 13.914 20.3905 14.2284 20.4516 14.4582C21.1117 16.9612 21.7963 19.4642 22.4686 21.9671C22.5053 22.1122 22.542 22.2694 22.5909 22.4871C21.8452 22.4871 21.1728 22.5113 20.4883 22.4629C20.366 22.4508 20.1826 22.2211 20.146 22.0518C19.6937 20.4678 19.278 18.8837 18.8379 17.2997C18.8013 17.1788 18.7646 17.0579 18.7035 16.8644C18.5446 17.1304 18.4223 17.3239 18.3001 17.5295C17.4077 19.0651 16.5031 20.5887 15.6107 22.1364C15.464 22.3904 15.3051 22.4992 14.9994 22.4871C14.2904 22.4629 13.5814 22.475 12.7746 22.475C12.8968 22.2453 12.9824 22.076 13.0802 21.9067C14.596 19.307 16.0997 16.7193 17.6277 14.1317C17.7989 13.8415 17.8478 13.5997 17.75 13.2732C17.5055 12.463 17.2977 11.6287 17.0409 10.6976C16.9065 10.9274 16.8087 11.0725 16.7231 11.2176C14.6083 14.833 12.5056 18.4364 10.403 22.0639C10.2197 22.3904 10.0118 22.5113 9.63289 22.4992C8.96054 22.4629 8.27597 22.4871 7.53027 22.4871C7.64029 22.2694 7.72587 22.1122 7.81144 21.9671C10.5375 17.2997 13.2636 12.6444 15.9652 7.97698C16.173 7.61423 16.393 7.46913 16.8087 7.50541C17.2488 7.54168 17.6888 7.52959 18.1289 7.50541C18.4345 7.49331 18.5812 7.57796 18.6668 7.90443C18.9113 8.88387 19.2047 9.8633 19.4614 10.8427C19.5347 11.145 19.6692 11.2659 19.9871 11.2538C20.5983 11.2297 21.2217 11.2538 21.943 11.2538Z" fill="black"/>
                                        </svg>

                                        {tk1}
                                     </Breadcrumb.Item>
                                    <Breadcrumb.Item>
                                        <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect width="30.1213" height="30" rx="15" fill="#FACB84"/>
                                            <path d="M14.7348 23.25C13.673 23.25 13.673 23.25 13.673 22.2035C13.673 21.2267 13.6376 21.4012 12.8589 21.2267C12.2218 21.0872 11.5493 20.8779 10.9476 20.6337C10.5228 20.4593 10.4874 20.2849 10.5936 19.8663C10.6998 19.4477 10.8414 18.9942 10.983 18.5756C11.0538 18.157 11.1953 18.0872 11.5493 18.2965C12.2926 18.6802 13.0713 18.8895 13.9207 18.9942C14.4163 19.064 14.9118 18.9942 15.4073 18.7849C16.3276 18.4012 16.4691 17.3547 15.6905 16.7616C15.3365 16.4826 14.9118 16.3081 14.487 16.0988C13.8145 15.7849 13.142 15.5407 12.5049 15.1919C11.6555 14.7384 10.983 14.0756 10.6998 13.1337C10.2751 11.564 10.983 9.9593 12.4695 9.19186C12.7173 9.05233 13.0005 8.94767 13.2836 8.84302C13.8145 8.63372 13.8145 8.63372 13.8145 8.07558C13.8145 7.76163 13.8145 7.48256 13.8499 7.1686C13.8145 6.88953 13.9915 6.75 14.2393 6.75C14.6286 6.75 15.018 6.75 15.4073 6.75C15.6905 6.75 15.8674 6.92442 15.8674 7.20349C15.8674 7.44767 15.8674 7.69186 15.9028 7.93605C15.9382 8.42442 15.9736 8.4593 16.4691 8.59884C17.0355 8.73837 17.6018 8.87791 18.1327 9.05233C18.6282 9.22674 18.6636 9.40116 18.522 9.85465C18.4159 10.2384 18.3097 10.6221 18.1681 11.0058C18.0265 11.4942 17.8849 11.5291 17.4248 11.3198C16.5753 10.936 15.6905 10.7616 14.7348 10.8663C14.5224 10.9012 14.2747 10.936 14.0623 11.0407C13.3544 11.3895 13.2482 12.157 13.8499 12.6453C14.2039 12.9244 14.5932 13.0988 15.018 13.3081C15.7259 13.657 16.4691 13.9012 17.1416 14.2849C18.876 15.2616 19.5839 17.2849 18.7344 18.9942C18.2389 20.0058 17.4248 20.6337 16.363 20.9826C15.7613 21.157 15.7259 21.2267 15.7259 21.8547C15.7259 22.1337 15.7259 22.3779 15.7259 22.657C15.7259 23.0756 15.5843 23.2151 15.1241 23.25C15.0534 23.25 14.8764 23.25 14.7348 23.25Z" fill="black"/>
                                        </svg>

                                        {tk2}
                                    </Breadcrumb.Item>
                                </Breadcrumb>

                                <div className="d-flex mb-4 justify-content-between align-items-center">
                                    <div className="h3 mb-0">180.79</div>

                                    <ul className="chart-filter mb-0 d-flex align-items-center list-unstyled">
                                        <li>5m</li>
                                        <li>15m</li>
                                        <li className='active'>1H</li>
                                        <li>4h</li>
                                        <li>1d</li>
                                    </ul>
                                </div>

                                <SwapChart />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </Layout>
    );
}

export default SwapPage;