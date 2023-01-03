// NextJs import
import Head from "next/head";

// Dependencies import
import { ConnectButton } from "@rainbow-me/rainbowkit";

// Components import
import BridgeInput from "../pages/components/bridge-input";

const MainView = () => {
  return (
    <main className="main-container">
      <Head>
        <title>TrustBlock Bridge</title>
      </Head>

      {/* Navbar */}
      <nav className="nav">
        <span className="title">
          <div className="dot" />
          Ponti
        </span>

        <ConnectButton />
      </nav>

      {/* Main body */}
      <body className="body">
        <span className="title">Crosschain Bridge</span>

        <BridgeInput label="From" />
        <BridgeInput label="To" />
      </body>
    </main>
  );
};

export default MainView;
