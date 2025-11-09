
import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();

  return (
    <nav style={{ padding: '1rem', background: '#1976d2', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <h2 style={{ margin: 0, cursor: 'pointer' }} onClick={() => navigate('/')}>SmartPark</h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {user && !isAdmin && (
          <Button color="inherit" onClick={() => navigate('/my-bookings')} sx={{ color: 'white', mr: 1 }}>
            Riwayat Booking
          </Button>
        )}
        {user && isAdmin && (
          <Button color="inherit" onClick={() => navigate('/admin')} sx={{ color: 'white', mr: 1 }}>
            Analytics
          </Button>
        )}
        {!user && (
          <>
            <Button color="inherit" onClick={() => navigate('/login')} sx={{ color: 'white', mr: 1 }}>
              Login
            </Button>
            <Button color="inherit" onClick={() => navigate('/register')} sx={{ color: 'white' }}>
              Register
            </Button>
          </>
        )}
        {user && (
          <Button color="inherit" onClick={logout} sx={{ color: 'white' }}>
            Logout
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
