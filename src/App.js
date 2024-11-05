import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CustomerForm from './components/customerForm';
import CustomerContactForm from './components/customerContactForm';
import CustomerDashboard from './components/customerDashboard';
import CustomerMarketForm from './components/customerMarketForm';
import CustomerSubjectForm from './components/customerSubjectForm'; 
import CustomerLandingPage from './components/customerLandingPage'; // New landing page component
import CustomerUpdateForm from './components/customerUpdateForm';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CustomerLandingPage />} /> {/* New route for landing page */}
        <Route path="/add-customer" element={<CustomerForm />} />
        <Route path="/update-customer/:customerId" element={<CustomerUpdateForm />} />
        <Route path="/dashboard/:customerId" element={<CustomerDashboard />} />
        <Route path="/add-contact/:customerId" element={<CustomerContactForm />} />
        <Route path="/add-market/:customerId" element={<CustomerMarketForm />} />
        <Route path="/add-subject/:customerId" element={<CustomerSubjectForm />} />
      </Routes>
    </Router>
  );
};

export default App;
