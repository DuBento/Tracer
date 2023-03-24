import { connect } from "../services/BlockchainServices";

export default function Home() {
  connect();

  return <>Hello World</>;
}
