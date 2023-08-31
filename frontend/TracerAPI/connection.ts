import { ethers } from "ethers";

export const connectEthereum = async (): Promise<ethers.Provider> => {
  // if server side, connects to node
  if (typeof window === "undefined") return connectNode();
  // if client side, connects to wallet
  return connectWallet();
};

export const connectSigner = async (): Promise<ethers.Signer> => {
  // Connect to the MetaMask EIP-1193 object. This is a standard
  // protocol that allows Ethers access to make all read-only
  // requests through MetaMask
  const provider = await connectWallet();

  // It also provides an opportunity to request access to write
  // operations, which will be performed by the private key
  // that MetaMask manages for the user.
  const signer = await provider.getSigner();
  return signer;
};

const connectNode = async (): Promise<ethers.Provider> => {
  return new ethers.JsonRpcProvider(process.env.ETHEREUM_NODE_URL);
};

const connectWallet = async (): Promise<ethers.BrowserProvider> => {
  if (window.ethereum == null) throw new Error("No web3 wallet connected.");
  // Connect to the MetaMask EIP-1193 object. This is a standard
  // protocol that allows Ethers access to make all read-only
  // requests through MetaMask
  return new ethers.BrowserProvider(window.ethereum);
};
