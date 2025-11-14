    // src/services/ApiService.js
    import axios from 'axios';

    const API_URL = 'http://127.0.0.1:8000/api/v1/auth';

    export const fetchData = async (endpoint) => {
      try {
        const response = await axios.get(`${API_URL}/${endpoint}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
      }
    };

    export const postData = async (endpoint, data) => {
      try {
        const response = await axios.post(`${API_URL}/${endpoint}`, data);
        return response.data;
      } catch (error) {
        console.error('Error posting data:', error);
        throw error;
      }
    };