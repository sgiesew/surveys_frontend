import React from "react";
import { useState, useEffect } from "react";
import { MaterialReactTable } from "material-react-table";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Visibility as VisibilityIcon,
  Poll as PollIcon
} from "@mui/icons-material";
import { useConfirm } from "material-ui-confirm";
import { useForm, useFieldArray } from "react-hook-form";
import SurveyTypeDetailView from "./SurveyTypeDetailView";
import SelectRespondentsView from "./SelectRespondentsView";
import SurveyTypeResultsView from "./SurveyTypeResultsView";
import { getSurveyType, getSurveyTypes, updateSurveyType, deleteSurveyType, getPeople, getSurveyTypeSurveys } from "../../api/client";

const SurveyTypesView = ({isManager}) => {

  const columns = [
    {
      header: "Name",
      accessorKey: "name",
      enableColumnFilter: false,
      enableSorting: false
    },
    {
      header: "Supervisor",
      id: "supervisor",
      accessorFn: (row) => {
        if (row.person){
          return row.person.realName;
        }
        else {
          return (
            <div>
              <Select
                id="supervisor-select"
                label="Assign"
                value="0"
                onChange={(event) => handleSupervisorMenuChange(event, row.id)}
              >
                <MenuItem disabled key={0} value="0"><em>Assign to</em></MenuItem>
                {people.filter(person => person.roleId >= 2).map( (person, index) => (
                  <MenuItem key={index + 1} value={person.id}>{person.realName}</MenuItem>
                ))}
              </Select>
            </div>
          )
        }
      },
      enableColumnFilter: false,
      enableSorting: false,
    },
    {
      header: "Status",
      id: "status",
      size: 1,
      accessorFn: (row) => {
        if (isManager || row.surveyTypeStatus.usid !== "Assigned"){
          return row.surveyTypeStatus.usid;
        }
        else {
          return (
            <Button
              variant="outlined"
              onClick={() => showRespondentsViewFor(row.id)}
            >
              Start survey
            </Button>
          )
        }
      },
      enableColumnFilter: false,
      enableSorting: false,
    },
    {
      header: "Respondents",
      accessorKey: "num_surveys",
      enableColumnFilter: false,
      enableSorting: false,
      size: 1
    },
    {
      header: "Completed",
      accessorKey: "num_completed",
      enableColumnFilter: false,
      enableSorting: false,
      size: 1
    }
  ];

  const [surveyTypes, setSurveyTypes] = useState([]);
  const [people, setPeople] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [updated, setUpdated] = useState(false);
  
  const [fetchingDetail, setFetchingDetail] = useState(false);
  const [showDetailView, setShowDetailView] = useState(false);
  const [surveyType, setSurveyType] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [wasChanged, setWasChanged] = useState(false);

  const [fetchingResults, setFetchingResults] = useState(false);
  const [showResultsView, setShowResultsView] = useState(false);
  const [tasks, setTasks] = useState([]);

  const { register, getValues, handleSubmit, reset, control, errors } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "statements",
  });
  const confirm = useConfirm();
  const [showRespondentsView, setShowRespondentsView] = useState(false);

  const handleSupervisorMenuChange = (event, row_id) => {
    assignSupervisor(row_id, event.target.value);
  };

  const fetchSurveyTypes = () => {
    setFetching(true);
    getSurveyTypes()
      .then(data => {
        setSurveyTypes(data);
        getPeople()
        .then(data => {
          setPeople(data);
          setFetching(false);
        });
      });
  };

  useEffect(() => {
    fetchSurveyTypes();
  }, [showDetailView, showRespondentsView, updated, isManager]);

  const fetchSurveyType = id => {
    getSurveyType(id)
      .then(surveyType => {
        setSurveyType(surveyType);
        setFetchingDetail(false);
        setIsNew(false);
        reset({statements: surveyType.statements.map( (statement) => {return( {ident: statement.id, text: statement.text } )} )});
        setWasChanged(false);
      });
  };

  const addSurveyType = () => {
    setSurveyType({
        name: "",
        surveyTypeStatusId: 1,
        statements: []
      }
    );
    reset({statements: []});
    setWasChanged(false);
    setIsNew(true);
    setShowDetailView(true);
  };
  
  const handleRemoveSurveyType = id => {
    confirm()
      .then(() => {
        deleteSurveyType(id)
        .then(surveyType => {
          setUpdated(!updated);
          console.log("SurveyType deleted");
        });
      })
      .catch(() => {
        console.log("SurveyType not deleted");
      });
  };

  const handleCloseSurveyType = id => {
    confirm()
      .then(() => {
        const surveyType = {
          surveyTypeStatusId: 4,
          statements: null
        };
        updateSurveyType(id, surveyType)
        .then(data => {
          console.log(`surveyType ${id} updated`);
          setUpdated(!updated);
        });
      })
      .catch(() => {
        console.log("SurveyType not closed");
      });
  }

  const showDetailViewFor = id => {
    fetchSurveyType(id);
    setSurveyType([]);
    setShowDetailView(true);
    setFetchingDetail(true);
  };

  const assignSupervisor = (id, person_id) => {
    if (person_id !== 0){
      const surveyType = {
        personId: person_id,
        surveyTypeStatusId: 2,
        statements: null
      };
      updateSurveyType(id, surveyType)
      .then(data => {
        console.log(`surveyType ${id} updated`);
        setUpdated(!updated);
      });
    }
  }

  const showRespondentsViewFor = id => {
    reset({respondents: []});
    setSurveyType(surveyTypes.find( surveyType => surveyType.id === id));
    setShowRespondentsView(true);
  }

  const fetchSurveysFor = id => {
    getSurveyType(id)
      .then(surveyType => {
        setSurveyType(surveyType);
        getSurveyTypeSurveys(id)
          .then(surveys => {
            var surveyTasks = [];
            surveys.forEach( survey => {
              surveyTasks.push(...survey.tasks);
            });
            console.log(surveyTasks);
            setTasks(surveyTasks);
            setFetchingResults(false);
          });
      });
  };

  const showResultsViewFor = id => {
    fetchSurveysFor(id);
    setTasks([]);
    setShowResultsView(true);
    setFetchingResults(true);
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
      <form>
        <SurveyTypeDetailView
          surveyType={surveyType}
          showDetailView={showDetailView}
          setShowDetailView={setShowDetailView}
          fetchingDetail={fetchingDetail}
          isNew={isNew}
          register={register}
          fields={fields}
          append={append}
          remove={remove}
          getValues={getValues}
          errors={errors}
          handleSubmit={handleSubmit}
          wasChanged={wasChanged}
          setWasChanged={setWasChanged}
        />
      </form>
      <form>
        <SelectRespondentsView
          surveyType={surveyType}
          people={people.filter(person => person.roleId === 1)}
          showRespondentsView={showRespondentsView}
          setShowRespondentsView={setShowRespondentsView}
          register={register}
          getValues={getValues}
        />
      </form>
      <SurveyTypeResultsView
        surveyType={surveyType}
        tasks={tasks}
        showResultsView={showResultsView}
        setShowResultsView={setShowResultsView}
      />
      <MaterialReactTable
        data={surveyTypes}
        columns={columns}
        initialState={{ columnVisibility: { supervisor: isManager } }} 
        getRowId={(row) => row.id}
        enableRowActions={true}
        positionActionsColumn={"last"}
        renderRowActions={({ row }) => (
          <Box>
            <IconButton onClick={() => showDetailViewFor(row.original.id)}>
              {row.original.surveyTypeStatus.usid === "Draft" ? <EditIcon /> : <VisibilityIcon />}
            </IconButton>
            {(row.original.surveyTypeStatus.usid === "Draft" || (isManager && row.original.surveyTypeStatus.usid === "Completed")) && (
              <IconButton onClick={() => handleRemoveSurveyType(row.original.id)}>
                <DeleteIcon />
              </IconButton>
            )}
            {(isManager && row.original.surveyTypeStatus.usid === "Completed") && (
              <IconButton onClick={() => showResultsViewFor(row.original.id)}>
                <PollIcon />
              </IconButton>
            )}
            {(!isManager && row.original.surveyTypeStatus.usid === "Running" && !(row.original.num_completed < row.original.num_surveys)) && (
              <IconButton onClick={() => handleCloseSurveyType(row.original.id)}>
                <CheckCircleIcon />
              </IconButton>
            )}
          </Box>
        )}
        renderTopToolbarCustomActions={() => (
          isManager &&
          <Button
            variant="outlined"
            onClick={() => addSurveyType()}
          >
            New Survey Type
          </Button>
        )}
      />

    </Box>
  );

};

export default SurveyTypesView;