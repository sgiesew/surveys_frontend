import React from "react";
import Box from "@mui/material/Box";
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
import { updateSurvey, getSurveyType, updateSurveyType } from "../../api/client";

const ratingScale = [
  "Don't know",
  "Strongly agree",
  "Somewhat agree",
  "Neither agree nor disagree",
  "Somewhat disagree",
  "Strongly disagree"
];

const RespondentSurveyView = (props) => {
  const {survey, showDetailView, setShowDetailView, fetchingDetail, currentTask, setCurrentTask, register, getValues, confirm} = props;

  const onClose = () => {
    if (survey){
      var num_completed = 0;
      survey.tasks.forEach( (task, index) => {
        const response = parseInt(getValues(`response[${index}]`));
        if (response !== 0){
          survey.tasks[index].response = response;
          num_completed++;
        }
      })
      survey.num_completed = num_completed;
      survey.current_task = currentTask;
      updateSurvey(survey.id, survey)
        .then(res => {
          console.log(`survey ${survey.id} updated`)
          setShowDetailView(false);
          if (survey.completed){
            getSurveyType(survey.surveyTypeId)
            .then(res => {
              const surveyType = res.data;
              surveyType.num_completed++;
              surveyType.statements = null;
              updateSurveyType(surveyType.id, surveyType)
                .then(res => {
                  console.log(`surveyType ${surveyType.id} updated`);
                });
            }
          )};
        });
    }
    else {
      setShowDetailView(false);
    }
  };

  const onCancel = () => {
    if (!survey.completed){
      onClose();
    }
    else {
      setShowDetailView(false);
    }
  }

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
              {survey.surveyType.name} ({survey.num_completed} / {survey.num_tasks})
            </Typography>
            <IconButton
              edge="start"
              color="inherit"
              onClick={onCancel}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </DialogTitle>
      <DialogContent
        sx={{ m: 0 }}
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
                <Typography variant="h4" sx={{ mt: 1}}>
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
                        alignItems="center"
                        key={index}
                        sx={{ visibility: visibility }}
                      >
                        <Radio
                          value={index}
                          key={index}
                          size="small"
                          name="response"
                          disabled={survey.completed}
                          {...register(`response[${task}]`)}
                          inputProps={{ 'aria-label': {value} }}
                        />
                          <Typography variant="h6">
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
            sx={{ mt: 4 }}
            display="flex"
            flexDirection="row"
            justifyContent="space-around"
          >
            <Button
              variant="contained"
              color="secondary"
              disabled={currentTask === 0}
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
              color="secondary"
              disabled={survey.completed}
              onClick={() => {
                if (!survey.tasks.find( (task, index) => (parseInt(getValues(`response[${index}]`)) === 0) )){
                  confirm()
                    .then(() => {
                      survey.completed = true;
                      onClose();
                    })
                    .catch(() => {
                      console.log("Survey not submitted");
                    });
                }
                else {
                  confirm({title: "Please first rate all the statements!", hideCancelButton: true});
                }
              }}
              >
              Submit
            </Button>
            <Button
              variant="contained"
              color="secondary"
              disabled={currentTask === survey.tasks.length - 1}
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
          </Box>

        </DialogContent>
    </Dialog>
  );
};

export default RespondentSurveyView;          