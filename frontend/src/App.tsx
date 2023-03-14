import { connectWallet } from "./services/BlockchainServices";

const App = () => {
  connectWallet();
  return <button className="center">Hello world!</button>;
};

export default App;
