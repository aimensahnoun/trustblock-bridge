const Modal = ({ children, setIsOpen }) => {
  return (
    <main className="modal" onClick={setIsOpen}>
      <div
        className="modal-container"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {children}
      </div>
    </main>
  );
};

export default Modal;
