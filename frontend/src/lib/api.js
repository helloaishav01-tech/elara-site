import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API, headers: { "Content-Type": "application/json" } });

export const subscribeNewsletter = (email, name) =>
  api.post("/newsletter", { email, name }).then(r => r.data);

export const fetchReviews = () => api.get("/reviews").then(r => r.data);
export const fetchReviewSummary = () => api.get("/reviews/summary").then(r => r.data);
export const submitReview = (payload) => api.post("/reviews", payload).then(r => r.data);
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';