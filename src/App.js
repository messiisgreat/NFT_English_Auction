/* eslint-disable */
import {useEffect, useState} from 'react';
import './App.css';
import {ethers} from "ethers";
import EnglishAuction from "./artifacts/contracts/EnglishAuction.sol/EnglishAuction.json";
import Countdown from 'react-countdown';


const englishAuctionAddress = "0x98076b6f013d8377386373C193D5f56E26bC7DC4";
const erc721Address = "0x0dda8257e55a008f273711da507e12f4d77164b3";

function App() {
    const [accounts, setAccounts] = useState([]);
    const [highestBid, setHighestBid] = useState("");
    const [account, setAccount] = useState("");
    const [contract, setContract] = useState(null);
    const isConnected = Boolean(accounts[0]);
    const step = 5;
    const timeDuration = 600000; //10 min

    const Completionist = () => <span>Auction ended!</span>;

    const [bid, setBid] = useState(0);
    const [started, setStarted] = useState(false);

    async function connectAccount() {
        if (typeof window.ethereum !== "undefined") {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            setAccounts(accounts);

            initConnection();
        }
    }

    const handlerHighestBid = async (contractEth) => {
        const transaction = await contractEth.highestBid({
            gasLimit: 100000,
        });

        const txToString = ethers.utils.formatUnits(transaction, "wei");
        setHighestBid(Number(txToString));
        setBid(Number(txToString));
        console.log('response: ', transaction);
    }

    const checkHighestBid = async () => {
        try {
            const transaction = await contract.highestBid({
                gasLimit: 100000,
            });

            const txToString = ethers.utils.formatUnits(transaction, "wei");
            setHighestBid(Number(txToString));

        } catch (error) {
            console.log('error: ', error);
        }

    }

    const handleStart = async () => {
        const transaction = await contract.start({
            gasLimit: 100000,
        });
        await transaction.wait()
            .then(() => {

                let startTimer = true;
                localStorage.startTimer = startTimer;

                let startTime = new Date();
                localStorage.startTime = startTime;
            });
        console.log('response: ', transaction);

    }

    const handleEnd = async () => {
        const transaction = await contract.end({
            gasLimit: 100000,
        });
        await transaction.wait();
        console.log('response: ', transaction);
    }

    const handleBid = async () => {
        console.log(' Bid: ', bid);
        const transaction = await contract.bid({
            value: bid + step,
            gasLimit: 100000,
        });
        await transaction.wait();
        console.log('response: ', transaction);
        await handlerHighestBid();
    }

    const handleIncrement = () => {
        console.log('  highestBid: ', highestBid);
        console.log('   Bid: ', bid);
        setBid(bid + step);
    }

    const checkTimer = () => {

        if (localStorage.startTime) {
            let a = Date.parse(localStorage.startTime);
            let b = new Date();
            console.log(b - a);

            if ((b - a) > timeDuration) {
                let startTimer = false;
                localStorage.startTimer = startTimer;
                localStorage.removeItem('startTime');
            } else {
                let startTimer = true;
                localStorage.startTimer = startTimer;
            }
        }
    }


    const initConnection = async () => {
        if (typeof window.ethereum !== "undefined") {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const newSigner = provider.getSigner();
            const contractEth = new ethers.Contract(
                englishAuctionAddress,
                EnglishAuction.abi,
                newSigner
            );
            setAccount(accounts[0]);
            setContract(
                contractEth
            );
            Date.parse(localStorage.startTime)

            handlerHighestBid(contractEth);

            const id = setInterval(() => {
                handlerHighestBid(contractEth);
                checkTimer();

            }, 5000);

            return () => {
                clearInterval(id);
            };

        } else {
            console.log("Please install Metamask!");
        }
    }

    useEffect(() => {

        initConnection();


    }, []);

    return (
        <div className="App">
            <div className="flex flex-row ">
                <div className="flex flex-row w-1/2 mt-10 mr-0">
                    <div className="py-3 p-5">Facebook</div>
                    <div className="py-3 p-5">Twitter</div>
                    <div className="py-3 p-5">Email</div>
                </div>

                <div className=" flex flex-row  mt-10 mr-0">
                    <div className="py-3 p-7">About Auction</div>
                    <div className="py-3 p-7">Bid</div>
                    <div className="py-3 p-7">Team</div>
                    {isConnected &&
                    <div className="bg-slate-900 text-white py-3 p-5 rounded">Connected</div>
                    }
                </div>
            </div>
            {!isConnected &&
            <div className="mt-40">
                <button className=" bg-slate-700	 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={connectAccount}>Connect
                </button>
            </div>
            }

            {isConnected &&
            <>
                <div className="flex flex-row items-center justify-center">
                    <button className="py-3 p-5 underline" onClick={handleStart}>start</button>
                    <button className="py-3 p-5 underline" onClick={handleEnd}>end</button>
                </div>

                {localStorage.startTimer && JSON.parse(localStorage.startTimer) === true &&
                    <Countdown date={Date.parse(localStorage.startTime) + timeDuration}>
                        <Completionist/>
                    </Countdown>
                }

                { localStorage.startTimer && JSON.parse(localStorage.startTimer) === false &&
                    <Completionist/>
                }

                <div className="wrapper flex flex-col ">
                    <div className="bid-wrapper  ">
                        <figure className="elementor-image-box-img">
                            <img width="1024" height="1024"
                                 src="https://toka.b-cdn.net/wp-content/uploads/2022/05/rkgmv.png"
                                 className="attachment-full size-full" alt=""
                                 loading="lazy"/>
                        </figure>
                        <div>Highest bid now: {highestBid ? highestBid : 0} wei</div>


                        <div>Your bid: {bid + step} wei</div>
                        <button className=" bg-slate-100 hover:bg-slate-300 text-black font-bold py-1 px-2 rounded mr-5"
                                onClick={handleIncrement}>+
                        </button>
                        <button className="underline" onClick={handleBid}>bid</button>
                    </div>
                </div>
            </>
            }

        </div>
    );
}

export default App;
