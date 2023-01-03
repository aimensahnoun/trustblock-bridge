// NextJs import
import Head from "next/head";
import Image from "next/image";

// Dependencies import
import { ConnectButton } from '@rainbow-me/rainbowkit';


export default function Home() {
  return (
    <main className="main-container">
      <Head>
        <title>TrustBlock Bridge</title>
      </Head>

      <nav className="nav">
        <span className="title">
          <div className="dot" />
          Ponti
        </span>

        <ConnectButton />
      </nav>
    </main>
  );
}
