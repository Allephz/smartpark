import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import ParkingLotList from './components/ParkingLotList';
import ParkingLotDetail from './components/ParkingLotDetail';
import AdminDashboard from './components/AdminDashboard';
import ParkingLotCreate from './pages/ParkingLotCreate';
import ParkingLotEdit from './pages/ParkingLotEdit';
import UserBookingHistory from './components/UserBookingHistory';
// Komponen untuk redirect sesuai role
const RoleRedirect = () => {
  const { user } = useAuth();
  if (!user) return null;
  if (user.role === 'ADMIN') return <Navigate to="/admin" />;
  return <Navigate to="/home" />;
};

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, isAdmin } = useAuth();
  return user && isAdmin ? children : <Navigate to="/" />;
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/my-bookings" element={<PrivateRoute><UserBookingHistory /></PrivateRoute>} />
            <Route path="/" element={<PrivateRoute><RoleRedirect /></PrivateRoute>} />
            <Route path="/home" element={<PrivateRoute><ParkingLotList /></PrivateRoute>} />
            <Route path="/parking-lots/:id" element={<PrivateRoute><ParkingLotDetail /></PrivateRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/parking-lots/new" element={<AdminRoute><ParkingLotCreate /></AdminRoute>} />
            <Route path="/parking-lots/edit/:id" element={<AdminRoute><ParkingLotEdit /></AdminRoute>} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;