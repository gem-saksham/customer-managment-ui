import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom'; 
import { addCustomerContact, getRoles } from '../services/customerService'; 
import '../css/Form.css'; 

const CustomerContactForm = ({onClose}) => {
    const { customerId } = useParams(); 
    const location = useLocation(); 
    const navigate = useNavigate(); 

    const [contactData, setContactData] = useState({
        customerId: customerId || '', 
        customerName: location.state?.customerName || '', 
        salutation: '',
        firstName: '',
        lastName: '',
        middleName: '',
        designation: '',
        role: '', 
        emailAddressOne: '',
        emailAddressTwo: '',
        officialEmail: '',
        mobileOne: '',
        mobileTwo: '',
        skypeId: '',
        linkedInLink: '',
        dateOfBirth: '',

        contactSubjectKeyword: '',
        
    });

    const [roles, setRoles] = useState([]); 
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setContactData({ ...contactData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading to true
        try {
             // Use the roleInput if 'Others' is selected, otherwise use the selected role
        const finalRole = contactData.role === 'Others' ? contactData.roleInput : contactData.role;
        const dataToSubmit = { ...contactData, role: finalRole }; 

            await addCustomerContact(contactData); 
            setSuccess('Customer contact details saved successfully');
            setError(null);
            onClose();

           
        } catch (error) {
            setError('Failed to save customer contact details');
            setSuccess(null);
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    const handleRefresh = () => {
        setContactData({
            customerId: customerId || '',
            customerName: location.state?.customerName || '',
            salutation: '',
            firstName: '',
            lastName: '',
            middleName: '',
            designation: '',
            role: '',
            emailAddressOne: '',
            emailAddressTwo: '',
            officialEmail: '',
            mobileOne: '',
            mobileTwo: '',
            skypeId: '',
            linkedInLink: '',
            gstNo: '',
            panNo: '',
            dateOfBirth: '',
            eventParticipationHistory: '',
            contactSubjectKeyword: '',
        });
        setSuccess(null);
        setError(null);
    };

    const handleBackToDashboard = () => {
        navigate(`/dashboard/${customerId}`, { state: { customerName: contactData.customerName } }); // Pass customer name in state
    };

    return (
        <div className="form-container">
            <h2 className="form-title">Save Customer Contact</h2>
            <form onSubmit={handleSubmit} className="customer-contact-form">
                <div className="form-group">
                    <label>Customer ID</label>
                    <input type="text" name="customerId" value={contactData.customerId} readOnly /> {/* Set readOnly */}
                </div>
                <div className="form-group">
                    <label>Customer Name</label>
                    <input
                        type="text"
                        name="customerName"
                        value={contactData.customerName} readOnly
                    />
                </div>
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
                    <input
                        type="text"
                        name="firstName"
                        value={contactData.firstName}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Middle Name</label>
                    <input
                        type="text"
                        name="middleName"
                        value={contactData.middleName}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label>Last Name</label>
                    <input
                        type="text"
                        name="lastName"
                        value={contactData.lastName}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Designation</label>
                    <input
                        type="text"
                        name="designation"
                        value={contactData.designation}
                        onChange={handleInputChange}
                    />
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







                {/* Additional fields */}
                <div className="form-group">
                    <label>Email Address One</label>
                    <input
                        type="email"
                        name="emailAddressOne"
                        value={contactData.emailAddressOne}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Email Address Two</label>
                    <input
                        type="email"
                        name="emailAddressTwo"
                        value={contactData.emailAddressTwo}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label>Official Email</label>
                    <input
                        type="email"
                        name="officialEmail"
                        value={contactData.officialEmail}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Mobile One</label>
                    <input
                        type="text"
                        name="mobileOne"
                        value={contactData.mobileOne}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Mobile Two</label>
                    <input
                        type="text"
                        name="mobileTwo"
                        value={contactData.mobileTwo}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label>Skype ID</label>
                    <input
                        type="text"
                        name="skypeId"
                        value={contactData.skypeId}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label>LinkedIn Link</label>
                    <input
                        type="url"
                        name="linkedInLink"
                        value={contactData.linkedInLink}
                        onChange={handleInputChange}
                    />
                </div>
                
        
                <div className="form-group">
                    <label>Date of Birth</label>
                    <input
                        type="date"
                        name="dateOfBirth"
                        value={contactData.dateOfBirth}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label>Event Participation History</label>
                    <input
                        type="text"
                        name="eventParticipationHistory"
                        value={contactData.eventParticipationHistory}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label>Contact Subject Keyword</label>
                    <input
                        type="text"
                        name="contactSubjectKeyword"
                        value={contactData.contactSubjectKeyword}
                        onChange={handleInputChange}
                    />
                </div>
                
                {/* Submit and Refresh buttons */}
                <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                    <span>
                        <i className="fa fa-spinner fa-spin"></i> Processing...
                    </span>
                ) : (
                    "Save Contact"
                )}
               </button>
                <button type="button" className="submit-btn" onClick={handleRefresh} style={{ marginLeft: '10px' }}>
                    Refresh to fill another contact
                </button>
                {/* Show success or error messages */}
                {success && <p className="success-message">{success}</p>}
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
};

export default CustomerContactForm;
