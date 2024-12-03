import { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "../contexts/AuthProvider";

const ProtectedRoutes = ({ children }: PropsWithChildren) => {
  console.log("protected routes being called");
  /* PROTECTS THE ROUTES ON THE BASIS OF LOGGED IN STATE */

  const { isLoggedIn, isLoading: authLoading } = useAuth();

  const location = useLocation();

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <h1>Loading...</h1>
      </div>
    );
  }

  if (!isLoggedIn) {
    // Redirect to login page, passing the current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoutes;
