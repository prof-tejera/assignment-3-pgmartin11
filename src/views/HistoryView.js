import React, { useContext, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../constants";
import { TimerContext } from "../components/timers/TimerProvider";
import { calcWorkoutTime } from "../utils/helpers";
import DocumentComponent from "../components/documentation/DocumentComponent";
import TimerBtn from "../components/generic/TimerBtn";


const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const Title = styled.div`
  font-size: 2rem;
`;

const History = () => {
  const navigate = useNavigate();
  const { timers, history, setHistory, searchParams, setSearchParams } = useContext(TimerContext);

console.log('*** history',history);

history.forEach(workout => {
  console.log('********');
  workout.forEach(timer => {
    console.log('timer', timer);
  });
  console.log('********');
})

  return (
    <Container>
      <TimerBtn handler={() => navigate({ pathname: PATHS.HOME, search: `?${searchParams}` }) } label="Back to workout" />
      <TimerBtn handler={() => navigate({ pathname: PATHS.DOCS, search: `?${searchParams}` }) } label="Documentation" />
      History page
    </Container>
  );
};

export default History;
