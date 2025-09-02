import CardAdded from "./CardAdded";
import MediumButton from "./MediumButton";

function CardContainer ({ title, desc,  btnName, companyName, companyCategory }) {
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
        <CardAdded companyName={companyName} companyCategory={companyCategory}/>
      </div>
    </>
  )
}

export default CardContainer;