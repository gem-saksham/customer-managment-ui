import React, { useState } from 'react';  // Import necessary libraries
import { useNavigate } from 'react-router-dom';  // Import useNavigate for navigation
import { updateCustomer } from '../services/customerService';  // Import the update method
import '../css/Form.css';  // Import the CSS file for styling

const CustomerUpdateForm = ({ customer, onClose, onUpdate  }) => {  // Accept customer and onClose props
  const navigate = useNavigate(); // Initialize useNavigate
  const [customerData, setCustomerData] = useState(customer); // Initialize with customer data

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerData({ ...customerData, [name]: value }); // Update the respective field
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 
    try {
      // Use the customerId directly from the customer object
      const customerId = customer.customerId; 
      await updateCustomer(customerId, customerData);  // Call the update API with customer ID and data
      setSuccess('Customer updated successfully');
      setError(null);
      onUpdate({ ...customerData, customerId });
      onClose();  // Close the modal after success

      // Navigate back to the landing page
      navigate('/');  // Redirect to the customer landing page
    } catch (error) {
      setError('Failed to update customer');
      setSuccess(null);
    } finally {
      setLoading(false); // Reset loading state
  }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Update Customer</h2>
      <form onSubmit={handleSubmit} className="customer-form">
        {/* Customer Details Section */}
        <div className="form-group">
          <label>Customer Name</label>
          <input type="text" name="customerName" value={customerData.customerName} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Customer Abbreviation</label>
          <input type="text" name="customerAbbreviation" value={customerData.customerAbbreviation} onChange={handleInputChange} required />
        </div>
        
        {/* Address Fields */}
        <div className="form-group">
          <label>Address One</label>
          <input type="text" name="addressOne" value={customerData.addressOne} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Address Two</label>
          <input type="text" name="addressTwo" value={customerData.addressTwo} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label>Address Three</label>
          <input type="text" name="addressThree" value={customerData.addressThree} onChange={handleInputChange} />
        </div>
        
        {/* Location Information */}
        <div className="form-group">
          <label>City</label>
          <input type="text" name="city" value={customerData.city} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label>State</label>
          <input type="text" name="state" value={customerData.state} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label>Country</label>
          <input type="text" name="country" value={customerData.country} onChange={handleInputChange} />
        </div>

        {/* Contact Information */}
        <div className="form-group">
          <label>Official Email</label>
          <input type="email" name="officialEmail" value={customerData.officialEmail} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Landline One</label>
          <input type="text" name="landLineOne" value={customerData.landLineOne} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label>Landline Two</label>
          <input type="text" name="landLineTwo" value={customerData.landLineTwo} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label>Fax</label>
          <input type="text" name="fax" value={customerData.fax} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label>Website</label>
          <input type="url" name="website" value={customerData.website} onChange={handleInputChange} />
        </div>

        {/* Tax Information */}
        <div className="form-group">
          <label>GST Number</label>
          <input type="text" name="gstNo" value={customerData.gstNo} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>PAN Number</label>
          <input type="text" name="panNo" value={customerData.panNo} onChange={handleInputChange} />
        </div>
        
        {/* Social Media Links */}
        <div className="form-group">
          <label>Twitter Link</label>
          <input type="url" name="twitterLink" value={customerData.twitterLink} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label>Skype ID</label>
          <input type="text" name="skypeId" value={customerData.skypeId} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label>Facebook Link</label>
          <input type="url" name="faceBookLink" value={customerData.faceBookLink} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label>LinkedIn Link</label>
          <input type="url" name="linkedInLink" value={customerData.linkedInLink} onChange={handleInputChange} />
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                    <span>
                        <i className="fa fa-spinner fa-spin"></i> Processing...
                    </span>
                ) : (
                    "Update Customer"
                )}
               </button>

        {/* Success or Error Message Display */}
        {success && <p className="success-message">{success}</p>}
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default CustomerUpdateForm;
