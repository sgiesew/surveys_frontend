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
import { useConfirm } from "material-ui-confirm";
import { createSurveyType, updateSurveyType } from "../../api/client";


const SurveyTypeDetailView = ({ surveyType, showDetailView, setShowDetailView, fetchingDetail, isNew, register, fields, append, remove, getValues, handleSubmit, errors, wasDeleted, setWasDeleted, wasChanged, setWasChanged}) => {

  const confirm = useConfirm();
  
  const onClose = () => {
    if (surveyType){
      if (isNew){
        surveyType = {
          name: "",
          statements: []
        };
      }

      surveyType.name = getValues("name");
      if (!surveyType.name){
        alert("Please provide a name!");
        return;
      }
      else if (!getValues("statements")){
        alert("Please provide statements!");
        return;
      }

      surveyType.statements = [];

      fields.forEach( (field, index) => {
        var text = getValues(`statements[${index}].text`)
          const statement = {
            id: field.ident,
            surveyTypeId: surveyType.id,
            number: index,
            text: text
          }
          surveyType.statements.push(statement);
      });
 
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
    }
    setShowDetailView(false);
  };

  const handleClose = () => {
    if (wasChanged || wasDeleted){
        confirm({title: "Save changes?"})
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

  if (fetchingDetail || !surveyType) {
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
          defaultValue={surveyType.name}
          onInput={() => {
            setWasChanged(true);
          }}
          {...register("name")} 
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
                      onInput={() => {
                        setWasChanged(true);
                      }}
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
              Save
            </Button>
          </Box>
      </DialogContent>
    </Dialog>
  );
};

export default SurveyTypeDetailView;