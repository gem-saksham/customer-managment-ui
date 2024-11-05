import React, { useState, useEffect } from 'react';
import { getCustomerContacts } from '../services/customerService';

const CustomerContacts = ({ customerId }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await getCustomerContacts(customerId);
        setContacts(response.data);
      } catch (error) {
        console.error('Error fetching customer contacts:', error);
        setError('Error fetching customer contacts');
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [customerId]);

  if (loading) {
    return <p>Loading contacts...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h3>Customer Contacts</h3>
      {contacts.length > 0 ? (
        <ul>
          {contacts.map((contact) => (
            <li key={contact.id}>
              {contact.name} - {contact.email}
            </li>
          ))}
        </ul>
      ) : (
        <p>No contacts found</p>
      )}
    </div>
  );
};

export default CustomerContacts;
