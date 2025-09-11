import MinusIcon from "../../assets/minusIcon.svg";

function CardAdded({ companyLogo, companyName, companyCategory, onRemove }) {
  return (
    <div className="card-added">
      <button className="minus-icon" onClick={onRemove}>
        <img src={MinusIcon} />
      </button>
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
