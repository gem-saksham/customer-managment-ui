import React, { useState, useEffect } from 'react';
import { updateCustomerContact, getRoles } from '../services/customerService'; // Import update method
import '../css/Form.css'; // Import the CSS file for styling

const CustomerContactUpdateForm = ({ contact, onClose, onUpdate }) => {
  const [contactData, setContactData] = useState(contact); // Initialize with contact data
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [roles, setRoles] = useState([]); 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactData({ ...contactData, [name]: value }); // Update the respective field
  };

  useEffect(() => {
    const fetchRoles = async () => {
        try {
            const response = await getRoles(); 
            setRoles(response.data.object); 
        } catch (error) {
            setError('Failed to fetch roles');
        }
    };

    fetchRoles();
}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateCustomerContact(contact.customerContactID, contactData); // Call the update API
      setSuccess('Contact updated successfully');
      setError(null);
      onUpdate({ ...contactData, customerContactID: contact.customerContactID }); // Update the contact in the parent component
      onClose(); // Close the modal after success
    } catch (error) {
      setError('Failed to update contact');
      setSuccess(null);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Update Contact</h2>
      <form onSubmit={handleSubmit} className="customer-form">
      <div className="form-group">
    <label>Salutation</label>
    <select
        name="salutation"
        value={contactData.salutation}
        onChange={handleInputChange}
        required
        style={{ padding: '10px', width: '100%', borderRadius: '5px' }}
    >
        <option value="">Select a salutation</option>
        <option value="Mr">Mr</option>
        <option value="Ms">Ms</option>
        <option value="Dr">Dr</option>
        <option value="Professor">Professor</option>
        {/* Add more options if needed */}
    </select>
</div>
        <div className="form-group">
          <label>First Name</label>
          <input type="text" name="firstName" value={contactData.firstName} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Middle Name</label>
          <input type="text" name="middleName" value={contactData.middleName} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input type="text" name="lastName" value={contactData.lastName} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Designation</label>
          <input type="text" name="designation" value={contactData.designation} onChange={handleInputChange} />
        </div>
        <div className="form-group" style={{ marginBottom: '30px' }}>
    <label>Role</label>
    
    <select
        name="role"
        value={contactData.role} // Bind value to state
        onChange={(e) => {
            const selectedRole = e.target.value;
            setContactData((prevData) => ({
                ...prevData,
                role: selectedRole,
                // If 'Others' is selected, clear the input field
                ...(selectedRole === 'Others' && { roleInput: '' })
            }));
        }}
        required
        style={{ padding: '10px', width: '100%', borderRadius: '5px' }}
    >
        <option value="">Select a role</option>
        {roles.map((role, index) => (
            <option key={index} value={role}>
                {role}
            </option>
        ))}
        <option value="Others">Others</option>
    </select>

    {contactData.role === 'Others' && (
        <input
            type="text"
            name="roleInput"
            value={contactData.roleInput || ''} // Bind input value to a separate state
            onChange={(e) => setContactData({ ...contactData, roleInput: e.target.value })} // Update input value
            placeholder="Type your role"
            required
            style={{ marginTop: '10px', padding: '10px', width: '100%', borderRadius: '5px' }}
        />
    )}
</div>
        <div className="form-group">
          <label>Email Address 1</label>
          <input type="email" name="emailAddressOne" value={contactData.emailAddressOne} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Email Address 2</label>
          <input type="email" name="emailAddressTwo" value={contactData.emailAddressTwo} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label>Official Email</label>
          <input type="email" name="officialEmail" value={contactData.officialEmail} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label>Mobile Number 1</label>
          <input type="text" name="mobileOne" value={contactData.mobileOne} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Mobile Number 2</label>
          <input type="text" name="mobileTwo" value={contactData.mobileTwo} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label>Skype ID</label>
          <input type="text" name="skypeId" value={contactData.skypeId} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label>LinkedIn Link</label>
          <input type="url" name="linkedInLink" value={contactData.linkedInLink} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label>Date of Birth</label>
          <input type="date" name="dateOfBirth" value={contactData.dateOfBirth} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label>Contact Subject Keyword</label>
          <input type="text" name="contactSubjectKeyword" value={contactData.contactSubjectKeyword} onChange={handleInputChange} />
        </div>

        <button type="submit" className="submit-btn">Update Contact</button>
        {success && <p className="success-message">{success}</p>}
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default CustomerContactUpdateForm;
