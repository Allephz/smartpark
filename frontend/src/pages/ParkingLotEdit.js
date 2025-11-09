import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ParkingLotForm from '../components/ParkingLotForm';
import { parkingLotService } from '../services/api';

const ParkingLotEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    parkingLotService.getLot(id).then(setInitialData);
  }, [id]);

  const handleUpdate = async (data) => {
    try {
      await parkingLotService.updateLot(id, data);
      navigate('/admin');
    } catch (error) {
      alert('Error updating parking lot');
    }
  };

  if (!initialData) return <div>Loading...</div>;

  return <ParkingLotForm initialData={initialData} onSubmit={handleUpdate} isEdit={true} />;
};

export default ParkingLotEdit;
