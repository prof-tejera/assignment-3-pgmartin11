import PropTypes from "prop-types";


const DisplayRound = ({ round }) => {
  return (
    <div className="display">
      <span className="time-category">Round:</span>
      {round}
    </div>
  );
};

DisplayRound.propTypes = {
  round: PropTypes.number.isRequired,
};

export default DisplayRound;
