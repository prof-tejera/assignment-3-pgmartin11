import { TIMERS } from "../constants";

// Add helpers here. This is usually code that is just JS and not React code. Example: write a function that
// calculates number of minutes when passed in seconds. Things of this nature that you don't want to copy/paste
// everywhere.

/*
 * increment number passed in up to upper limit
 */
export const incrementHelper = (val, upLimit = 99) => {
  if (val === upLimit) {
    return val;
  }

  return val + 1;
};

/*
 * decrement number passed in down to lower limit
 */
export const decrementHelper = (val, downLimit = 0) => {
  if (val == downLimit) {
    return val;
  }

  return val - 1;
};

/*
 * add leading zeros to number
 *
 * adapted from https://bobbyhadz.com/blog/javascript-add-leading-zeros-to-number
 */
const addLeadingZeros = (num, totalLength = 2) => {
  return String(num).padStart(totalLength, "0");
};

/*
 * derive hours, minutes, seconds from seconds passed in
 */
export const calcHMS = (count, omitLeadingZeros=false) => {
  const timerHrs = omitLeadingZeros ? Math.floor(count / (60 * 60)) : addLeadingZeros(Math.floor(count / (60 * 60))),
    timerMins = omitLeadingZeros ? Math.floor((count - timerHrs * 60 * 60) / 60) : addLeadingZeros(Math.floor((count - timerHrs * 60 * 60) / 60)),
    timerSecs = omitLeadingZeros ? count - timerHrs * 60 * 60 - timerMins * 60 : addLeadingZeros(count - timerHrs * 60 * 60 - timerMins * 60);

  return { timerHrs, timerMins, timerSecs };
};

/*
 * derive seconds from hours, minutes, seconds passed in
 */
export const calcSeconds = (hrs, mins, secs) => {
  return hrs * 60 * 60 + mins * 60 + secs;
};

/*
 * calculate total time of all configured timers
 */
export const calcWorkoutTime = (timers) => {
  let totalTime = 0;
  timers.forEach((timerData, idx) => (totalTime += timers[idx].timerSecs));

  return totalTime;
};

/*
 * calculate total elapsed time of all timers up to and including timer
 * on which Fast Forward button was pressed
 */
export const calcTotalFastForwardTime = (timers, activeTimerIdx) => {
  let totalFFTime = 0;

  for (let i = 0; i <= activeTimerIdx; i++) {
    totalFFTime += timers[i].timerSecs;
  }

  return totalFFTime;
};

/*
 * check if all timers are completed
 */
export const isWorkoutCompleted = (timers) => {
  return !timers.some((timer) => timer.isCompleted === false);
};

/*
 * get current day and time in mm/dd/yy hh:mm:ss format
 *
 * adapted from https://stackoverflow.com/questions/30158574/how-to-convert-result-from-date-now-to-yyyy-mm-dd-hhmmss-ffff
 */
export const formattedDateTime = () => {
   var d = new Date();
   return (d.getMonth()+1) + "/" + d.getDate() + "/" + d.getFullYear() +
             " " + d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
}

/*
 * from Lecture 8 notes
 */
export const makeId = () => {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < 20; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

/*
 * build setter button data used by create timer and edit timer pages
 */
export const buildSetterBtnData = btnData => {
  const { countHrs,countMins, countSecs, setCountHrs, setCountMins, setCountSecs } = btnData;

  return {
    hoursLabel: "Hours",
    minutesLabel: "Minutes",
    secondsLabel: "Seconds",
    countHrs,
    countMins,
    countSecs,
    setCountHrs,
    setCountMins,
    setCountSecs
  };
}

/*
 * build interval ssetter button data used by create timer and edit timer pages
 */
export const buildSetterIntervalBtnData = intervBtnData => {
  const { intervalHrs, intervalMins, intervalSecs, setIntervalHrs, setIntervalMins, setIntervalSecs } = intervBtnData;

  return {
    hoursLabel: "Interval Hours",
    minutesLabel: "Interval Minutes",
    secondsLabel: "Interval Seconds",
    countHrs: intervalHrs,
    countMins: intervalMins,
    countSecs: intervalSecs,
    setCountHrs: setIntervalHrs,
    setCountMins: setIntervalMins,
    setCountSecs: setIntervalSecs,
  };
}

/*
 * configure initial timer data values
 */
export const getInitialTimerData = () => {
  return {
    id: "",
    title: "",
    description: "",
    startVal: "",
    endVal: "",
    roundStartVal: "",
    roundEndVal: "",
    intervalStartVal: "",
    intervalEndVal: "",
    isRunning: false,
    isCompleted: false,
  };
}

/*
 * configure timer data based on timer type
 */
export const setTimerDataByType = (type, timerVals, timerData) => {
  const { 
    countHrs, 
    countMins,
    countSecs,
    intervalHrs, 
    intervalMins, 
    intervalSecs, 
    countRounds,
    description
  } = timerVals;

  const MAX_LENGTH = 50;

  switch (type) {
    case TIMERS.STOPWATCH:
      timerData.startVal = 0;
      timerData.endVal = calcSeconds(countHrs, countMins, countSecs);
      timerData.timerSecs = timerData.endVal;
      break;
    case TIMERS.COUNTDOWN:
      timerData.startVal = calcSeconds(countHrs, countMins, countSecs);
      timerData.endVal = 0;
      timerData.timerSecs = timerData.startVal;
      break;
    case TIMERS.XY:
      timerData.startVal = calcSeconds(countHrs, countMins, countSecs);
      timerData.endVal = 0;
      timerData.roundStartVal = countRounds;
      timerData.roundEndVal = 1;
      timerData.timerSecs = timerData.startVal * timerData.roundStartVal;
      break;
    case TIMERS.TABATA:
      timerData.startVal = calcSeconds(countHrs, countMins, countSecs);
      timerData.endVal = 0;
      timerData.intervalStartVal = calcSeconds(
        intervalHrs,
        intervalMins,
        intervalSecs
      );
      timerData.intervalEndVal = 0;
      timerData.roundStartVal = countRounds;
      timerData.roundEndVal = 1;
      timerData.timerSecs =
        (timerData.startVal + timerData.intervalStartVal) *
        timerData.roundStartVal;
  }
  timerData.description = truncateStr(description, MAX_LENGTH);

  return timerData;
}

/*
 * move timers position int the workout queue
 */
export const positionTimer = (timerData, pos, timers) => {
  const beforeSize = timers.length;

  if (timers.length == 0) { return [timerData]; }

  if (pos == 0) { return [timerData, ...timers]; }

  let buf = [];
  timers.forEach((timer, i) => {
    if (i == pos) { buf.push(timerData); }
    buf.push(timer);
  });

  if (buf.length == beforeSize) {
    buf.push(timerData);
  }

  return buf;
}

/*
 * truncate string if length exceeds len value
 */
export const truncateStr = (str, len) => {
  return str.substring(0, len);
}