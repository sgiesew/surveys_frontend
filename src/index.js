import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { ConfirmProvider } from "material-ui-confirm";
import AuthRoute from "./pages/AuthRoute";
import Login from "./pages/Login";
import LayoutComponent from "./pages/LayoutComponent";
import SurveysView from "./pages/SurveysView";
import SurveyTypesView from "./pages/SurveyTypesView";
import PeopleView from "./pages/PeopleView";
import ErrorPage from "./pages/ErrorPage";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#7950ed",
      contrastText: "#fff"
    },
    secondary: {
      main: "#15b76c",
      contrastText: "#fff"
    },
  }
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/home",
    element: 
      <AuthRoute>
        <LayoutComponent />
      </AuthRoute>
    ,
    children: [
      {
        path: "/home/surveys",
        element: <SurveysView />
      },
      {
        path: "/home/surveytypes",
        element: <SurveyTypesView />
      },
      {
        path: "/home/people",
        element: <PeopleView />
      }
    ]
  }
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ConfirmProvider>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </ConfirmProvider>
  </React.StrictMode>
);
