import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  IconButton,
  Button,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { parkingLotService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ParkingLotList = () => {
  const [parkingLots, setParkingLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchParkingLots();
  }, []);

  const fetchParkingLots = async () => {
    try {
      const data = await parkingLotService.getAllLots();
      setParkingLots(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching parking lots:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this parking lot?')) {
      try {
        await parkingLotService.deleteLot(id);
        fetchParkingLots();
      } catch (error) {
        console.error('Error deleting parking lot:', error);
      }
    }
  };

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Parking Lots</Typography>
        {isAdmin && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/parking-lots/new')}
          >
            Add New Lot
          </Button>
        )}
      </Box>
      <Grid container spacing={3}>
        {parkingLots.map((lot) => (
          <Grid item xs={12} sm={6} md={4} key={lot.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6">{lot.name}</Typography>
                  {isAdmin && (
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/parking-lots/edit/${lot.id}`)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(lot.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  )}
                </Box>
                <Typography color="textSecondary">
                  {lot.description}
                </Typography>
                {lot.address && (
                  <Typography color="textSecondary" sx={{ fontStyle: 'italic', mt: 1 }}>
                    Lokasi: {lot.address}
                  </Typography>
                )}
                <Typography variant="h5" sx={{ mt: 2, color: 'success.main' }}>
                  {lot.availability}
                </Typography>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => navigate(`/parking-lots/${lot.id}`)}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ParkingLotList;