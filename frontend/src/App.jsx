import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

// Constants and Components
import { API_BASE_URL } from './constants';
import AdminLogin from './components/Admin/AdminLogin';
import AdminDashboard from './components/Admin/AdminDashboard';
import MeetingTypes from './components/User/MeetingTypes';
import Sidebar from './components/User/Sidebar';
import Calendar from './components/User/Calendar';
import Slots from './components/User/Slots';
import BookingForm from './components/User/BookingForm';
import Success from './components/User/Success';

// Styles
import './index.css';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation & Auth State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(localStorage.getItem('isAdminLoggedIn') === 'true');

  // User Flow State
  const [meetingTypes, setMeetingTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [step, setStep] = useState(0); // 0: Select Type, 1: Date/Time, 3: Form, 4: Success
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState({ name: '', email: '', location: 'video', notes: '' });
  const [error, setError] = useState('');

  // Admin State
  const [adminCreds, setAdminCreds] = useState({ email: '', password: '' });
  const [adminAvailabilities, setAdminAvailabilities] = useState([]);

  useEffect(() => {
    fetchMeetingTypes();
  }, []);

  const fetchMeetingTypes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/meeting-types`);
      setMeetingTypes(response.data);
    } catch (err) {
      console.error("Failed to fetch meeting types", err);
      setError('Connection Error: Is the Laravel server running at ' + API_BASE_URL + '?');
    }
  };

  // Auto-fetch slots when date is selected in user flow
  useEffect(() => {
    if (selectedDate && selectedType && !location.pathname.startsWith('/admin')) {
      fetchAvailability(format(selectedDate, 'yyyy-MM-dd'));
      setSelectedTime(null);
    }
  }, [selectedDate, selectedType, location.pathname]);

  const fetchAvailability = async (date) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_BASE_URL}/availability`, {
        params: { date, duration: selectedType.duration }
      });
      setAvailableSlots(response.data.slots);
    } catch (err) {
      setError('Connection Error: Is the Laravel server running at ' + API_BASE_URL + '?');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post(`${API_BASE_URL}/book`, {
        ...bookingData,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime,
        duration: selectedType.duration
      });
      setStep(4);
    } catch (err) {
      setError(err.response?.data?.error || 'Booking failed. Check backend logs.');
    } finally {
      setLoading(false);
    }
  };

  // --- Admin Logic ---
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, adminCreds);
      if (response.data.success) {
        setIsAdminLoggedIn(true);
        localStorage.setItem('isAdminLoggedIn', 'true');
        navigate('/admin');
        fetchAdminAvailabilities();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/logout`);
    } catch (err) {
      console.error("Logout API failed", err);
    } finally {
      setIsAdminLoggedIn(false);
      localStorage.removeItem('isAdminLoggedIn');
      navigate('/login');
    }
  };

  const fetchAdminAvailabilities = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/availability`);
      setAdminAvailabilities(response.data);
    } catch (err) {
      setError('Failed to fetch availabilities.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminLoggedIn && location.pathname === '/admin') {
      fetchAdminAvailabilities();
    }
  }, [isAdminLoggedIn, location.pathname]);

  const saveAdminAvailabilities = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/admin/availability`, { availabilities: adminAvailabilities });
      alert('Availability saved successfully!');
    } catch (err) {
      setError('Failed to save availabilities.');
    } finally {
      setLoading(false);
    }
  };

  const addAvailRow = () => {
    setAdminAvailabilities([...adminAvailabilities, { day_of_week: 1, start_time: '09:00', end_time: '17:00' }]);
  };

  const removeAvailRow = (index) => {
    setAdminAvailabilities(adminAvailabilities.filter((_, i) => i !== index));
  };

  const updateAvailRow = (index, field, value) => {
    const newData = [...adminAvailabilities];
    newData[index][field] = value;
    setAdminAvailabilities(newData);
  };

  return (
    <div className="app-container">
      <div className="background-shapes">
        <div className="shape s1"></div>
        <div className="shape s2"></div>
      </div>

      <main className="glass-canvas">
        <Routes>
          {/* User Booking Flow */}
          <Route path="/" element={
            <AnimatePresence mode="wait">
              {step === 0 ? (
                <MeetingTypes meetingTypes={meetingTypes} setSelectedType={setSelectedType} setStep={setStep} />
              ) : step === 4 ? (
                <div className="full-view-container">
                  <Success
                    selectedType={selectedType}
                    bookingData={bookingData}
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                  />
                </div>
              ) : (
                <div className="booking-layout">
                  <Sidebar
                    selectedType={selectedType}
                    setStep={setStep}
                    setSelectedDate={setSelectedDate}
                    setSelectedTime={setSelectedTime}
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                  />
                  <div className="content-area">
                    <AnimatePresence mode="wait">
                      {step === 1 && (
                        <motion.div key="dt" className="dt-split" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <Calendar
                            currentDate={currentDate}
                            setCurrentDate={setCurrentDate}
                            selectedDate={selectedDate}
                            setSelectedDate={setSelectedDate}
                            selectedType={selectedType}
                          />
                          {selectedDate && (
                            <Slots
                              selectedDate={selectedDate}
                              loading={loading}
                              availableSlots={availableSlots}
                              selectedTime={selectedTime}
                              setSelectedTime={setSelectedTime}
                              setStep={setStep}
                              selectedType={selectedType}
                            />
                          )}
                        </motion.div>
                      )}
                      {step === 3 && (
                        <BookingForm
                          bookingData={bookingData}
                          setBookingData={setBookingData}
                          handleBooking={handleBooking}
                          error={error}
                          setStep={setStep}
                          loading={loading}
                          selectedType={selectedType}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </AnimatePresence>
          } />

          {/* Admin Login */}
          <Route path="/login" element={
            isAdminLoggedIn ? <Navigate to="/admin" /> : (
              <AdminLogin
                adminCreds={adminCreds}
                setAdminCreds={setAdminCreds}
                handleAdminLogin={handleAdminLogin}
                error={error}
                setIsAdminView={() => navigate('/')}
                setError={setError}
              />
            )
          } />

          {/* Admin Dashboard */}
          <Route path="/admin" element={
            isAdminLoggedIn ? (
              <AdminDashboard
                adminAvailabilities={adminAvailabilities}
                setIsAdminLoggedIn={setIsAdminLoggedIn}
                handleLogout={handleLogout}
                saveAdminAvailabilities={saveAdminAvailabilities}
                loading={loading}
                addAvailRow={addAvailRow}
                removeAvailRow={removeAvailRow}
                updateAvailRow={updateAvailRow}
              />
            ) : <Navigate to="/login" />
          } />
        </Routes>
      </main>

      {!location.pathname.startsWith('/admin') && location.pathname !== '/login' && (
        <button className="admin-trigger" onClick={() => navigate('/login')}>
          <Lock size={12} /> Admin Login
        </button>
      )}
    </div>
  );
};

export default App;
