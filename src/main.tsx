import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Dashboard from "./Dashboard.tsx";
import Login from "./Login.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthProvider from "@/contexts/AuthProvider.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const router = createBrowserRouter([
  {
    element: <Dashboard />,
    path: "/",
    index: true,
  },
  {
    element: <Login />,
    path: "login",
  },
]);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
