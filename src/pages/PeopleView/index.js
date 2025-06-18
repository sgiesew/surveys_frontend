import React from "react";
import { useState, useEffect } from "react";
import { MaterialReactTable } from "material-react-table";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import {
  Edit as EditIcon,
  Delete as DeleteIcon
} from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { useConfirm } from "material-ui-confirm";
import { getPeople, getPerson, deletePerson, getRoles } from "../../api/client";
import PersonDetailView from "./PersonDetailView";

const PeopleView = () => {

  const columns = [
    {
      header: "Name",
      accessorKey: "fullName",
      enableColumnFilter: false,
      enableSorting: false
    },
    {
      header: "Role",
      accessorKey: "role.usid",
      enableColumnFilter: false,
      enableSorting: false
    }
  ];

  const [people, setPeople] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [updated, setUpdated] = useState(false);
  
  const [fetchingDetail, setFetchingDetail] = useState(false);
  const [showDetailView, setShowDetailView] = useState(false);
  const [person, setPerson] = useState(null);
  const [roles, setRoles] = useState([]);
  const [isNew, setIsNew] = useState(false);
  const [wasChanged, setWasChanged] = useState(false);
  const { register, getValues, handleSubmit, reset } = useForm();
  const confirm = useConfirm();

  const fetchPeople = () => {
    setFetching(true);
    getPeople()
      .then(res => {
        setPeople(res.data);
        getRoles()
          .then(res => {
            setRoles(res.data);
            setFetching(false);
          });
      });
  };

  useEffect(() => {
    fetchPeople();
  }, [showDetailView, updated]);

  const fetchPerson = id => {
    getPerson(id)
      .then(res => {
        setPerson(res.data);
        setFetchingDetail(false);
        setIsNew(false);
      });
  };

  const addPerson = () => {
    setPerson({
      realName: "",
      username: "",
      password: "",
      roleId: 1
    });
    setIsNew(true);
    reset();
    setWasChanged(false);
    setShowDetailView(true);
  };
  
  const handleRemovePerson = id => {
    confirm()
      .then(() => {
        deletePerson(id)
        .then(surveyType => {
          setUpdated(!updated);
          console.log("Person deleted");
        });
      })
      .catch(() => {
        console.log("Person not deleted");
      });
  };

  const showDetailViewFor = id => {
    fetchPerson(id);
    setPerson([]);
    reset();
    setWasChanged(false);
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
      <form>
        <PersonDetailView
          person={person}
          showDetailView={showDetailView}
          setShowDetailView={setShowDetailView}
          fetchingDetail={fetchingDetail}
          isNew={isNew}
          roles={roles}
          register={register}
          getValues={getValues}
          wasChanged={wasChanged}
          setWasChanged={setWasChanged}
        />
      </form>
      <MaterialReactTable
        data={people}
        columns={columns}
        getRowId={(row) => row.id}
        enableRowActions={true}
        positionActionsColumn={"last"}
        renderRowActions={({ row }) => {
            return (
              <Box>
                <IconButton onClick={() => showDetailViewFor(row.original.id)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleRemovePerson(row.original.id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            )
        }}
        renderTopToolbarCustomActions={() => (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => addPerson()}
          >
            New User
          </Button>
        )}
      />

    </Box>
  );

};

export default PeopleView;