import { useState } from 'react';
import './App.css';
import LocationModal from './components/LocationModal';

function App() {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="App">
      <button onClick={openModal} className="open-modal-button">Open Location Tree</button>
      <LocationModal isOpen={modalIsOpen} onRequestClose={closeModal} />
    </div>
  );
}

export default App;
