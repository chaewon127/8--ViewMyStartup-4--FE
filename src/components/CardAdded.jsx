import MinusIcon from "../assets/minusIcon.svg";
import "../components/CardContainer";

function CardAdded({ companyName, companyCategory }) {
  return (
    <div className="card-added">
      <div className="minus-icon">
        <img src={MinusIcon} />
      </div>
      <div className="card-inner">
        <div className="card-img"></div>
        <div className="card-text">
          <div className="company-name">{companyName}</div>
          <div className="company-category">{companyCategory}</div>
        </div>
      </div>
    </div>
  );
}

export default CardAdded;
