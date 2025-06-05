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
  "Neither",
  "Somewhat disagree",
  "Strongly disagree"
];

const SurveyTypeResultsView = (props) => {
  const { surveyType, tasks, showResultsView, setShowResultsView, fetchingResults} = props;

  const onClose = () => {
    setShowResultsView(false);
  };

  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
  });

  if (fetchingResults || tasks.length === 0) {
    return (
      <Dialog
        fullScreen
        TransitionComponent={fetchingResults ? Transition : undefined}
        open={showResultsView}
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
      open={showResultsView}
      onClose={onClose}
    >
      <DialogTitle
        sx={{ m: 0, p: 0 }}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar variant="dense">
            <Typography sx={{ flex: 1 }} variant="h6" component="div">
              {surveyType.name}
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
                Responses
              </Typography>
            </Box>
          </Grid>
        </Grid>
        {surveyType.statements.map( (statement, index) => (
            <Grid container spacing={0} key={index}>
              <Grid xs={2}>
                <Box>
                  <Typography>
                    ({index + 1}) {statement.text}.
                  </Typography>
                </Box>
              </Grid>
              <Grid xs={10}>
                <Grid container spacing={0} key={index}>
                  {ratingScale.map( (rating, i) => {
                    if (i === 0)
                      return (<div></div>);
                    else return (
                      <Grid xs={2} sx={{ m: 1}}>
                        <Box>
                          <Typography>
                            {rating}
                          </Typography>
                          <Typography>
                              {tasks.filter( task => task.number === index && task.response === i).length}
                          </Typography>
                        </Box>
                      </Grid>
                  )})}
                </Grid>
              </Grid>
            </Grid>
        )
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SurveyTypeResultsView;          