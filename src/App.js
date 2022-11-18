import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import styled from "styled-components";
import TimerProvider from "./components/timers/TimerProvider";
import NewTimer from "./components/timers/NewTimer";
import WorkoutView from "./views/WorkoutView";
import DocumentationView from "./views/DocumentationView";
import { PATHS } from "./constants";

const Container = styled.div`
  background: #f0f6fb;
  height: 100vh;
  overflow: auto;
`;

const App = () => {
  return (
    <Container>
      <TimerProvider>
        <Router basename="/assignment-3-pgmartin11">
          <Routes>
            <Route path={PATHS.HOME} element={<WorkoutView />} />
            <Route path={PATHS.ADD} element={<NewTimer />} />
            <Route path={PATHS.DOCS} element={<DocumentationView />} />
            <Route path="*" element={<Navigate to={PATHS.HOME} />} />
          </Routes>
        </Router>
      </TimerProvider>
    </Container>
  );
};

export default App;
