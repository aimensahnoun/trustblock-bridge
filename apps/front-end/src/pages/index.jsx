// NextJs import
import Head from "next/head";
import Image from "next/image";

// Dependencies import
import { ConnectButton } from "@rainbow-me/rainbowkit";

// Components import
import BridgeInput from "./components/bridge-input";

export default function Home() {
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
}
