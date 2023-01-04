import { chainInfo } from "../utils/chain-info";
import Modal from "./modal";

const ChainModal = ({ chains, setIsOpen, setSelectedChain }) => {
  return (
    <Modal
      setIsOpen={() => {
        setIsOpen("none");
      }}
    >
      <span className="title">Pick your chain</span>

      <div className="grid">
        {chains.map((chain, i) => {
          return (
            <div
              onClick={() => {
                setSelectedChain(chain);
                setIsOpen("none");
              }}
              className="option"
              key={i}
            >
              <img src={chainInfo[chain.id].tokenIcon} alt="logo" />
              <span>{chainInfo[chain.id].name}</span>
            </div>
          );
        })}
      </div>
    </Modal>
  );
};

export default ChainModal;
