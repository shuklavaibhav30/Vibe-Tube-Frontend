import axios from 'axios';

const API = axios.create({
    baseURL: 'https://video-tube-backend-zeqq.onrender.com/api/v1',
    withCredentials: true,
});

export default API;