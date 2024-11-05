import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCustomers } from '../services/customerService'; // Import the getCustomers service
import '../css/LandingPage.css'; // Import your CSS for styling
import Model from './Model'; // Import the Model component
import CustomerUpdateForm from './customerUpdateForm'; // Assuming this is the form component for updating customers
import CustomerForm from './customerForm';

const CustomerLandingPage = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(null);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const [modelType, setModelType] = useState(''); // Define modelType state
  const navigate = useNavigate(); // Add the useNavigate hook
  

  // Fetch customers when the component mounts or when the search term changes
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await getCustomers(searchTerm, page);
        const customersData = response.data.object.customers || []; // Access the customers array
        setCustomers(customersData);
        setTotalPages(response.data.object.totalPages || 0); // Access totalPages from the response
      } catch (err) {
        setError('Failed to fetch customers');
        setCustomers([]); // Clear customers on error
      }
    };

    fetchCustomers();
  }, [searchTerm, page]); // Add page to dependencies

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(0); // Reset to first page on search
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) {
      setPage(prevPage => prevPage + 1); // Move to next page
    }
  };

  const handlePreviousPage = () => {
    if (page > 0) {
      setPage(prevPage => prevPage - 1); // Move to previous page
    }
  };

  // Function to open the Model for updating customer
  const handleUpdateClick = (customer) => {
    setSelectedCustomer(customer);
    setIsModelOpen(true); // Open modal
  };

  // Function to close the Model
  const closeModel = () => {
    setIsModelOpen(false);
    setSelectedCustomer(null); // Clear the selected customer
    setModelType(''); // Reset model type
  };

  const updateCustomerInState = (updatedCustomer) => {
    setCustomers((prevCustomers) =>
      prevCustomers.map((customer) =>
        customer.customerId === updatedCustomer.customerId ? updatedCustomer : customer
      )
    );
  };

  const handleRowClick = (customerId, customerName) => {
    navigate(`/dashboard/${customerId}`, { state: { customerName } }); // Navigate to the dashboard for the selected customer
  };

  // Function to open the modal for adding a new customer
  const handleAddCustomerClick = () => {
    setSelectedCustomer(null); // Clear selected customer
    setModelType('add'); // Set model type to 'add'
    setIsModelOpen(true);
  };

  // Handle success message
  const handleSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage(''); // Clear message after 3 seconds
    }, 3000);
  };

  return (
    <div className="landing-page">
      <h1 style={{ textAlign: 'center' }}>Customer Management</h1> {/* Centered heading */}
      
      {/* Success Message */}
      {successMessage && <div className="success-message">{successMessage}</div>}

      {/* Add Customer Button */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button onClick={handleAddCustomerClick} className="add-customer-button">Add Customer</button>
      </div>

      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Search by name or email..." 
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      
      {error && <p className="error-message">{error}</p>}
      
      <div className="customer-table">
        <table>
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Abbreviation</th>
              <th>State</th>
              <th>City</th>
              <th>Email</th>
              <th>Website</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.customerId} onClick={() => handleRowClick(customer.customerId, customer.customerName)} style={{ cursor: 'pointer' }}>
                <td>{customer.customerName}</td>
                <td>{customer.customerAbbreviation}</td>
                <td>{customer.state}</td>
                <td>{customer.city}</td>
                <td>{customer.officialEmail}</td>
                <td>
                  <a href={customer.website} target="_blank" rel="noopener noreferrer">{customer.website}</a>
                </td>
                <td>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent row click
                      handleUpdateClick(customer); // Open modal for update
                    }} 
                    className="update-button"
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={page === 0}>Previous</button>
        <span>Page {page + 1} of {totalPages}</span>
        <button onClick={handleNextPage} disabled={page >= totalPages - 1}>Next</button>
      </div>

      {/* Modal for updating customer */}
      <Model isOpen={isModelOpen} onClose={closeModel}>
        {selectedCustomer && <CustomerUpdateForm customer={selectedCustomer} onClose={closeModel} onUpdate={updateCustomerInState} onSuccess={handleSuccess} />} {/* Pass the selected customer */}
        {modelType === 'add' && <CustomerForm onClose={closeModel} />} {/* Render CustomerForm for adding new customers */}
      </Model>
    </div>
  );
};

export default CustomerLandingPage;
