import React from "react";
import { useState, useEffect } from "react";
import { MaterialReactTable } from "material-react-table";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { getSurvey, getSurveys } from "../../api/client";
import RespondentSurveyView from "./RespondentSurveyView";
import SupervisorSurveyView from "./SupervisorSurveyView";
import { useForm } from "react-hook-form";

const columns = [
  {
    header: "Name",
    accessorKey: "surveyType.name",
    enableColumnFilter: false,
    enableSorting: false
  },
  {
    header: "Statements",
    accessorKey: "num_tasks",
    enableColumnFilter: false,
    enableSorting: false
  },
  {
    header: "Rated",
    accessorKey: "num_completed",
    enableColumnFilter: false,
    enableSorting: false
  },
  {
    header: "Submitted",
    accessorFn: (row) => row.completed.toString(),
    enableColumnFilter: false,
    enableSorting: false
  }
];

const SurveysView = ({respondent}) => {

  const [surveys, setSurveys] = useState([]);
  const [fetching, setFetching] = useState(true);

  const [fetchingDetail, setFetchingDetail] = useState(false);
  const [showDetailView, setShowDetailView] = useState(false);
  const [survey, setSurvey] = useState(null);
  const [currentTask, setCurrentTask] = useState(0);
  
  const { register, getValues, handleSubmit, reset } = useForm();
  const onSubmit = data => console.log(data);

  const fetchSurveys = () => {
    setFetching(true);
    getSurveys()
      .then(data => {
        setSurveys(data);
        setFetching(false);
      });
  };

  useEffect(() => {
    fetchSurveys();
  }, [showDetailView]);

  const fetchSurvey = id => {
    getSurvey(id)
      .then(survey => {
        setSurvey(survey);
        setFetchingDetail(false);
        setCurrentTask(survey.current_task);
        reset({response: survey.tasks.map(task => task.response)});
      });
  };

  const showDetailViewFor = id => {
    fetchSurvey(id);
    setSurvey([]);
    setShowDetailView(true);
    setFetchingDetail(true);
  };

  if (fetching) {
    return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <CircularProgress />
    </Box>
    );
  };
  
  return (
    <Box sx={{ m: 2 }}>
      {respondent ?
        <form onSubmit={handleSubmit(onSubmit)}>
          <RespondentSurveyView
            survey={survey}
            showDetailView={showDetailView}
            setShowDetailView={setShowDetailView}
            fetchingDetail={fetchingDetail}
            currentTask={currentTask}
            setCurrentTask={setCurrentTask}
            register={register}
            getValues={getValues}
          />
        </form>
        :
        <SupervisorSurveyView
          survey={survey}
          showDetailView={showDetailView}
          setShowDetailView={setShowDetailView}
          fetchingDetail={fetchingDetail}
        />
      }
      <MaterialReactTable
        data={surveys}
        columns={columns}
        getRowId={(row) => row.id}
        muiTableBodyRowProps={({ row }) => ({
          onClick: () => {
            showDetailViewFor(row.original.id);
          },
          sx: {
            cursor: "pointer",
          },
        })}
      />
    </Box>
  );


};

export default SurveysView;