
import React, { useState } from 'react';
import ParkingLotList from './ParkingLotList';
import AdminAnalyticsDashboard from './AdminAnalyticsDashboard';
import AdminBookingList from './AdminBookingList';

const AdminDashboard = () => {
  const [tab, setTab] = useState('analytics');

  return (
    <div style={{ padding: 24 }}>
      <h2>Admin Dashboard</h2>
      <div className="flex gap-3 mb-6">
        <button
          className={`px-4 py-2 rounded font-semibold shadow transition text-white ${tab === 'analytics' ? 'bg-blue-600' : 'bg-blue-400 hover:bg-blue-500'}`}
          onClick={() => setTab('analytics')}
        >
          Statistik
        </button>
        <button
          className={`px-4 py-2 rounded font-semibold shadow transition text-white ${tab === 'lots' ? 'bg-blue-600' : 'bg-blue-400 hover:bg-blue-500'}`}
          onClick={() => setTab('lots')}
        >
          Kelola Parking Lot
        </button>
        <button
          className={`px-4 py-2 rounded font-semibold shadow transition text-white ${tab === 'booking' ? 'bg-blue-600' : 'bg-blue-400 hover:bg-blue-500'}`}
          onClick={() => setTab('booking')}
        >
          Booking
        </button>
      </div>
  {tab === 'analytics' && <AdminAnalyticsDashboard />}
  {tab === 'lots' && <ParkingLotList />}
  {/* Fitur Kelola Slot dihapus */}
  {tab === 'booking' && <AdminBookingList />}
    </div>
  );
};

export default AdminDashboard;
