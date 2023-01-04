import { chainInfo } from "../utils/chain-info";
import Modal from "./modal";

const TokenModal = ({ tokens, setIsOpen, setSelectedToken }) => {
  return (
    <Modal
      setIsOpen={() => {
        setIsOpen("none");
      }}
    >
      <span className="title">Pick your token</span>

      <div className="grid">
        {tokens.map((token, i) => {
          return (
            <div
              onClick={() => {
                setSelectedToken(token);
                setIsOpen("none");
              }}
              className="option"
              key={i}
            >
              {token?.logo && <img src={token.logo} alt="logo" />}
              <span>{token?.symbol}</span>
            </div>
          );
        })}
      </div>
    </Modal>
  );
};

export default TokenModal;
