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
import Slide from "@mui/material/Slide";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { useTheme } from "@mui/material/styles";

const ratingScale = [
  "[no answer]",
  "Strongly agree",
  "Somewhat agree",
  "Neither agree nor disagree",
  "Somewhat disagree",
  "Strongly disagree"
];

const SupervisorSurveyView = (props) => {
  const { survey, showDetailView, setShowDetailView, fetchingDetail} = props;

  const onClose = () => {
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
      fullWidth
      maxWidth="sm"
      open={showDetailView}
      onClose={onClose}
    >
      <DialogTitle
        sx={{ m: 0, p: 0 }}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar variant="dense">
            <Typography sx={{ flex: 1 }} variant="h6" component="div">
              {survey.surveyType.name} ({survey.completed ? <>submitted</> : <>{survey.num_completed} / {survey.num_tasks}</>})
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
        sx={{ m: 2 }}
      >
        <Grid container spacing={0}>
          <Grid xs={6}>
            <Box>
              <Typography variant="h6">
                Statement
              </Typography>
            </Box>
          </Grid>
          <Grid xs={6}>
            <Box>
              <Typography variant="h6">
                Response
              </Typography>
            </Box>
          </Grid>
        </Grid>
        {survey.tasks.map( (task, index) => (
            <Grid container spacing={0} key={index}>
              <Grid xs={6}>
                <Box>
                  <Typography>
                    ({index + 1}) {survey.surveyType.statements[index].text}.
                  </Typography>
                </Box>
              </Grid>
              <Grid xs={6}>
                <Box>
                  <Typography>
                    "{ratingScale[task.response]}"
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          )
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SupervisorSurveyView;          