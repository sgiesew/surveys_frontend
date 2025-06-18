import React from "react";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { useForm } from "react-hook-form";
import { setToken } from "../../utils/token.js";
import { setRole } from "../../utils/role.js";
import { useLocation, useNavigate } from "react-router-dom"
import { useConfirm } from "material-ui-confirm";
import { loginPerson } from "../../api/client";

const Login = () => {

  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const confirm = useConfirm();

  const onSubmit = (data) => {
    const person = {
      username: data.username,
      password: data.password
    };
    loginPerson(person)
      .then(res => {
        const person = res.data;
        if (res){
          setToken(person.token);
          setRole(person.role.usid);
          var path;
          person.role.usid === "Respondent" ? path = "/home/surveys" : path = "/home/surveytypes";
          location.state?.from
            ? navigate(location.state.from)
            : navigate(path, { replace: true });
        }
        else {
          confirm({title: "Username and password did not match!", hideCancelButton: true});
        }
      })
      .catch(error => {
        confirm({title: "Username and password did not match!", hideCancelButton: true});
      })
  };

  return (
    <Dialog
      open={true}
    >
      <DialogTitle
        sx={{ m: 0, p: 0 }}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar variant="dense">
            <Typography sx={{ flex: 1 }} variant="h6" component="div">
              Login
            </Typography>
          </Toolbar>
        </AppBar>
      </DialogTitle>
      <DialogContent
        sx={{ mt: 3, mx: 4}}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-around"
            alignItems="center"
          >
          <Box sx={{ mb: 2}}>
            <Typography sx={{ flex: 1 }} component="div">
              Username:
            </Typography>
            <input
              defaultValue={""}
              {...register("username", { required: true })} 
            />
            {errors.username &&
              <Typography sx={{ flex: 1 }} component="div">
                <em>This field is required!</em>
              </Typography>
            }
          </Box>
          <Box sx={{ mb: 2}}>
            <Typography sx={{ flex: 1 }} component="div">
              Password:
            </Typography>
            <input
              defaultValue={""}
              {...register("password", { required: true })} 
            />
            {errors.password &&
              <Typography sx={{ flex: 1 }} component="div">
                <em>This field is required!</em>
              </Typography>
            }
          </Box>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-around"
          >
            <Button sx={{ mt: 2}}
              variant="contained"
              color="secondary"
              type="submit"
            >
              Login
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Login;