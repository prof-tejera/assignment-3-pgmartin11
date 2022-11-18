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

export default TimerBtn;
