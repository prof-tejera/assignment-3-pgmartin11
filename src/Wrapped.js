import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import App from "./App";

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div role="alert">
      <h2>An error occurred in the application:</h2>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Retry</button>
    </div>
  )
}

const Wrapped = () => {
  return <ErrorBoundary FallbackComponent={ErrorFallback} onError={(error, errorInfo) => {
    // Handle error, maybe send it to a logging service
  }}>
    <App />
  </ErrorBoundary>;
}

export default Wrapped;
