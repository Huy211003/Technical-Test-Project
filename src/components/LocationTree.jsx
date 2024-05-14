import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LocationTree.css';
import { IoIosClose, IoIosSearch, IoMdFolder, IoMdPin, IoMdArrowDropdown, IoMdArrowDropright } from 'react-icons/io';

const LocationTree = () => {
  const [locations, setLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    axios.get('https://664338013c01a059ea21fec7.mockapi.io/locations')
      .then(response => {
        setLocations(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the locations!", error);
      });
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const toggleExpand = (id) => {
    setExpanded(prevState => ({ ...prevState, [id]: !prevState[id] }));
  };

  const filterLocations = (locations, term) => {
    if (!term) return locations;
    return locations
      .filter(location => location.name.toLowerCase().includes(term.toLowerCase()))
      .map(location => ({
        ...location,
        children: filterLocations(location.children, term)
      }));
  };

  const renderTree = (nodes) => (
    <ul>
      {nodes.map(node => (
        <li key={node.id} className="tree-item">
          <div className="tree-item-header" onClick={() => toggleExpand(node.id)}>
            {node.children.length > 0 && (
              expanded[node.id] ? <IoMdArrowDropdown className="icon" /> : <IoMdArrowDropright className="icon" />
            )}
            {node.is_area ? <IoMdFolder className="icon" /> : <IoMdPin className="icon" />} <span>{node.name}</span>
          </div>
          {node.children.length > 0 && expanded[node.id] && (
            <div className="tree-children">
              {renderTree(node.children)}
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  const filteredLocations = filterLocations(locations, searchTerm);

  return (
    <div className="location-tree">
      <div className="location-search">
        <IoIosSearch className="icon" />
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-box"
        />
        {searchTerm && <IoIosClose onClick={clearSearch} style={{ cursor: 'pointer' }} className="icon" />}
      </div>
      {locations.length > 0 ? renderTree(filteredLocations) : <p>Loading...</p>}
    </div>
  );
};

export default LocationTree;
