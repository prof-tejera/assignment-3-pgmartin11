import PropTypes from "prop-types";
import TimerBtn from "../generic/TimerBtn";


export const IncrementBtn = ({ handler, disabled }) => {
  return <TimerBtn disabled={disabled} label="+" handler={handler} />;
};

IncrementBtn.propTypes = {
  handler: PropTypes.func,
  disabled: PropTypes.bool,
};

export const DecrementBtn = ({ handler, disabled }) => {
  return <TimerBtn disabled={disabled} label="-" handler={handler} />;
};

DecrementBtn.propTypes = {
  handler: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
