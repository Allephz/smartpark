import React from 'react';
import { useNavigate } from 'react-router-dom';
import ParkingLotForm from '../components/ParkingLotForm';
import { parkingLotService } from '../services/api';

const ParkingLotCreate = () => {
  const navigate = useNavigate();

  const handleCreate = async (data) => {
    try {
      await parkingLotService.createLot(data);
      navigate('/admin');
    } catch (error) {
      alert('Error creating parking lot');
    }
  };

  return <ParkingLotForm onSubmit={handleCreate} isEdit={false} />;
};

export default ParkingLotCreate;
