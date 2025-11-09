import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { bookingService } from '../services/api';

const UserBookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await bookingService.getMyBookings();
      setBookings(data);
    } catch (error) {
      let msg = 'Gagal memuat riwayat booking';
      if (error.response && error.response.data && error.response.data.message) {
        msg += `: ${error.response.data.message}`;
      } else if (error.message) {
        msg += `: ${error.message}`;
      }
      alert(msg);
    }
    setLoading(false);
  };

  const handleCancel = async (id) => {
    if (window.confirm('Yakin batalkan booking ini?')) {
      try {
        await bookingService.cancel(id);
        fetchBookings();
      } catch (error) {
        alert('Gagal membatalkan booking');
      }
    }
  };

  const handleCheckOut = async (id) => {
    if (window.confirm('Check-out dari slot ini?')) {
      try {
        await bookingService.checkOut(id);
        fetchBookings();
      } catch (error) {
        alert('Gagal check-out');
      }
    }
  };


  // Tambahkan handler check-in
  const handleCheckIn = async (id) => {
    if (window.confirm('Check-in pada slot ini?')) {
      try {
        await bookingService.checkIn(id);
        fetchBookings();
      } catch (error) {
        alert('Gagal check-in');
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Paper sx={{ p: 3, mt: 2 }}>
      <Typography variant="h6" mb={2}>Riwayat Booking Saya</Typography>
      {bookings.length === 0 ? (
        <Typography color="text.secondary">Belum ada riwayat booking.</Typography>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tempat Parkir</TableCell>
                <TableCell>Slot</TableCell>
                <TableCell>Waktu</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((b) => (
                <TableRow key={b.id}>
                  <TableCell>{b.lot?.name || '-'}</TableCell>
                  <TableCell>{b.slot?.slotNumber || '-'}</TableCell>
                  <TableCell>{b.createdAt ? new Date(b.createdAt).toLocaleString() : '-'}</TableCell>
                  <TableCell>{b.status || '-'}</TableCell>


                  <TableCell>
                    {b.status === 'RESERVED' && (
                      <>
                        <button
                          className="px-3 py-1 mr-2 rounded bg-green-500 hover:bg-green-600 text-white text-xs font-semibold shadow transition"
                          onClick={() => handleCheckIn(b.id)}
                        >
                          Check-in
                        </button>
                        <button
                          className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white text-xs font-semibold shadow transition"
                          onClick={() => handleCancel(b.id)}
                        >
                          Batalkan
                        </button>
                      </>
                    )}
                    {b.status === 'OCCUPIED' && (
                      <button
                        className="px-3 py-1 rounded bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-semibold shadow transition"
                        onClick={() => handleCheckOut(b.id)}
                      >
                        Check-out
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default UserBookingHistory;
