import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';

const ParkingLotForm = ({ initialData = {}, onSubmit, isEdit }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    totalCapacity: initialData.totalCapacity || '',
    description: initialData.description || '',
    address: initialData.address || '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Paper sx={{ p: 4, mt: 2 }}>
      <Typography variant="h6" mb={2}>
        {isEdit ? 'Edit Parking Lot' : 'Add New Parking Lot'}
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Total Capacity"
          name="totalCapacity"
          type="number"
          value={formData.totalCapacity}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          multiline
          rows={2}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" color="primary">
          {isEdit ? 'Update' : 'Create'}
        </Button>
      </Box>
    </Paper>
  );
};

export default ParkingLotForm;
