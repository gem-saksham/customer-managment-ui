import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom'; 
import { addCustomerMarket, getCustomerMarkets } from '../services/customerService';
import '../css/Form.css'; // Reuse the existing CSS for form styling

const CustomerMarketForm = ({onClose}) => {
  const { customerId } = useParams(); // Get the customerId from the URL
  const navigate = useNavigate(); // For navigating after form submission
  const location = useLocation(); // Use useLocation to access location state

  const [marketData, setMarketData] = useState({
    customerId: customerId, // Prefilled customerId
    customerMarket: '', // Initialize as an empty string
    customerMarketSubCategory: '', // Initialize as an empty string
  });

  const [markets, setMarkets] = useState({}); // Store market data
  const [subcategories, setSubcategories] = useState([]); // State for subcategories
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch markets when the component mounts
  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const response = await getCustomerMarkets();
        console.log("Markets Response:", response.data); // Debug log for response
        setMarkets(response.data.object); // Set the markets as an object
      } catch (error) {
        setError('Failed to fetch markets');
        console.error("Error fetching markets:", error); // Debug log for error
      }
    };

    fetchMarkets();
  }, []);

  // Handle input changes for the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'customerMarket') {
      // If customerMarket is selected, update subcategories and reset customerMarketSubCategory
      const selectedSubcategories = markets[value] || []; // Get subcategories for the selected market
      setSubcategories(selectedSubcategories); // Update subcategories

      // Update the marketData state, setting both customerMarket and resetting customerMarketSubCategory
      setMarketData((prevData) => ({
        ...prevData,
        customerMarket: value,
        customerMarketSubCategory: '', // Resetting subcategory
      }));
    } else {
      // Update the state for other inputs
      setMarketData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addCustomerMarket(marketData); // Call the service method
      setSuccess('Customer market details added successfully');
      setError(null);
      onClose();  // Call onClose to close modal and return to dashboard

      // Optional: Redirect to dashboard or another form after success
      
    } catch (error) {
      setError('Failed to add customer market details');
      setSuccess(null);
      console.error("Error adding customer market:", error); // Debug log for error
    }
  };

  // Handle refreshing the form
  const handleRefresh = () => {
    setMarketData({
      customerId: customerId,
      customerMarket: '',
      customerMarketSubCategory: '',
    });
    setSubcategories([]); // Reset subcategories
    setSuccess(null);
    setError(null);
  };

  // Handle navigating back to the dashboard
  const handleBackToDashboard = () => {
    navigate(`/dashboard/${customerId}`, { state: { customerName: location.state?.customerName } });
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Save Customer Market</h2>
      <form onSubmit={handleSubmit} className="market-form">
        <div className="form-group">
          <label>Customer Market</label>
          <select
            name="customerMarket"
            value={marketData.customerMarket} // Bind value to state
            onChange={handleInputChange} // Handle change
            required 
            style={{ padding: '10px', width: '100%', borderRadius: '5px' }} 
          >
            <option value="">Select a market</option>
            {Object.keys(markets).map((market, index) => (
              <option key={index} value={market}>
                {market}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Customer Market Subcategory</label>
          <select
            name="customerMarketSubCategory"
            value={marketData.customerMarketSubCategory} // Bind value to state
            onChange={handleInputChange} // Handle change
            required
            style={{ padding: '10px', width: '100%', borderRadius: '5px' }} 
          >
            <option value="">Select a subcategory</option>
            {subcategories.map((subcategory, index) => (
              <option key={index} value={subcategory}>
                {subcategory}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="submit-btn">Save Market</button>

        {/* New buttons for refreshing and going back */}
        <button type="button" className="submit-btn" onClick={handleRefresh} style={{ marginLeft: '10px' }}>
          Refresh to fill another market
        </button>
        
        {/* Show success or error messages */}
        {success && <p className="success-message">{success}</p>}
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default CustomerMarketForm;
