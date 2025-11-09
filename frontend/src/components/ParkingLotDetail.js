import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Button,
  CircularProgress,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { parkingLotService, parkingSlotService, bookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import io from 'socket.io-client';

const ParkingLotDetail = () => {
  const [parkingLot, setParkingLot] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { isAdmin, user } = useAuth();
  const [userBookings, setUserBookings] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(false);
  const handleBooking = async (slot) => {
    setBookingLoading(true);
    try {
      await bookingService.book({ slot_id: slot.id, parkingLotId: parkingLot.id });
      alert('Booking berhasil!');
      fetchData();
    } catch (error) {
      alert('Gagal booking: ' + (error.response?.data?.message || error.message));
    }
    setBookingLoading(false);
  };

  useEffect(() => {
    const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');

    socket.on('slotStatusUpdate', (data) => {
      if (data.parkingLotId === parseInt(id)) {
        setSlots((prevSlots) =>
          prevSlots.map((slot) =>
            slot.id === data.slotId ? { ...slot, status: data.status } : slot
          )
        );
      }
    });

  fetchData();
  fetchUserBookings();

    return () => {
      socket.disconnect();
    };
  }, [id]);

  const fetchData = async () => {
    try {
      const [lotData, slotsData] = await Promise.all([
        parkingLotService.getLot(id),
        parkingSlotService.getSlotsByLot(id),
      ]);
      setParkingLot(lotData);
      setSlots(slotsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const fetchUserBookings = async () => {
    try {
      const bookings = await bookingService.getMyBookings();
      setUserBookings(bookings);
    } catch (error) {
      setUserBookings([]);
    }
  };

  const handleStatusChange = async (slotId, newStatus) => {
    try {
      await parkingSlotService.updateSlotStatus(slotId, newStatus);
      // Socket will handle the update
    } catch (error) {
      console.error('Error updating slot status:', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!parkingLot) {
    return <Typography>Parking lot not found</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        {parkingLot.name}
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 3 }}>
        {parkingLot.description}
      </Typography>
      <Grid container spacing={2}>
        {slots.map((slot) => {
          // Cari booking milik user untuk slot ini
          const myBooking = userBookings.find(
            (b) => b.slot_id === slot.id && b.user_id === user?.id && (b.status === 'RESERVED' || b.status === 'OCCUPIED')
          );
          return (
            <Grid item xs={6} sm={4} md={3} lg={2} key={slot.id}>
              <Paper
                sx={{
                  p: 2,
                  textAlign: 'center',
                  bgcolor:
                    slot.status === 'AVAILABLE'
                      ? 'success.light'
                      : slot.status === 'OCCUPIED'
                      ? 'error.light'
                      : 'warning.light',
                }}
              >
                <Typography variant="h6">{slot.slotNumber}</Typography>
                <Typography>{slot.status}</Typography>
                {isAdmin ? (
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ mt: 1 }}
                    onClick={() =>
                      handleStatusChange(
                        slot.id,
                        slot.status === 'AVAILABLE' ? 'OCCUPIED' : 'AVAILABLE'
                      )
                    }
                  >
                    Toggle Status
                  </Button>
                ) : (
                  <>
                    {slot.status === 'AVAILABLE' && (
                      <Button
                        variant="contained"
                        size="small"
                        sx={{ mt: 1 }}
                        onClick={() => handleBooking(slot)}
                        disabled={bookingLoading}
                      >
                        Booking
                      </Button>
                    )}
                    {/* Tombol Check-in untuk booking RESERVED milik user */}
                    {myBooking && myBooking.status === 'RESERVED' && (
                      <>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          sx={{ mt: 1, mr: 1 }}
                          onClick={async () => {
                            await bookingService.checkIn(myBooking.id);
                            alert('Check-in berhasil!');
                            fetchData();
                            fetchUserBookings();
                          }}
                        >
                          Check-in
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          sx={{ mt: 1 }}
                          onClick={async () => {
                            if (window.confirm('Yakin ingin membatalkan booking slot ini?')) {
                              await bookingService.cancel(myBooking.id);
                              alert('Booking berhasil dibatalkan!');
                              fetchData();
                              fetchUserBookings();
                            }
                          }}
                        >
                          Batalkan
                        </Button>
                      </>
                    )}
                    {/* Tombol Check-out untuk booking OCCUPIED milik user */}
                    {myBooking && myBooking.status === 'OCCUPIED' && (
                      <Button
                        variant="contained"
                        color="warning"
                        size="small"
                        sx={{ mt: 1 }}
                        onClick={async () => {
                          await bookingService.checkOut(myBooking.id);
                          alert('Check-out berhasil!');
                          fetchData();
                          fetchUserBookings();
                        }}
                      >
                        Check-out
                      </Button>
                    )}
                  </>
                )}
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default ParkingLotDetail;