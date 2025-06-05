import axios from "axios";
const baseUrl = "http://localhost:8080/api";

export const getSurvey = id => {
  const request = axios.get(`${baseUrl}/surveys/${id}`);
  return request.then(response => response.data);
};

export const getSurveys = () => {
  const request = axios.get(`${baseUrl}/surveys`);
  return request.then(response => response.data);
};

export const createSurvey = survey => {
  const request = axios.request({
    method: "POST",
    baseURL: baseUrl,
    url: `${baseUrl}/surveys`,
    data: survey
  })
  return request.then(response => response.data)
}

export const updateSurvey = (id, survey) => {
  const request = axios.request({
    method: "PUT",
    baseURL: baseUrl,
    url: `${baseUrl}/surveys/${id}`,
    data: survey
  })
  return request.then(response => response.data)
}

export const updateTask = (id, task) => {
  const request = axios.request({
    method: "PUT",
    baseURL: baseUrl,
    url: `${baseUrl}/tasks/${id}`,
    data: task
  })
  return request.then(response => response.data)
}

export const getSurveyType = id => {
  const request = axios.get(`${baseUrl}/surveyTypes/${id}`);
  return request.then(response => response.data);
};

export const getSurveyTypes = () => {
  const request = axios.get(`${baseUrl}/surveyTypes`);
  return request.then(response => response.data);
};

export const getSurveyTypeSurveys = id => {
  const request = axios.get(`${baseUrl}/surveyTypes/${id}/surveys`);
  return request.then(response => response.data);
};

export const createSurveyType = (surveyType) => {
  const request = axios.request({
    method: "POST",
    baseURL: baseUrl,
    url: `${baseUrl}/surveyTypes`,
    data: surveyType
  })
  return request.then(response => response.data)
}

export const updateSurveyType = (id, surveyType) => {
  const request = axios.request({
    method: "PUT",
    baseURL: baseUrl,
    url: `${baseUrl}/surveyTypes/${id}`,
    data: surveyType
  })
  return request.then(response => response.data)
}

export const deleteSurveyType = id => {
  const request = axios.request({
    method: "DELETE",
    baseURL: baseUrl,
    url: `${baseUrl}/surveyTypes/${id}`,
  })
  return request.then(response => response.data)
}

export const updateStatement = (id, statement) => {
  const request = axios.request({
    method: "PUT",
    baseURL: baseUrl,
    url: `${baseUrl}/statements/${id}`,
    data: statement
  })
  return request.then(response => response.data)
}

export const createStatement = statement => {
  const request = axios.request({
    method: "POST",
    baseURL: baseUrl,
    url: `${baseUrl}/statements`,
    data: statement
  })
  return request.then(response => response.data)
}

export const deleteStatement = id => {
  const request = axios.request({
    method: "DELETE",
    baseURL: baseUrl,
    url: `${baseUrl}/statements/${id}`,
  })
  return request.then(response => response.data)
}

export const getPeople = () => {
  const request = axios.get(`${baseUrl}/people`);
  return request.then(response => response.data);
};

export const getPerson = id => {
  const request = axios.get(`${baseUrl}/people/${id}`);
  return request.then(response => response.data);
};

export const createPerson = person => {
  const request = axios.request({
    method: "POST",
    baseURL: baseUrl,
    url: `${baseUrl}/people`,
    data: person
  })
  return request.then(response => response.data)
}

export const updatePerson = (id, person) => {
  const request = axios.request({
    method: "PUT",
    baseURL: baseUrl,
    url: `${baseUrl}/people/${id}`,
    data: person
  })
  return request.then(response => response.data)
}

export const deletePerson = id => {
  const request = axios.request({
    method: "DELETE",
    baseURL: baseUrl,
    url: `${baseUrl}/people/${id}`,
  })
  return request.then(response => response.data)
}

export const getRoles = () => {
  const request = axios.get(`${baseUrl}/roles`);
  return request.then(response => response.data);
};
