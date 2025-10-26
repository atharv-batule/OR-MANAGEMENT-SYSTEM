import React, { useState } from 'react';
import axios from 'axios';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';

const Login = () => {
  const [formData, setFormData] = useState({
    designation: '',
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const designations = [
    'Admin',
    'Attending Surgeon',
    'Resident',
    'Intern',
    'Nurse',
    'Anesthesiologist'
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.designation || !formData.email || !formData.password) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);
    try {
      // Replace with your backend endpoint
      const res = await axios.post('http://localhost:3000/login', formData);
      console.log('Login response:', res.data);

      if (res.data.success) {
        alert('Login successful!');
        // redirect to dashboard or home
        window.location.replace('/dashboard');

      } else {
        setError(res.data.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error(err);
      setError('Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="shadow-2xl m-4 shadow-blue-300"> 
    <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">OR Management System</h2>
    </div>
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <Card className="max-w-md w-full p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Designation <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.designation}
              onChange={(e) => handleChange('designation', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select Designation</option>
              {designations.map((role, idx) => (
                <option key={idx} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            required
          />

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full flex justify-center items-center"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
    </>
  );
};

export default Login;
