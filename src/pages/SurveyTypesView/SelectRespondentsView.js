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
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Typography from "@mui/material/Typography";
import { useConfirm } from "material-ui-confirm";
import { createSurvey, updateSurveyType } from "../../api/client";


const SelectRespondentsView = (props) => {
  const {surveyType, people, showRespondentsView, setShowRespondentsView, register, getValues} = props;

  const confirm = useConfirm();
  
  const onClose = () => {
    var num_selected = 0;
    people.forEach( (person, index) => {
      if (getValues(`respondents[${index}]`)){
        num_selected++;
      }
    })
    if (!num_selected){
      confirm({title: "Please select at least one person!", hideCancelButton: true});
      return;
    }

    people.forEach( (person, index) => {
      if (getValues(`respondents[${index}]`)){
        const survey = {
          surveyTypeId: surveyType.id,
          personId: person.id,
          num_tasks: surveyType.statementsCount
        };
        createSurvey(survey)
          .then(data => {
            survey.id = data.id;
            console.log(`survey ${survey.id} created`);
          });
      }
    })

    surveyType.surveyTypeStatusId = 3;
    surveyType.num_surveys = num_selected;
    surveyType.statements = null;
    updateSurveyType(surveyType.id, surveyType)
      .then(data => {
        console.log(`surveyType ${surveyType} updated`);
        setShowRespondentsView(false);
      });

  };

  const handleClose = () => {
    setShowRespondentsView(false);
  };


  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={showRespondentsView}
      onClose={handleClose}
    >
      <DialogTitle
        sx={{ m: 0, p: 0 }}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar variant="dense">
            <Typography sx={{ flex: 1 }} variant="h6" component="div">
              Select Respondents
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
        <Box>
          {people.map( (person, index) => (
            <ListItemButton key={index}>
              <input
                id={index}
                type="checkbox"
                value={false}
                //checked={getValues(`respondents[${index}]`)}
                //{...register(`respondents[${index}]`)}
                {...register("respondents")}
              />
              <ListItemText primary={person.realName} />
            </ListItemButton>
          ))}
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-around"
        >
        <Button
          variant="outlined"
          onClick={() => setShowRespondentsView(false)}
          >
          Cancel
        </Button>
        <Button
          variant="outlined"
          onClick={onClose}
          >
          Assign
        </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default SelectRespondentsView;