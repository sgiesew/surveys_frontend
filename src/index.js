import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { ConfirmProvider } from "material-ui-confirm";
import LayoutComponent from "./pages/LayoutComponent";
import SurveysView from "./pages/SurveysView";
import SurveyTypesView from "./pages/SurveyTypesView";
import ErrorPage from "./pages/ErrorPage";

const router = createBrowserRouter([
  {
    path: "/home",
    element: <LayoutComponent />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/home",
        element: <SurveysView respondent={true} />
      },
      {
        path: "/home/supervisor",
        element: <SurveysView respondent={false} />
      },
      {
        path: "/home/manager",
        element: <SurveyTypesView />
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
    <ConfirmProvider>
      <RouterProvider router={router} />
    </ConfirmProvider>
  </React.StrictMode>
);
