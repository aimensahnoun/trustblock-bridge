const BridgeInput = ({
    label,
}) => {
  return (
    <div className="action-container">
      <div className="group">
        <span className="label">{label}</span>
        <input className="input" type="number" placeholder="0.0" />
      </div>

      <div className="group">
        <span className="label">Token</span>
        <div className="selector"></div>
      </div>

      <div className="group">
        <span className="label">Chain</span>
        <div className="selector"></div>
      </div>
    </div>
  );
};

export default BridgeInput;
