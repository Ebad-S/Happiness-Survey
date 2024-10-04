import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

// Define props for the ErrorMessage component
interface ErrorMessageProps {
  title: string;
  message: string;
  details?: any;
}

// Generic ErrorMessage component
const ErrorMessage: React.FC<ErrorMessageProps> = ({ title, message, details }) => {
  // Log error details to console
  useEffect(() => {
    console.error(`Error: ${title}\nMessage: ${message}\nDetails:`, details);
  }, [title, message, details]);

  return (
    <div className="error-message">
      <h2>{title}</h2>
      <p>{message}</p>
      <Link to="/">Go back to home</Link>
    </div>
  );
};

// 404 Not Found error page
export const NotFoundPage: React.FC = () => {
  return (
    <ErrorMessage
      title="404 - Page Not Found"
      message="The page you're looking for doesn't exist."
      details={{ path: window.location.pathname }}
    />
  );
};

// Generic error page
export const ErrorPage: React.FC<{ message?: string; details?: any }> = ({ message, details }) => {
  return (
    <ErrorMessage
      title="Error"
      message={message || "An error occurred. Please try again later."}
      details={details}
    />
  );
};

// API limit exceeded error page
export const APILimitExceededPage: React.FC = () => {
  return (
    <ErrorMessage
      title="API Limit Exceeded"
      message="We've hit our API request limit. Please try again later or contact support if this persists."
      details={{ timestamp: new Date().toISOString() }}
    />
  );
};

// Server error page
export const ServerErrorPage: React.FC<{ details?: any }> = ({ details }) => {
  return (
    <ErrorMessage
      title="Server Error"
      message="We're experiencing some technical difficulties. Please try again later."
      details={details}
    />
  );
};

// Bad request error page
export const BadRequestPage: React.FC<{ message?: string; details?: any }> = ({ message, details }) => {
  return (
    <ErrorMessage
      title="Bad Request"
      message={message || "Invalid request. Please check your input and try again."}
      details={details}
    />
  );
};

// Unauthorized access error page
export const UnauthorizedPage: React.FC<{ details?: any }> = ({ details }) => {
  return (
    <ErrorMessage
      title="Unauthorized"
      message="You are not authorized to access this resource. Please log in or check your credentials."
      details={details}
    />
  );
};

// Conflict error page
export const ConflictPage: React.FC<{ details?: any }> = ({ details }) => {
  return (
    <ErrorMessage
      title="Conflict"
      message="The requested operation couldn't be completed due to a conflict with the current state of the resource."
      details={details}
    />
  );
};
