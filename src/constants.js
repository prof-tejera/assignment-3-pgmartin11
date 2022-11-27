export const PATHS = {
  HOME: "/",
  ADD: "/add",
  EDIT: (id) => `/edit/${id || ':id'}`,
  DOCS: "/docs",
  HISTORY: "/history",
};
