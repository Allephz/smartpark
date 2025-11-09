import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Pie, Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { parkingLotService } from '../services/api';

const AdminAnalyticsDashboard = () => {
  const [stats, setStats] = useState(null);


  useEffect(() => {
    parkingLotService.getStatistics().then((data) => {
      console.log('Stats data:', data, JSON.stringify(data));
      setStats(data);
    });
  }, []);


  if (!stats) return <div>Loading...</div>;
  if (!Array.isArray(stats.lots)) {
    return <div>Error: Data statistik tidak valid</div>;
  }


  const barData = {
    labels: stats.lots.map(lot => lot.name),
    datasets: [
      {
        label: 'Occupied Slots',
        data: stats.lots.map(lot => lot.occupied),
        backgroundColor: 'rgba(220,0,78,0.7)',
      },
      {
        label: 'Total Slots',
        data: stats.lots.map(lot => lot.total),
        backgroundColor: 'rgba(25,118,210,0.5)',
      },
    ],
  };

  const pieData = {
    labels: ['Occupied', 'Available'],
    datasets: [
      {
        data: [stats.totalOccupied, stats.totalSlots - stats.totalOccupied],
        backgroundColor: ['#dc004e', '#4caf50'],
      },
    ],
  };

  return (
    <Paper sx={{ p: 4, mt: 2 }}>
      <Typography variant="h5" mb={2}>Analytics Dashboard</Typography>
      <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="subtitle1">Total Occupancy: {stats.totalOccupied}/{stats.totalSlots} ({stats.totalPercent}%)</Typography>
        <Box sx={{ maxWidth: 350, maxHeight: 350, width: '100%' }}>
          <Pie data={pieData} options={{ maintainAspectRatio: false }} style={{ width: '100%', height: '100%' }} />
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="subtitle1">Occupancy per Lot</Typography>
        <Box sx={{ maxWidth: 700, maxHeight: 400, width: '100%' }}>
          <Bar data={barData} options={{ maintainAspectRatio: false }} style={{ width: '100%', height: '100%' }} />
        </Box>
      </Box>
    </Paper>
  );
};

export default AdminAnalyticsDashboard;
