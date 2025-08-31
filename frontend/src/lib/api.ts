import axios from "axios";

// Create an Axios instance with withCredentials enabled
const api = axios.create({
  baseURL: `${process.env.VITE_API_URL}`, // Change if your backend runs elsewhere
  withCredentials: true, // Send cookies with every request
});

export default api;