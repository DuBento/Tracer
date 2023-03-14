/// <reference types="vite/client" />

interface Window {
  ethereum?: import("ethers").providers.ExternalProvider;
}
