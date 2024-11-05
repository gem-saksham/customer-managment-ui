import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;
 // Adjust to your actual API URL

export const getCustomerContacts = (customerId) => {
  return axios.get(`${API_URL}/contacts/${customerId}`);
};

export const addCustomer = (customerData) => {
  return axios.post(`${API_URL}`, customerData);
};

export const addCustomerContact = (contactData) => {
    return axios.post(`${API_URL}/contact`, contactData); // Use the appropriate endpoint for adding customer contact
  };

export const addCustomerMarket = (marketData) => {
    return axios.post(`${API_URL}/market`, marketData);
  };  

// Service for customer subject
export const addCustomerSubject = (subjectData) => {
    return axios.post(`${API_URL}/subject`, subjectData);
  };  

// Fetch roles from API
export const getRoles = () => {
    return axios.get(`${API_URL}/roles`); // Use the endpoint that provides the list of roles
  };  

export const getCustomerSubjects = () => {
    return axios.get(`${API_URL}/subjects`);
  };  

export const getCustomerMarkets = () => {
    return axios.get(`${API_URL}/markets`);
  };

  // New method for fetching customers with pagination and search
export const getCustomers = (searchTerm = '', page = 0, size = 10) => {
    return axios.get(`${API_URL}/search`, {
      params: {
        searchTerm,
        page,
        size,
      },
    });
  };

export const updateCustomer = (customerId, customerData) => {
    return axios.put(`${API_URL}/update/${customerId}`, customerData);
  };

export const getCustomerContactsById = (customerId) => {
    return axios.get(`${API_URL}/contacts/${customerId}`);
};

export const getCustomerMarketsById = (customerId) => {
    return axios.get(`${API_URL}/markets/${customerId}`);
};

export const getCustomerSubjectsById = (customerId) => {
    return axios.get(`${API_URL}/subjects/${customerId}`);
};  

export const updateCustomerContact = async (customerContactID, contactData) => {
    return await axios.put(`${API_URL}/contact/update/${customerContactID}`, contactData);
  };

// DELETE methods
export const deleteCustomerContact = (customerContactID) => {
    return axios.delete(`${API_URL}/contact/${customerContactID}`);
  };
  
export const deleteCustomerMarket = (customerId, market, marketSubCategory) => {
    return axios.delete(`${API_URL}/market/${customerId}/${market}/${marketSubCategory}`);
  };
  
export const deleteCustomerSubject = (customerId, subjectName, subjectCategory) => {
    return axios.delete(`${API_URL}/subject/${customerId}/${subjectName}/${subjectCategory}`);
  };  