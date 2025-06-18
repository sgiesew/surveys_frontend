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
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
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

  if (fetchingResults || tasks.length === 0 || !surveyType) {
    return (
      <Dialog
        fullWidth
        maxWidth="lg"
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
      maxWidth="xl"
      open={showResultsView}
      onClose={onClose}
    >
      <DialogTitle
        sx={{ m: 0, p: 0 }}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar variant="dense">
            <Typography sx={{ flex: 1 }} variant="h6" component="div">
              {surveyType.name} ({surveyType.num_surveys} respondents)
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
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell><b>Statement</b></TableCell>
                  {ratingScale.filter( (rating, index) => index > 0).map( (rating) => 
                    <TableCell align="right"><b>"{rating}"</b></TableCell>
                  )}
              </TableRow>
            </TableHead>
            <TableBody>
              {surveyType.statements.map( (statement, index) => (
                <TableRow
                  key={index}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    "{statement.text}."
                  </TableCell>
                  {ratingScale.filter( (rating, index) => index > 0).map( (rating, i) => 
                    <TableCell align="center">{tasks.filter( task => task.number === index && task.response === i + 1).length}</TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>


        {/*}
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
              <Grid xs={4}>
                <Box>
                  <Typography>
                    ({index + 1}) {statement.text}.
                  </Typography>
                </Box>
              </Grid>
              <Grid xs={8}>
                <Grid container spacing={0} key={index}>
                  {ratingScale.map( (rating, i) => {
                    if (i === 0)
                      return (<div key={i}></div>);
                    else return (
                      <Grid xs={2} sx={{ mx: 1}} key={i}>
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
        {*/}
      </DialogContent>
    </Dialog>
  );
};

export default SurveyTypeResultsView;          