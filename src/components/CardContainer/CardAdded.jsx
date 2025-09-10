import MinusIcon from "../../assets/minusIcon.svg";

function CardAdded({ companyLogo, companyName, companyCategory }) {
  return (
    <div className="card-added">
      <div className="minus-icon">
        <img src={MinusIcon} />
      </div>
      <div className="card-inner">
        <img
          src={companyLogo}
          alt={`${companyName} 로고`}
          className="card-img"
        />
        <div className="card-text">
          <div className="card-name">{companyName}</div>
          <div className="card-category">{companyCategory}</div>
        </div>
      </div>
    </div>
  );
}

export default CardAdded;
