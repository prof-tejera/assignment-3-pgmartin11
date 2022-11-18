import TimerBtn from "../generic/TimerBtn";

export const IncrementBtn = ({ handler, disabled }) => {
  return <TimerBtn disabled={disabled} label="+" handler={handler} />;
};

export const DecrementBtn = ({ handler, disabled }) => {
  return <TimerBtn disabled={disabled} label="-" handler={handler} />;
};
