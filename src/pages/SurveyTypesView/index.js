import React from "react";
import { useState, useEffect } from "react";
import { MaterialReactTable } from "material-react-table";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useConfirm } from "material-ui-confirm";
import { getSurveyType, getSurveyTypes, deleteSurveyType } from "../../api/client";
import SurveyTypeDetailView from "./SurveyTypeDetailView";
import { useForm, useFieldArray } from "react-hook-form";

const columns = [
  {
    header: "Name",
    accessorKey: "name",
    enableColumnFilter: false,
    enableSorting: false
  }
];

const SurveyTypesView = ({edit}) => {

  const [surveyTypes, setSurveyTypes] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [updated, setUpdated] = useState(false);

  const [fetchingDetail, setFetchingDetail] = useState(false);
  const [showDetailView, setShowDetailView] = useState(false);
  const [surveyType, setSurveyType] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [wasChanged, setWasChanged] = useState(false);

  const { register, getValues, handleSubmit, reset, control, errors } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "statements",
  });
  const [wasDeleted, setWasDeleted] = useState(false);
  const confirm = useConfirm();

  const fetchSurveyTypes = () => {
    setFetching(true);
    getSurveyTypes()
      .then(data => {
        setSurveyTypes(data);
        setFetching(false);
      });
  };

  useEffect(() => {
    fetchSurveyTypes();
  }, [showDetailView]);

  const fetchSurveyType = id => {
    getSurveyType(id)
      .then(surveyType => {
        setSurveyType(surveyType);
        setFetchingDetail(false);
        setIsNew(false);
        reset({statements: surveyType.statements.map( (statement) => {return( {ident: statement.id, text: statement.text } )} )});
        setWasChanged(false);
        setWasDeleted(false);
      });
  };

  const addSurveyType = () => {
    setSurveyType([]);
    reset({statements: []});
    setWasChanged(false);
    setWasDeleted(false);
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

  const showDetailViewFor = id => {
    fetchSurveyType(id);
    setSurveyType([]);
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
      <form >
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
          wasDeleted={wasDeleted}
          setWasDeleted={setWasDeleted}
          wasChanged={wasChanged}
          setWasChanged={setWasChanged}
        />
      </form>
      <MaterialReactTable
        data={surveyTypes}
        columns={columns}
        getRowId={(row) => row.id}
        enableRowActions={true}
        positionActionsColumn={"last"}
        renderRowActions={({ row }) => (
          edit &&
          <Box>
            <IconButton onClick={() => showDetailViewFor(row.original.id)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleRemoveSurveyType(row.original.id)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        )}
        renderTopToolbarCustomActions={() => (
          edit &&
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