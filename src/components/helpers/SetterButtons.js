import PropTypes from "prop-types";
import { IncrementBtn, DecrementBtn } from "./HMSBtn";
import { incrementHelper, decrementHelper, calcHMS } from "../../utils/helpers";


const SetterButtons = ({
  hoursLabel,
  minutesLabel,
  secondsLabel,
  countHrs,
  countMins,
  countSecs,
  setCountHrs,
  setCountMins,
  setCountSecs,
  disabled,
}) => {
  const titleClass = disabled
    ? "time-setter-title disabled"
    : "time-setter-title";
  const valClass = disabled ? "time-setter-val disabled" : "time-setter-val";

  return (
    <>
      <span className={titleClass}>{hoursLabel}:</span>
      <DecrementBtn
        disabled={disabled}
        handler={() => {
          setCountHrs(decrementHelper(countHrs));
        }}
      />
      <span className={valClass}>{countHrs}</span>
      <IncrementBtn
        disabled={disabled}
        handler={() => {
          setCountHrs(incrementHelper(countHrs));
        }}
      />
      <br />
      <span className={titleClass}>{minutesLabel}:</span>
      <DecrementBtn
        disabled={disabled}
        handler={() => {
          setCountMins(decrementHelper(countMins));
        }}
      />
      <span className={valClass}>{countMins}</span>
      <IncrementBtn
        disabled={disabled}
        handler={() => {
          setCountMins(incrementHelper(countMins, 59));
        }}
      />
      <br />
      <span className={titleClass}>{secondsLabel}:</span>
      <DecrementBtn
        disabled={disabled}
        handler={() => {
          setCountSecs(decrementHelper(countSecs));
        }}
      />
      <span className={valClass}>{countSecs}</span>
      <IncrementBtn
        disabled={disabled}
        handler={() => {
          setCountSecs(incrementHelper(countSecs, 59));
        }}
      />
    </>
  );
};

SetterButtons.propTypes = {
  hoursLabel: PropTypes.string.isRequired,
  minutesLabel: PropTypes.string.isRequired,
  secondsLabel: PropTypes.string.isRequired,
  countHrs: PropTypes.number.isRequired,
  countMins: PropTypes.number.isRequired,
  countSecs: PropTypes.number.isRequired,
  setCountHrs: PropTypes.func.isRequired,
  setCountMins: PropTypes.func.isRequired,
  setCountSecs: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default SetterButtons;
