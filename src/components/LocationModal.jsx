import React from 'react';
import Modal from 'react-modal';
import LocationTree from './LocationTree';
import './Modal.css';
import { FaWindowClose } from 'react-icons/fa';

Modal.setAppElement('#root'); 

const LocationModal = ({ isOpen, onRequestClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Location Modal"
      className="Modal"
      overlayClassName="Overlay"
    >
      <button onClick={onRequestClose} className="close-button"><FaWindowClose /></button>
      <LocationTree />
    </Modal>
  );
};

export default LocationModal;
