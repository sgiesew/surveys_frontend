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
import { useTheme } from "@mui/material/styles";
import { createSurveyType, updateSurveyType, updateStatement, createStatement, deleteStatement } from "../../api/client";


const SurveyTypeDetailView = ({ surveyType, showDetailView, setShowDetailView, fetchingDetail, isNew, register, fields, append, remove, getValues, handleSubmit, errors, wasDeleted, setWasDeleted}) => {

  const onClose = () => {
    if (surveyType){
      surveyType.name = getValues("name");
      if (!surveyType.name){
        alert("Please provide a name!");
        return;
      }
      else if (!getValues("statements")){
        alert("Please provide statements!");
        return;
      }
      
      if (isNew){
        createSurveyType(surveyType)
        .then(data => {
          surveyType.id = data.id;
          console.log(`surveyType ${surveyType.id} created`);
        });
      }
      else {
        updateSurveyType(surveyType.id, surveyType)
        .then(data => {
          console.log(`surveyType ${surveyType.id} updated`);
        });
      }
      
      if (wasDeleted && !isNew){
        surveyType.statements.forEach( (statement, index) => {
          deleteStatement(statement.id);
          console.log(`statement ${statement.id} deleted`);
        });        
      }
      fields.forEach( (field, index) => {
        const text = getValues(`statements.${index}.text`);
        if (field.ident && !(wasDeleted || isNew)){
          const statement = {
            id: field.ident,
            number: index,
            text: text
          }
          updateStatement(statement.id, statement)
          .then(data => {
            console.log(`statement ${statement.id} updated`)
          });
        }
        else {
          const statement = {
            number: index,
            text: text,
            surveyTypeId: surveyType.id
          }
          createStatement(statement)
          .then(data => {
            console.log(`new statement created`)
          });
        }
      });
    }
    setShowDetailView(false);
  };

  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
  });

  if (fetchingDetail || !surveyType) {
    return (
      <Dialog
        fullScreen
        TransitionComponent={fetchingDetail ? Transition : undefined}
        open={showDetailView}
        onClose={onClose}
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
      onClose={onClose}
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
              onClick={onClose}
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
          defaultValue={surveyType.name}
          {...register("name", {
            required: <p>error message</p>
          })} 
        />
        <Typography sx={{ flex: 1 }} variant="h6" component="div">
          Statements:
        </Typography>
        {fields.map( (field, index) => {
          return (
            <Grid container spacing={0} key={index}>
              <Grid xs={12}>
                <Box
                  display="flex"
                  flexDirection="row"
                  justifyContent="space-between"
                >
                  <Box>
                    <input
                      key={field.id}
                      defaultValue={getValues(`statements.${index}.text`)}
                      {...register(`statements.${index}.text`)} 
                    />
                  </Box>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      remove(index);
                      setWasDeleted(true);
                    }}
                  >
                    Delete
                  </Button>
                </Box>
              </Grid>
            </Grid>
          )
        })}
          <Button
            variant="outlined"
            onClick={() => {
              append({ text: "" });
            }}
            >
            Add Statement
          </Button>
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
              Submit
            </Button>
          </Box>
      </DialogContent>
    </Dialog>
  );
};

export default SurveyTypeDetailView;