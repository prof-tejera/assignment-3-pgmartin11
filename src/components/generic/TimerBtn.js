import PropTypes from "prop-types";


const TimerBtn = ({ label = "sample", handler, disabled = false }) => {
  return (
    <button
      className={label.toLowerCase().replaceAll(" ", "-")}
      disabled={disabled}
      onClick={() => handler()}
    >
      {label}
    </button>
  );
};

TimerBtn.propTypes = {
  label: PropTypes.string,
  handler: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default TimerBtn;
