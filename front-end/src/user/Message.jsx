export default function Message (props) {
  return (
    <div className="card text-white bg-success mb-3" >
      <div className="card-body">
        <h5 className="card-title">{props.userId}</h5>
        <p className="card-text">
          {props.message}
        </p>
      </div>
    </div>
  );
}
