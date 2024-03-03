import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortedColumn, setSortedColumn] = useState(null);
  const [sortedDirection, setSortedDirection] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage] = useState(20);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:4500/customers');
      const data = await response.json();
      setCustomers(data);
    };

    fetchData();
  }, []);
  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };
  const handleSort = column => {
    if (column === sortedColumn) {
      setSortedDirection(sortedDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortedColumn(column);
      setSortedDirection('asc');
    }
  };

  const sortedCustomers = [...customers].sort((a, b) => {
    if (sortedColumn) {
      const columnA = a[sortedColumn];
      const columnB = b[sortedColumn];
      if (columnA < columnB) {
        return sortedDirection === 'asc' ? -1 : 1;
      }
      if (columnA > columnB) {
        return sortedDirection === 'asc' ? 1 : -1;
      }
    }
    return 0;
  });

  const filteredCustomers = sortedCustomers.filter(customer =>
    customer.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);
  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className="App">
      <h1>Customer Management System</h1>
      <div style={{
        width: '100%',
        display: 'flex',
        justifyContent:'space-between',
        alignItems: 'center',
        marginBottom:"30px"
      }}>
      <input
        type="text"
        placeholder="Search by customer name or location..."
        value={searchTerm}
        onChange={handleSearchChange}
        style={{
          width: '300px',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '5px',
          outline: 'none'
        }}
      />
      <button onClick={() => handleSort('created_at')} style={{
        width: '100px',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        outline: 'none'
      }}>SORT BY DATE</button>
      <button onClick={() => handleSort('created_at')} 
      style={{
        width: '100px',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        outline: 'none'
      }}>SORT BY TIME</button>
      </div>
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('customer_name')}>Customer Name</th>
            <th onClick={() => handleSort('age')}>Age</th>
            <th onClick={() => handleSort('phone')}>Phone</th>
            <th onClick={() => handleSort('location')}>Location</th>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {currentCustomers.map(customer => (
            <tr key={customer.sno}>
              <td>{customer.customer_name}</td>
              <td>{customer.age}</td>
              <td>{customer.phone}</td>
              <td>{customer.location}</td>
              <td>{new Date(customer.created_at).toLocaleDateString()}</td>
              <td>{new Date(customer.created_at).toLocaleTimeString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <ul className="pagination">
        {Array.from({ length: Math.ceil(filteredCustomers.length / customersPerPage) }, (_, i) => (
          <li key={i} className={currentPage === i + 1 ? 'active' : ''}>
            <button onClick={() => paginate(i + 1)}>{i + 1}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
