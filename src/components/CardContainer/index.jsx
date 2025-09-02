import CardAdded from "../CardAdded";
import MediumButton from "../../components/MediumButton";
import PlusButton from "../../assets/plusButton.svg";
import "./CardContainer.css";

function CardContainer({
  title,
  desc,
  btnName,
  companyName,
  companyCategory,
  isData = false,
}) {
  return (
    <>
      <div className="card-title">
        <div>
          <div>{title}</div>
          <div>{desc}</div>
        </div>
        <MediumButton>{btnName}</MediumButton>
      </div>
      <div className="card-main">
        {isData ? (
          <CardAdded
            companyName={companyName}
            companyCategory={companyCategory}
          />
        ) : (
          <div>
            <img src={PlusButton} />
            기업 추가
          </div>
        )}
      </div>
    </>
  );
}

export default CardContainer;
