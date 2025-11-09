import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { bookingService } from '../services/api';

const AdminBookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await bookingService.getAll();
      setBookings(data);
    } catch (error) {
      alert('Gagal memuat data booking');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin hapus booking ini?')) {
      try {
        await bookingService.delete(id);
        fetchBookings();
      } catch (error) {
        alert('Gagal menghapus booking');
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Paper sx={{ p: 3, mt: 2 }}>
      <Typography variant="h6" mb={2}>Daftar Booking</Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Parking Lot</TableCell>
              <TableCell>Slot</TableCell>
              <TableCell>Waktu</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((b) => (
              <TableRow key={b.id}>
                <TableCell>{b.user?.username || '-'}</TableCell>
                <TableCell>{b.lot?.name || '-'}</TableCell>
                <TableCell>{b.slot?.slotNumber || '-'}</TableCell>
                <TableCell>{b.time || '-'}</TableCell>
                <TableCell>{b.status || '-'}</TableCell>
                <TableCell>
                  <Button color="error" size="small" onClick={() => handleDelete(b.id)}>Hapus</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default AdminBookingList;
