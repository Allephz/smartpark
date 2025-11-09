import React from 'react';
import ParkingLotList from '../components/ParkingLotList';
import UserBookingHistory from '../components/UserBookingHistory';

const UserHome = () => {
  return (
    <div>
      <h2>Welcome, User!</h2>
      <ParkingLotList />
      <UserBookingHistory />
    </div>
  );
};

export default UserHome;
