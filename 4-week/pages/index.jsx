import { useState } from 'react'
import { NFTCard } from "../components/NFTCard"


export async function getStaticProps() {
  return { props: { API_KEY: process.env.API_KEY } }
}

const Home = ({ API_KEY }) => {
  const [wallet, setWalletAddress] = useState("");
  const [collection, setCollectionAddress] = useState("");
  const [fetchForCollection, setFetchForCollection] = useState(false)
  const [NFTs, setNFTs] = useState([])

  const fetchNFTs = async () => {
    let nfts;
    console.log("fetching nfts");
    const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${API_KEY}/getNFTs/`;
    const requestOptions = {
      method: 'GET'
    };

    if (!collection.length) {
      console.log("fetching nfts by address")
      const fetchURL = `${baseURL}?owner=${wallet}`;
      nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
    } else {
      console.log("fetching nfts for collection owned by address")
      const fetchURL = `${baseURL}?owner=${wallet}&contractAddresses%5B%5D=${collection}`;
      nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
    }

    if (!nfts) return;

    console.log("nfts:", nfts)
    setNFTs(nfts.ownedNfts)
  }

  const fetchNFTsForCollection = async () => {
    if (collection.length) {
      const requestOptions = {
        method: 'GET'
      };
      const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${API_KEY}/getNFTsForCollection/`;
      const fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=${"true"}`;
      const nfts = await fetch(fetchURL, requestOptions).then(data => data.json())

      if (!nfts) return;

      console.log("NFTs in collection:", nfts)
      setNFTs(nfts.nfts)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-8 gap-y-3">
      <div className="flex flex-col w-full justify-center items-center gap-y-2">
        <input onChange={(e) => { setWalletAddress(e.target.value) }} value={wallet} type={"text"} placeholder="Add your wallet address"></input>
        <input onChange={(e) => { setCollectionAddress(e.target.value) }} value={collection} type={"text"} placeholder="Add the collection address"></input>
        <label className="text-gray-600 "><input onChange={(e) => { setFetchForCollection(e.target.checked) }} type={"checkbox"} className="mr-2"></input>Fetch for collection</label>
        <button className={"disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5"} onClick={
          () => {
            if (fetchForCollection) {
              fetchNFTsForCollection()
            } else {
              fetchNFTs()
            }
          }
        }>{'Let\'s go!'} </button>
      </div>
      <div className='flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center'>
        {
          NFTs.map(nft => {
            return (
              <NFTCard key={nft.title} nft={nft}></NFTCard>
            )
          })
        }
      </div>
    </div>
  )
}

export default Home