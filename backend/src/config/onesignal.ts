import axios from 'axios';

const onesignal = axios.create({
  baseURL: 'https://onesignal.com/api/v1',
  headers: {
    Authorization: 'Basic ' + process.env.ONESIGNAL_REST_API_KEY,
    'Content-Type': 'application/json'
  }
});

export default onesignal;
