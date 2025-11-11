import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export const registerUser = async (name, email) => {
  return axios.post(`${API_URL}/users/`, { name, email });
};

export const loginUser = async (abone_no) => {
  // AB- ekleniyor
  const fullAboneNo = abone_no.startsWith("AB-") ? abone_no : `AB-${abone_no}`;
  return axios.get(`${API_URL}/users/abone/${fullAboneNo}`);
};

export const getBills = async (user_id) => {
  return axios.get(`${API_URL}/bills/user/${user_id}`);
};

export const payBill = async (bill_id) => {
  return axios.put(`${API_URL}/bills/${bill_id}/pay`);
};

export default API_URL;