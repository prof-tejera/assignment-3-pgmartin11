import React from "react";
import { calcWorkoutTime, calcHMS } from "../../utils/helpers";
import styled from "styled-components";


const Wrapper = styled.div`
  border: 1px solid #121212;
  margin: 20px 0px;
`;

const Container = styled.div`
  padding: 20px;
  display: flex;
  justify-content: space-between;
`;

const Title = styled.div`
  display: flex;
  justify-content: left;
  padding-top: 20px;
  padding-left: 20px;
  font-size: 1.3rem;
`;

const HistoryComponent = ({ workout }) => {
  const { timerHrs: woHrs, timerMins: woMins, timerSecs: woSecs } = calcHMS(calcWorkoutTime(workout.timers));

  return (
    <Wrapper>
      <Title>{workout.date_time}</Title>
      <Title>Total workout time: {woHrs}:{woMins}:{woSecs}</Title>
      <Container>
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Counter Time</th>
              <th>Total Intervals</th>
              <th>Total Rounds</th>
              <th>Total time</th>
            </tr>
          </thead>
          <tbody>
            {workout.timers.map((timer, i) => {
              let count = 0;
              if (timer.title == 'Stopwatch') { 
                count = timer.endVal;
              } else {
                count = timer.startVal;
              }

              const { timerHrs, timerMins, timerSecs } = calcHMS(count);
              const { timerHrs: totalHrs, timerMins: totalMins, timerSecs: totalSecs } = calcHMS(timer.timerSecs);
              const numRounds = timer.roundEndVal != '' ? timer.roundEndVal : 'N/A';
              const numIntervals = timer.intervalEndVal != '' ? timer.intervalEndVal : 'N/A';

              return (
                <tr key={i}>
                  <td>{timer.title}</td>
                  <td>{timerHrs}:{timerMins}:{timerSecs}</td>
                  <td>{numIntervals}</td>
                  <td>{numRounds}</td>
                  <td>{totalHrs}:{totalMins}:{totalSecs}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Container>
    </Wrapper>
  );
};

export default HistoryComponent;
