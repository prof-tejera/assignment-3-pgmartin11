export const PATHS = {
  HOME: "/",
  ADD: "/add",
  EDIT: (id, pos) => `/edit/${id || ':id'}/${pos || ':pos'}`,
  DOCS: "/docs",
  HISTORY: "/history",
};

export const TIMERS = {
  STOPWATCH: "Stopwatch",
  COUNTDOWN: "Countdown",
  XY: "XY",
  TABATA: "Tabata",
}
