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
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import Slide from "@mui/material/Slide";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { useTheme } from "@mui/material/styles";
//import { useForm } from "react-hook-form";
import { updateTask, updateSurvey } from "../../api/client";

const ratingScale = [
  "Don't know",
  "Strongly agree",
  "Somewhat agree",
  "Neither agree nor disagree",
  "Somewhat disagree",
  "Strongly disagree"
];

const RespondentSurveyView = ({ survey, showDetailView, setShowDetailView, fetchingDetail, currentTask, setCurrentTask, numCompleted, setNumCompleted, register, getValues}) => {

  const onClose = () => {
    if (survey){
      console.log(getValues("response[]"));
      var num_completed = 0;
      survey.tasks.forEach( (task, index) => {
        const response = parseInt(getValues(`response[${index}]`));
        if (response !== 0){
          survey.tasks[index].response = response;
          num_completed++;
          updateTask(task.id, task)
            .then(data => {
              console.log(`task ${task.id} updated`)
            });
        }
      })
      survey.num_completed = num_completed;
      survey.current_task = currentTask;
      console.log(survey);
      updateSurvey(survey.id, survey)
        .then(data => {
          console.log(`survey ${survey.id} updated`)
        });
    }
    setShowDetailView(false);
  };

  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
  });

  if (fetchingDetail || !survey) {
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
      fullScreen
      open={showDetailView}
      onClose={onClose}
    >
      <DialogTitle
        sx={{ m: 0, p: 0 }}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar variant="dense">
            <Typography sx={{ flex: 1 }} variant="h6" component="div">
              {survey.surveyType.name} ({survey.num_completed} / {survey.num_tasks})
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
        sx={{ m: 0, p: 0, backgroundColor: "#eee" }}
      >

          {survey.tasks.map( (v, task) => {
            if (task !== currentTask)
              return (<Box key={task}></Box>);
            return (
              <Box key={task}>
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Typography variant="h3">
                    ({currentTask + 1}) {survey.surveyType.statements[task].text}.
                  </Typography>
                </Box>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                >
                  <Box
                    display="inline-flex"
                    flexDirection="column"
                    alignItems="left"
                  >
                    <RadioGroup
                      aria-labelledby="response-group"
                      name="response-group"
                      defaultValue={getValues(`response[${task}]`)}
                    >
                      {ratingScale.map( (value, index) => {
                        const visibility = index === 0 ? "hidden" : "visible";
                        return (
                        <Box
                          display="flex"
                          flexDirection="row"
                          alignItems="left"
                          key={index}
                          sx={{ visibility: visibility }}
                          >
                          <Radio
                            value={index}
                            key={index}
                            name="response"
                            disabled={survey.completed}
                            {...register(`response[${task}]`)}
                            inputProps={{ 'aria-label': {value} }}
                          />
                            <Typography variant="h5">
                              {value}
                            </Typography>
                          </Box>
                        )})}
                    </RadioGroup>
                  </Box>
                </Box>
              </Box>
            )})}
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-around"
          >
            <Button
              variant="outlined"
              onClick={() => {
                if (currentTask > 0){
                  if (parseInt(survey.tasks[currentTask].response) === 0 && parseInt(getValues(`response[${currentTask}]`)) !== 0){
                    survey.num_completed = survey.num_completed + 1;
                    console.log(survey.num_completed);
                  }
                  setCurrentTask(currentTask - 1);
                }
              }}
              >
              Previous
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                if (currentTask < survey.tasks.length - 1){
                  if (parseInt(survey.tasks[currentTask].response) === 0 && parseInt(getValues(`response[${currentTask}]`)) !== 0){
                    survey.num_completed = survey.num_completed + 1;
                    console.log(survey.num_completed);
                  }
                  setCurrentTask(currentTask + 1);
                }
              }}
              >
              Next
            </Button>
            <Button
              variant="outlined"
              visible={!survey.completed}
              onClick={() => {
                var empty = false;
                survey.tasks.forEach( (task, index) => {
                  const response = parseInt(getValues(`response[${index}]`));
                  if (response === 0){
                    empty = true;
                  }
                });
                if (!empty){
                  survey.completed = true;
                  onClose();
                }
              }}
              >
              Submit
            </Button>
          </Box>

        </DialogContent>
    </Dialog>
  );
};

export default RespondentSurveyView;          