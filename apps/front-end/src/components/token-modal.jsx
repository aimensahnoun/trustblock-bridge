import { chainInfo } from "../utils/chain-info";
import Modal from "./modal";

const TokenModal = ({ tokens, setIsOpen }) => {
  return (
    <Modal
      setIsOpen={() => {
        setIsOpen("none");
      }}
    >
      <span className="title">Pick your token</span>

      <div className="grid">
        {
            // array of 10 elements
            Array(10).fill(0).map((_, i) => {
                return <div className="option" key={i}>
                    <img src={chainInfo[80001].tokenIcon}  alt="logo"/>
                    <span>{chainInfo[80001].token}</span>
                </div>
            })
        }
        
      </div>
    </Modal>
  );
};

export default TokenModal;
