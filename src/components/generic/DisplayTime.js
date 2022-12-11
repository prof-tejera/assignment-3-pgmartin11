import PropTypes from "prop-types";
import { incrementHelper, decrementHelper, calcHMS } from "../../utils/helpers";


const DisplayTime = ({ label, count }) => {
  const { timerHrs, timerMins, timerSecs } = calcHMS(count);

  return (
    <div className="display">
      <span className="time-category">{label}:</span>
      {timerHrs}:{timerMins}:{timerSecs}
    </div>
  );
};

DisplayTime.propTypes = {
  label: PropTypes.string.isRequired,
  count: PropTypes.number,
};

export default DisplayTime;
