import { PropsWithChildren } from "react";
import { useAuth } from "../contexts/AuthProvider";
import { Navigate, useLocation } from "react-router";

const UnprotectedRoutes = ({ children }: PropsWithChildren) => {
  /* PROTECTS THE ROUTES ON THE BASIS OF LOGGED IN STATE */

  const { isLoggedIn, isLoading } = useAuth();

  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <h1>Loading...</h1>
      </div>
    );
  }

  if (isLoggedIn) {
    // Redirect to login page, passing the current location
    return (
      <Navigate to="/teacher-profiles" state={{ from: location }} replace />
    );
  }

  return children;
};

export default UnprotectedRoutes;
