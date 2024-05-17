import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LocationTree.css';
import { IoIosClose, IoIosSearch, IoMdFolder, IoMdPin, IoMdArrowDropdown, IoMdArrowDropright } from 'react-icons/io';

const LocationTree = () => {
  const [locations, setLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expanded, setExpanded] = useState({});
  const [draggedItem, setDraggedItem] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    axios.get('https://664338013c01a059ea21fec7.mockapi.io/locations')
      .then(response => {
        setLocations(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("There was an error fetching the locations!", error);
        setLoading(false);
      });
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const toggleExpand = (id) => {
    setExpanded(prevState => ({ ...prevState, [id]: !prevState[id] }));
  };

  const filterLocations = (nodes, term) => {
    if (!term) return nodes;
    return nodes.filter(node => node.name.toLowerCase().includes(term.toLowerCase()));
  };

  const onDragStart = (event, item) => {
    setDraggedItem(item);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (event) => {
    event.preventDefault();
  };

  const onDrop = (event, targetArea) => {
    event.preventDefault();
    if (draggedItem && targetArea.is_area) {
      const sourceArea = findParent(locations, draggedItem.id);
      if (sourceArea && sourceArea.id !== targetArea.id) {
        sourceArea.children = sourceArea.children.filter(child => child.id !== draggedItem.id);
        targetArea.children = [...targetArea.children, draggedItem];
        setLocations([...locations]);
      }
    }
    setDraggedItem(null);
  };

  const findParent = (nodes, id) => {
    for (let node of nodes) {
      if (node.children.some(child => child.id === id)) {
        return node;
      }
      if (node.children.length > 0) {
        const foundParent = findParent(node.children, id);
        if (foundParent) return foundParent;
      }
    }
    return null;
  };

  const renderNode = (node) => (
    <li key={node.id} className="tree-item">
      <div
        className="tree-item-header"
        draggable={!node.is_area}
        onDragStart={(event) => onDragStart(event, node)}
        onDragOver={onDragOver}
        onDrop={(event) => onDrop(event, node)}
        onClick={() => toggleExpand(node.id)}
      >
        {node.children.length > 0 && (
          expanded[node.id] ? <IoMdArrowDropdown className="icon" /> : <IoMdArrowDropright className="icon" />
        )}
        {node.is_area ? <IoMdFolder className="icon" /> : <IoMdPin className="icon" />} <span>{node.name}</span>
      </div>
      {node.children.length > 0 && expanded[node.id] && (
        <ul className="tree-children">
          {node.children.map(child => renderNode(child))}
        </ul>
      )}
    </li>
  );

  const filteredNodes = filterLocations(locations, searchTerm);

  return (
    <div className="location-tree-container">
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
      <div className="location-tree">
        <ul>
          {filteredNodes.map(node => renderNode(node))}
          {loading && <div className="loading-spinner">Loading...</div>}
        </ul>
      </div>
    </div>
  );
};

export default LocationTree;
