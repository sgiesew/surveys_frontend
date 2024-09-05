import axios from 'axios';
const baseUrl = 'http://localhost:8080/api';

export const getSurvey = id => {
  const request = axios.get(`${baseUrl}/surveys/${id}`);
  return request.then(response => response.data);
};

export const getSurveys = () => {
  const request = axios.get(`${baseUrl}/surveys`);
  return request.then(response => response.data);
};

export const updateTask = (id, task) => {
  const {surveyId, number, response} = task;
  const request = axios.request({
    method: 'PUT',
    baseURL: baseUrl,
    url: `${baseUrl}/tasks/${id}`,
    data: {
      surveyId,
      number,
      response
    }
  })
  return request.then(response => response.data)
}
