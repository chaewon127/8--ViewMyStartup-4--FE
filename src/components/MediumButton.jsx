import "./Button.css";

function MediumButton({ disabled, children }) {
  return (
    <>
      <button className="btn_medium" disabled={disabled}>
        {/* <LoadingIcon/> */}
        {children}
      </button>
    </>
  );
}

export default MediumButton;
