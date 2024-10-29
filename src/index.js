import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import LayoutComponent from "./pages/LayoutComponent";
import RespondentView from "./pages/SurveysView";
import ErrorPage from "./pages/ErrorPage";

const router = createBrowserRouter([
  {
    path: "/home",
    element: <LayoutComponent />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/home",
        element: <RespondentView respondent={true} />
      },
      {
        path: "/home/supervisor",
        element: <RespondentView respondent={false} />
      }
    ]
  },
  {
    path: "/",
    element: <Navigate to="/home" replace />
  }
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
