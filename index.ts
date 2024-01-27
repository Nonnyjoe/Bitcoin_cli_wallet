import * as bitcoin from 'bitcoinjs-lib'
import {ECPairFactory, ECPairInterface} from 'ecpair';
import * as walletTypes from 'bitcoinjs-lib/src/payments/index'
import * as ecc from 'tiny-secp256k1';
import * as fs from 'fs';
import * as crypto from 'crypto';
import { regtest } from 'bitcoinjs-lib/src/networks';


let totalWallets: number;
let allWalets: any;
let allAddresses: any;

const ECPair = ECPairFactory(ecc);
const TESTNET = bitcoin.networks.testnet;
const REGTEST = bitcoin.networks.regtest;
const BITCOIN = bitcoin.networks.bitcoin;


interface History {
    totalWallets: number;
    allWalets: any;
    allAddresses: any;
}

interface walletData {
    keyPair: ECPairInterface;
    walletObject: walletTypes.Payment;
    walletType: string;
}

// Encryption key and algorithm
// NOTE THAT FOR TEST PURPOSE THIS IS CONTAINED HERE BUT FOR PRODUCTION
// IT'LL BE CONTAINED IN A .env FILE.
const encryptionKey = 'MySuperSecretKey';
const algorithm = 'aes-256-cbc';


function createWallet(walletname:string, network:string, walletType:string) {
    let walletHistory = fetchWalletHistory();
    totalWallets = walletHistory.totalWallets;
    allWalets = walletHistory.allWalets;
    allAddresses = walletHistory.allAddresses;
    console.log("creating wallet.....................");

    let keyPair: ECPairInterface = decodeNetwork(network);
    let walletData: walletTypes.Payment = decodeWalletType(walletType, keyPair);
    let address: string | undefined = walletData.address;

    totalWallets += 1;
    allWalets.push(walletname);
    console.log("Initializing address:", address);
    allAddresses.push(address);
    console.log("all addresses", allAddresses);

    const newWallet: walletData = {
        keyPair: keyPair,
        walletObject: walletData,
        walletType: walletType
    }

    const newHistory: History = {
        totalWallets: totalWallets,
        allWalets: allWalets,
        allAddresses: allAddresses
    }

    writeWalletDataToFile(walletname, newWallet);
    writeWalletHistoryToFile(newHistory);
    console.log("wallet created. your wallet address is: " + address);
}

// function transferBitcoin(SpendingWalletName: string, receiverAddress: string, amount: number): boolean {
//     const walletData: walletData = readWalletDataFromFile(SpendingWalletName);
//     const privateKey = walletData.keyPair.toWIF();
//     const walletType = walletData.walletType;
//     const address = decodeWalletType(walletType, walletData.keyPair).address;

//     const txb = new bitcoin.TransactionBuilder(walletData.walletObject.network);
// }


function decodeNetwork(network: string): ECPairInterface {
    let keyPair: ECPairInterface;
    
    switch (network) {
        case 'testnet':
            keyPair = ECPair.makeRandom({ network: TESTNET });
            break;
        case 'bitcoin':
            keyPair = ECPair.makeRandom({ network: BITCOIN });
            break;
        case 'regtest':
            keyPair = ECPair.makeRandom({ network: REGTEST });
            break;
        default:
            throw new Error ('Invalid wallet type');
    }
    
    return keyPair;
}


function decodeWalletType(userInput: string, keyPair: ECPairInterface):walletTypes.Payment {
    let walletData: walletTypes.Payment;
    switch (userInput) {
        case 'embed':  walletData = bitcoin.payments.embed({pubkey: keyPair.publicKey, network: TESTNET,});
            break;
        case 'p2ms':  walletData = bitcoin.payments.p2ms({pubkey: keyPair.publicKey, network: TESTNET,});
            break;
        case 'p2pk':  walletData = bitcoin.payments.p2pk({pubkey: keyPair.publicKey, network: TESTNET,});
            break;
        case 'p2pkh':  walletData = bitcoin.payments.p2pkh({pubkey: keyPair.publicKey, network: TESTNET,});
            break;
        case 'p2sh':  walletData = bitcoin.payments.p2sh({pubkey: keyPair.publicKey, network: TESTNET,});
            break;
        case 'p2wpkh':  walletData = bitcoin.payments.p2wpkh({pubkey: keyPair.publicKey, network: TESTNET,});
            break;
        case 'p2wsh':  walletData = bitcoin.payments.p2wsh({pubkey: keyPair.publicKey, network: TESTNET,});
            break;
        case 'p2tr':  walletData = bitcoin.payments.p2tr({pubkey: keyPair.publicKey, network: TESTNET,});
            break;
        default: throw new Error('Unknown wallet type: ' + userInput);
    }

    return walletData;
}

function listAllAddresses(): [string | undefined] {
    console.log("Accessing all addresses...");
    let history = fetchWalletHistory();
    let allAddresses = history.allAddresses;
    console.log("All available addresses are: " + allAddresses);
    return allAddresses;
}

function writeWalletDataToFile(walletname: string, walletData: walletData ): void {
    let filename: string = `${walletname}.json`;
    let filePath: string = `./wallets/${filename}`;
    const encryptedData = encryptData(JSON.stringify(walletData));
    fs.writeFileSync(filePath, encryptedData);
    console.log("Encrypted walletData stored sucessfully.......");
}


function readWalletDataFromFile(walletname: string): walletData {
    let filePath: string = `./wallets/${walletname}`;
    console.log("accessing wallet data.............")
    try {
        let data = fs.readFileSync(filePath, 'utf8');
        data = decryptData(data);
        console.log("wallet data accessed sucessfully......");
        return JSON.parse(data);
    } catch (e) {
        console.log("error accessing wallet data......");
        throw new Error (e);
    }
}

function fetchWalletHistory(): History {
    console.log("fetching wallet history..............");
    const historyFilePath = './wallets/history.json';

    try {
        if (!fs.existsSync(historyFilePath)) {
            // Create a new empty file if it doesn't exist
            console.log("New wallet history file created.");
            fs.writeFileSync(historyFilePath, '{}');
            const newHistory: History = {
                totalWallets: 0,
                allWalets: [],
                allAddresses: []
            }
            writeWalletHistoryToFile(newHistory);
            return newHistory; // Return an empty object
        }

        let data = fs.readFileSync(historyFilePath, 'utf8');
        data = decryptData(data);
        console.log("wallet history accessed sucessfully......");
        return JSON.parse(data);
    } catch (e) {
        console.log("error accessing wallet history......");
        throw e;
    }
}

function writeWalletHistoryToFile(walletHistory: History): void {
    let filename: string = 'history.json';
    let filePath: string = `./wallets/${filename}`;
    const encryptedData = encryptData(JSON.stringify(walletHistory));
    fs.writeFileSync(filePath, encryptedData);
}


// Function to encrypt data
function encryptData(data: string): string {
    console.log("encrypting data..........");
    const cipher = crypto.createCipher(algorithm, encryptionKey);
    let encryptedData = cipher.update(data, 'utf8', 'hex');
    encryptedData += cipher.final('hex');
    console.log("encryption succesful..........");
    return encryptedData;
}

// Function to decrypt data
function decryptData(encryptedData: string): string {
    console.log("decrypting data..........");
    const decipher = crypto.createDecipher(algorithm, encryptionKey);
    let decryptedData = decipher.update(encryptedData, 'hex', 'utf8');
    decryptedData += decipher.final('utf8');
    console.log("decrypting successful..........");
    return decryptedData;
}



// [TESTS]
// Below line of codes are simply for test purposes.
console.log("running tests...");
createWallet("myWallet", "regtest", "p2pkh");
console.log("================================================================");
createWallet("BobWallet", "regtest", "p2pkh");
console.log("================================================================");
createWallet("ALiceWallet", "regtest", "p2pkh");
console.log("================================================================");
listAllAddresses();

