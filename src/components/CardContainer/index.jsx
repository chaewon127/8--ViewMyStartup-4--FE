import CardAdded from "../CardAdded";
import MediumButton from "../../components/MediumButton";
import PlusButton from "../../assets/plusButton.svg";
import "./CardContainer.css";

function CardContainer({
  title,
  desc,
  btnName,
  btnDisabled,
  companyList,
  isData = false,
}) {
  return (
    <div className="card-container">
      <div className="card-title">
        <div className="title-left">
          <div className="title">{title}</div>
          <div className="desc">{desc}</div>
        </div>
        <MediumButton disabled={btnDisabled}>{btnName}</MediumButton>
      </div>
      <div className="card-main">
        {isData ? (
          companyList.map((el) => 
          <CardAdded
            companyName={el.name}
            companyCategory={el.category}
          />)
        ) : (
          <button className="add-card">
            <img src={PlusButton} />
            <div>기업 추가</div>
          </button>
        )}
      </div>
    </div>
  );
}

export default CardContainer;
