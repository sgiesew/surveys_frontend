import request from "../utils/request.js";

const baseUrl = "http://localhost:8080/api";

export const getSurvey = (id) => {
  return request({
    method: "GET",
    url: baseUrl + "/surveys/" + id,
  });
};

export const getSurveys = () => {
  return request({
    method: "GET",
    url: baseUrl + "/surveys",
  });
};

export const createSurvey = (survey) => {
  return request({
    method: "POST",
    url: baseUrl + "/surveys/",
    data: survey
  });
};

export const updateSurvey = (id, survey) => {
  return request({
    method: "PUT",
    url: baseUrl + "/surveys/" + id,
    data: survey
  });
};


export const updateTask = (id, task) => {
  return request({
    method: "PUT",
    url: baseUrl + "/tasks/" + id,
    data: task
  });
};

export const getSurveyType = (id) => {
  return request({
    method: "GET",
    url: baseUrl + "/surveyTypes/" + id,
  });
};

export const getSurveyTypes = () => {
  return request({
    method: "GET",
    url: baseUrl + "/surveyTypes/",
  });
};

export const getSurveyTypeSurveys = (id) => {
  return request({
    method: "GET",
    url: baseUrl + `/surveyTypes/${id}/surveys`,
  });
};

export const createSurveyType = (surveyType) => {
  return request({
    method: "POST",
    url: baseUrl + "/surveyTypes/",
    data: surveyType
  });
};

export const updateSurveyType = (id, surveyType) => {
  return request({
    method: "PUT",
    url: baseUrl + "/surveyTypes/" + id,
    data: surveyType
  });
};

export const deleteSurveyType = (id) => {
  return request({
    method: "DELETE",
    url: baseUrl + "/surveyTypes/" + id,
  });
};

export const updateStatement = (id, statement) => {
  return request({
    method: "PUT",
    url: baseUrl + "/statements/" + id,
    data: statement
  });
};

export const createStatement = (statement) => {
  return request({
    method: "POST",
    url: baseUrl + "/statements/",
    data: statement
  });
};

export const deleteStatement = (id) => {
  return request({
    method: "DELETE",
    url: baseUrl + "/statements/" + id,
  });
};

export const getPeople = () => {
  return request({
    method: "GET",
    url: baseUrl + "/people",
  });
};

export const getPerson = (id) => {
  return request({
    method: "GET",
    url: baseUrl + "/people/" + id,
  });
};

export const createPerson = (person) => {
  return request({
    method: "POST",
    url: baseUrl + "/people/",
    data: person
  });
};

export const loginPerson = (person) => {
  return request({
    method: "POST",
    url: baseUrl + "/people/login",
    data: person
  });
};

export const updatePerson = (id, person) => {
  return request({
    method: "PUT",
    url: baseUrl + "/people/" + id,
    data: person
  });
};

export const deletePerson = (id) => {
  return request({
    method: "DELETE",
    url: baseUrl + "/people/" + id,
  });
};

export const getRoles = () => {
  return request({
    method: "GET",
    url: baseUrl + "/roles",
  });
};
