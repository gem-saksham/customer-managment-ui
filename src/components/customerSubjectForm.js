import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom'; 
import { addCustomerSubject, getCustomerSubjects } from '../services/customerService'; 
import '../css/Form.css'; 

const CustomerSubjectForm = ({onClose}) => {
  const { customerId } = useParams(); // Get the customerId from the URL
  const navigate = useNavigate(); // For navigating after form submission
  const location = useLocation(); // Use location to access state

  const [subjectData, setSubjectData] = useState({
    customerId: customerId, // Prefilled customerId
    subjectName: '',
    subjectNameSubCategory: '',
  });

  const [subjects, setSubjects] = useState({});
  const [subCategories, setSubCategories] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch subjects on component mount
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await getCustomerSubjects();  // Fetch subjects from the API
        setSubjects(response.data.object);            // Set the subjects object from the API response
      } catch (error) {
        console.error('Failed to fetch subjects', error);
        setError('Failed to fetch subjects');
      }
    };

    fetchSubjects();
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setSubjectData({ ...subjectData, [name]: value });

    // If subjectName changes, update subcategories dynamically
    if (name === 'subjectName') {
      setSubCategories(subjects[value] || []);  // Set corresponding subcategories or empty array
      setSubjectData({
        ...subjectData,
        subjectName: value,
        subjectNameSubCategory: '',            // Reset subcategory
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addCustomerSubject(subjectData);      // Call the service method to submit data
      setSuccess('Customer subject details added successfully');
      setError(null);
      onClose();

      
    } catch (error) {
      setError('Failed to add customer subject details');
      setSuccess(null);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Handle refreshing the form
  const handleRefresh = () => {
    setSubjectData({
      customerId: customerId,
      subjectName: '',
      subjectNameSubCategory: '',
    });
    setSubCategories([]); // Reset subcategories
    setSuccess(null);
    setError(null);
  };

  

  return (
    <div className="form-container">
      <h2 className="form-title">Save Customer Subject</h2>
      
      <form onSubmit={handleSubmit} className="subject-form">
        {/* Subject Name Dropdown */}
        <div className="form-group">
          <label>Subject Name</label>
          <select
            name="subjectName"
            value={subjectData.subjectName}
            onChange={handleInputChange}
            required style={{ padding: '10px', width: '100%', borderRadius: '5px' }}
          >
            <option value="">Select a Subject</option>
            {Object.keys(subjects).map((subject, index) => (
              <option key={index} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>

        {/* Subject Subcategory Dropdown or Text Input */}
        <div className="form-group">
          <label>Subject Subcategory</label>
          {subCategories.length > 0 ? (
            <select
              name="subjectNameSubCategory"
              value={subjectData.subjectNameSubCategory}
              onChange={handleInputChange}
              required
              style={{ padding: '10px', width: '100%', borderRadius: '5px' }}
            >
              <option value="">Select a Subcategory</option>
              {subCategories.map((subcategory, index) => (
                <option key={index} value={subcategory}>
                  {subcategory}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              name="subjectNameSubCategory"
              value={subjectData.subjectNameSubCategory}
              onChange={handleInputChange}
              placeholder="Enter your own subcategory"
              required
            />
          )}
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                    <span>
                        <i className="fa fa-spinner fa-spin"></i> Processing...
                    </span>
                ) : (
                    "Save Subject"
                )}
               </button>

        {/* New buttons for refreshing and going back */}
        <button type="button" className="submit-btn" onClick={handleRefresh} style={{ marginLeft: '10px' }}>
          Refresh to fill another subject
        </button>

        {/* Show success or error messages */}
        {success && <p className="success-message">{success}</p>}
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default CustomerSubjectForm;
