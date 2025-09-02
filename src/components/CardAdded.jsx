import MinusIcon from "../assets/minusIcon.svg";

function CardAdded({ companyName, companyCategory }) {
  return (
    <>
      <div>
        <img src={MinusIcon} />
      </div>
      <img />
      <div>{companyName}</div>
      <div>{companyCategory}</div>
    </>
  );
}

export default CardAdded;
