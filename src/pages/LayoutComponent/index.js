import React from "react";
import { Outlet, useLocation, useNavigate} from "react-router-dom";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { removeToken } from "../../utils/token.js";
import { getRole } from "../../utils/role.js";


const LayoutComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();

  const Logout = () => {
    removeToken();
    navigate("/login", { replace: true });
  };
  
  const menuItems = [
    { 
      label: "Respondents",
      link: "/home/surveys",
      visibleFor: ["Supervisor"]
    },
    { 
      label: "Surveys",
      link: "/home/surveytypes",
      visibleFor: ["Supervisor" ,"Manager"]
    },
    { 
      label: "Users",
      link: "/home/people",
      visibleFor: ["Manager"]
    }
  ]

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 0 }}
      >
        <AppBar sx={{ position: "static" }}>
          <Toolbar variant="dense">
            <Typography sx={{ flex: 1 }} variant="h6" component="div">
              {getRole() === "Respondent" ? <>Surveys</> : menuItems.find( item => item.link === location.pathname).label}
            </Typography>
            {menuItems.filter(item => item.visibleFor.find(element => element === getRole())).map( (item, index) => (
              <Button sx={{ color: "#fff" }}
                key={index}
                variant="outlined"
                href={item.link}
              >
                {item.label}
              </Button>
            ))}
            <Button sx={{ color: "#fff" }}
              variant="outlined"
              onClick={() => Logout()}
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>
        <Outlet></Outlet>
      </Box>
    </Box>
  );
}

export default LayoutComponent;