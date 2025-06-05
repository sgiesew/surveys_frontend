import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import Slide from "@mui/material/Slide";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useTheme } from "@mui/material/styles";
import { useConfirm } from "material-ui-confirm";
import { createPerson, updatePerson } from "../../api/client";


const PersonDetailView = (props) => {
  const { person, roles, showDetailView, setShowDetailView, fetchingDetail, isNew, register, getValues, wasChanged, setWasChanged} = props;

  const confirm = useConfirm();
  
  const onClose = () => {
    if (person){
      person.realName = getValues("realName");
      if (!person.realName){
        confirm({title: "Please provide a name!", hideCancelButton: true});
        return;
      }
      person.username = getValues("username");
      if (!person.username){
        confirm({title: "Please provide a username!", hideCancelButton: true});
        return;
      }
      person.password = getValues("password");
      if (!person.password){
        confirm({title: "Please provide a password!", hideCancelButton: true});
        return;
      }
      person.roleId = getValues("role");
 
      if (isNew){
        createPerson(person)
        .then(data => {
          person.id = data.id;
          console.log(`person ${person.id} created`);
          setShowDetailView(false);
        });
      }
      else {
        updatePerson(person.id, person)
        .then(data => {
          console.log(`person ${person.id} updated`);
          setShowDetailView(false);
        });
      }
    }
  };

  const handleClose = () => {
    if (wasChanged){
      confirm({title: "Save changes?", confirmationText: "Yes", cancellationText: "No"})
      .then(() => {
        onClose();
      })
      .catch(() => {
        setShowDetailView(false);
      });
    }
    else {
      setShowDetailView(false);
    }
  };


  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
  });

  if (fetchingDetail || !person) {
    return (
      <Dialog
        fullScreen
        TransitionComponent={fetchingDetail ? Transition : undefined}
        open={showDetailView}
        onClose={handleClose}
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <CircularProgress />
        </Box>
      </Dialog>
    );
  }

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={showDetailView}
      onClose={handleClose}
    >
      <DialogTitle
        sx={{ m: 0, p: 0 }}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar variant="dense">
            <Typography sx={{ flex: 1 }} variant="h6" component="div">
              Details
            </Typography>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </DialogTitle>
      <DialogContent
        sx={{ m: 2, p: 0, backgroundColor: "#eee" }}
      >
        <Typography sx={{ flex: 1 }} variant="h6" component="div">
          Name:
        </Typography>
        <input
          defaultValue={person.realName}
          onInput={() => {
            setWasChanged(true);
          }}
          {...register("realName")} 
        />
        <Typography sx={{ flex: 1 }} variant="h6" component="div">
          Username:
        </Typography>
        <input
          defaultValue={person.username}
          onInput={() => {
            setWasChanged(true);
          }}
          {...register("username")} 
        />
        <Typography sx={{ flex: 1 }} variant="h6" component="div">
          Password:
        </Typography>
        <input
          defaultValue={person.password}
          onInput={() => {
            setWasChanged(true);
          }}
          {...register("password")} 
        />
        <Typography sx={{ flex: 1 }} variant="h6" component="div">
          Role:
        </Typography>
        <Select
          id="role-select"
          label="Role"
          defaultValue={person.roleId}
          onChange={() => {
            setWasChanged(true);
          }}
          {...register("role")}
        >
          {roles.map( (role, index) => (
            <MenuItem key={index} value={role.id}>{role.usid}</MenuItem>
          ))}
        </Select>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-around"
        >
          <Button
            variant="outlined"
            onClick={() => setShowDetailView(false)}
          >
            Cancel
          </Button>
          <Button
            variant="outlined"
            onClick={onClose}
          >
            Save
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default PersonDetailView;