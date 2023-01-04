// Utils import
import { chainInfo } from "../utils/chain-info";

const BridgeInput = ({ label, chain, tokenOnClick, chainOnClick, token }) => {
  return (
    <div className="action-container">
      <div className="group">
        <span className="label">{label}</span>
        <input className="input" type="number" placeholder="0.0" />
      </div>

      <div className="group" onClick={tokenOnClick}>
        <span className="label">Token</span>
        <div className="selector">
          {token?.logo && <img src={token?.logo} alt="Token Logo" />}
          <span>{label === "To" ? `W${token?.symbol}` : token?.symbol}</span>
        </div>
      </div>

      <div className="group" onClick={chainOnClick}>
        <span className="label">Chain</span>
        <div className="selector">
          <img src={chainInfo[chain?.id]?.tokenIcon} />
          <span>{chainInfo[chain?.id]?.name}</span>
        </div>
      </div>
    </div>
  );
};

export default BridgeInput;
