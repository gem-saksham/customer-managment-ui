import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { getCustomerContactsById, getCustomerMarketsById, getCustomerSubjectsById, deleteCustomerContact, deleteCustomerSubject, deleteCustomerMarket} from '../services/customerService'; // Import APIs for fetching data
import '../css/Dashboard.css';
import Model from './Model'; // Import the Model component
import CustomerContactForm from './customerContactForm'; // Form component for adding contact
import CustomerMarketForm from './customerMarketForm'; // Form component for adding market
import CustomerSubjectForm from './customerSubjectForm'; // Form component for adding subject
import CustomerContactUpdateForm from './customerUpdateContactForm';

const CustomerDashboard = () => {
  const { customerId } = useParams(); // Get the customerId from the URL
  const location = useLocation(); // Use location to access the passed state
  const customerName = location.state?.customerName; // Access the customerName from state

  const [contacts, setContacts] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState(null); // Error state for debugging

  // State for Model visibility
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [modelType, setModelType] = useState(''); // can be 'contact', 'market', or 'subject'

  const [selectedContact, setSelectedContact] = useState(null);

  // Fetch customer contacts, markets, and subjects
  const fetchCustomerData = async () => {
    try {
      const contactResponse = await getCustomerContactsById(customerId);
      const marketResponse = await getCustomerMarketsById(customerId);
      const subjectResponse = await getCustomerSubjectsById(customerId);

      setContacts(contactResponse?.data?.object || []); // Set contacts data or empty array if null
      setMarkets(marketResponse?.data?.object || []); // Set markets data or empty array if null
      setSubjects(subjectResponse?.data?.object || []); // Set subjects data or empty array if null
    } catch (error) {
      console.error("Failed to fetch customer details:", error);
      setError('Failed to fetch customer details.'); // Set error state
    }
  };

  // Fetch customer data on mount
  useEffect(() => {
    fetchCustomerData();
  }, [customerId]);

  // Function to open the Model
   const openModel = (type, contact) => {
    setModelType(type);
    setSelectedContact(contact);
    setIsModelOpen(true);
  };

  // Function to close the Model
  const closeModel = () => {
    setIsModelOpen(false);
    setSelectedContact(null);

    if (modelType === 'market' || modelType === 'subject' ||  modelType === 'contact' ) {
        fetchCustomerData(); // Refresh the data
      }
  };

  const handleContactUpdate = (updatedContact) => {
    setContacts(prevContacts => 
      prevContacts.map(contact => 
        contact.customerContactID === updatedContact.customerContactID ? updatedContact : contact
      )
    );
  };



  // Function to delete a customer contact
  const handleDeleteContact = async (contactId) => {
    try {
      const response = await deleteCustomerContact(contactId);
      if (response.status === 200) {
        setContacts(contacts.filter(contact => contact.customerContactID !== contactId)); // Remove the deleted contact
      } else {
        setError(response.message); // Handle error message
      }
    } catch (error) {
      console.error("Failed to delete contact:", error);
      setError('Failed to delete contact');
    }
  };

  // Function to delete a customer market
  const handleDeleteMarket = async (market, subCategory) => {
    try {
      const response = await deleteCustomerMarket(customerId, market, subCategory);
      if (response.status === 200) {
        setMarkets(markets.filter(m => m.customerMarket !== market || m.customerMarketSubCategory !== subCategory)); // Remove the deleted market
      } else {
        setError(response.message); // Handle error message
      }
    } catch (error) {
      console.error("Failed to delete market:", error);
      setError('Failed to delete market');
    }
  };

  // Function to delete a customer subject
  const handleDeleteSubject = async (subjectName, subCategory) => {
    try {
      const response = await deleteCustomerSubject(customerId, subjectName, subCategory);
      if (response.status === 200) {
        setSubjects(subjects.filter(s => s.subjectName !== subjectName || s.subjectNameSubCategory !== subCategory)); // Remove the deleted subject
      } else {
        setError(response.message); // Handle error message
      }
    } catch (error) {
      console.error("Failed to delete subject:", error);
      setError('Failed to delete subject');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="top-left-link">
        <Link to="/" className="dashboard-btn">Back</Link>
      </div>
      <h2>Customer Dashboard</h2>
      <p>Customer ID: {customerId}</p>
      {customerName && <p>Customer Name: {customerName}</p>} {/* Display customer name */}

      {error && <p className="error-message">{error}</p>} {/* Display error message */}

      <div className="action-buttons">
        <button onClick={() => openModel('contact')} className="dashboard-btn">Add New Contact</button>
      </div>

      <div className="customer-section">
        <h3>Customer Contacts</h3>
        {contacts.length === 0 ? (
          <p>No contacts added yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Contact Name</th>
                <th>Role</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map(contact => (
                <tr key={contact.customerContactID}>
                  <td>{ contact.salutation + ' ' + contact.firstName + ' ' + contact.lastName}</td>
                  <td>
                    {contact.role === 'Others' ? (
                    <td>{contact.roleInput}</td>
                        ) : (
                    <td>{contact.role}</td>
                    )}
                  </td>
                  <td>{contact.emailAddressOne}</td>
                  <td>{contact.mobileOne}</td>
                  <td>
                    <button onClick={() => openModel('update-contact', contact)} className="update-button">Update</button>
                    <button onClick={() => handleDeleteContact(contact.customerContactID)} className="delete-button">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="action-buttons">
        <button onClick={() => openModel('market')} className="dashboard-btn">Add New Market</button>
      </div>

      <div className="customer-section">
        <h3>Customer Markets</h3>
        {markets.length === 0 ? (
          <p>No markets added yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Market Name</th>
                <th>Subcategory</th>
                <th>Action</th>
                {/* <th>Actions</th> */}
              </tr>
            </thead>
            <tbody>
              {markets.map(market => (
                <tr key={market.customerMarketID}>
                  <td>{market.customerMarket}</td>
                  <td>{market.customerMarketSubCategory}</td>
                  <td>
                    <button onClick={() => handleDeleteMarket(market.customerMarket, market.customerMarketSubCategory)} className="delete-button">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="action-buttons">
        <button onClick={() => openModel('subject')} className="dashboard-btn">Add New Subject</button>
      </div>

      <div className="customer-section">
        <h3>Customer Subjects</h3>
        {subjects.length === 0 ? (
          <p>No subjects added yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Subject Name</th>
                <th>Subcategory</th>
                <th>Action</th>
                {/* <th>Actions</th> */}
              </tr>
            </thead>
            <tbody>
              {subjects.map(subject => (
                <tr key={subject.customerSubjectID}>
                  <td>{subject.subjectName}</td>
                  <td>{subject.subjectNameSubCategory}</td>
                  <td>
                    <button onClick={() => handleDeleteSubject(subject.subjectName, subject.subjectNameSubCategory)} className="delete-button">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Model for adding new information */}
      <Model isOpen={isModelOpen} onClose={closeModel}>
        {modelType === 'contact' && <CustomerContactForm customerId={customerId} customerName={customerName} onClose={closeModel} />}
        {modelType === 'market' && <CustomerMarketForm customerId={customerId} customerName={customerName} onClose={closeModel} />}
        {modelType === 'subject' && <CustomerSubjectForm customerId={customerId} customerName={customerName} onClose={closeModel} />}
        {modelType === 'update-contact' && selectedContact && 
          <CustomerContactUpdateForm contact={selectedContact} onClose={closeModel} onUpdate={handleContactUpdate} />}
      </Model>
    </div>
  );
};

export default CustomerDashboard;
