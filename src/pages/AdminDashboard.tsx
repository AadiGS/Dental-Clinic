import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { format } from 'date-fns';

export default function AdminDashboard({ token, onLogout }) {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [loading, setLoading] = useState(true);
  
  // Booking Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [newAppointment, setNewAppointment] = useState({
    patientName: '',
    phoneNumber: '',
    timeSlot: ''
  });

  useEffect(() => {
    fetchAppointments();
    const interval = setInterval(fetchAppointments, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, [selectedDate]);

  useEffect(() => {
    if (isModalOpen) {
      fetchSlots();
    }
  }, [isModalOpen, selectedDate]);

  const fetchAppointments = async () => {
    try {
      const data = await api.getAdminAppointments(token, selectedDate);
      setAppointments(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSlots = async () => {
    try {
      const data = await api.getSlots(selectedDate);
      setAvailableSlots(data.availableSlots);
    } catch (err) {
      console.error('Failed to fetch slots', err);
    }
  };

  const handleCancel = async (id) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await api.cancelAppointment(token, id);
      fetchAppointments();
    } catch (err) {
      alert('Failed to cancel');
    }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    try {
      await api.adminBookAppointment(token, {
        ...newAppointment,
        date: selectedDate
      });
      setIsModalOpen(false);
      setNewAppointment({ patientName: '', phoneNumber: '', timeSlot: '' });
      fetchAppointments();
      alert('Appointment booked successfully');
    } catch (err) {
      alert('Failed to book appointment');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={onLogout}
                className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <label htmlFor="date" className="text-sm font-medium text-gray-700">Select Date:</label>
              <input
                type="date"
                id="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
              />
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Book Appointment
            </button>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {appointments.length === 0 ? (
                <li className="px-4 py-4 sm:px-6 text-center text-gray-500">No appointments for this date.</li>
              ) : (
                appointments.map((appt) => (
                  <li key={appt.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <p className="text-sm font-medium text-teal-600 truncate">
                            {appt.time_slot} - {appt.patient_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {appt.phone_number} {appt.created_by === 'admin' && <span className="text-xs bg-gray-200 px-1 rounded ml-2">Admin Booked</span>}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            appt.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {appt.status}
                          </span>
                          {appt.status !== 'cancelled' && (
                            <button
                              onClick={() => handleCancel(appt.id)}
                              className="ml-4 text-sm text-red-600 hover:text-red-900"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </main>

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative z-20">
              <form onSubmit={handleBook}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                        Book Appointment for {selectedDate}
                      </h3>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Patient Name</label>
                          <input
                            type="text"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                            value={newAppointment.patientName}
                            onChange={(e) => setNewAppointment({...newAppointment, patientName: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                          <input
                            type="tel"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                            value={newAppointment.phoneNumber}
                            onChange={(e) => setNewAppointment({...newAppointment, phoneNumber: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Time Slot</label>
                          <select
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                            value={newAppointment.timeSlot}
                            onChange={(e) => setNewAppointment({...newAppointment, timeSlot: e.target.value})}
                          >
                            <option value="">Select a slot</option>
                            {availableSlots.map(slot => (
                              <option key={slot} value={slot}>{slot}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-teal-600 text-base font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Book
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
