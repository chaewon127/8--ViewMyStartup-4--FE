import "./Button.css";

function MediumButton({ children }) {
  return (
    <>
      <button className="btn_medium">
        {/* <LoadingIcon/> */}
        {children}
      </button>
    </>
  );
}

export default MediumButton;
