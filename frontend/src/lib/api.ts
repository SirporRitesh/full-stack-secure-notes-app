import axios from "axios";

// Create an Axios instance with withCredentials enabled
const api = axios.create({
  baseURL: "http://localhost:4000", // Change if your backend runs elsewhere
  withCredentials: true, // Send cookies with every request
});

export default api;