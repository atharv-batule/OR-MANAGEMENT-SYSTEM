import React, { useState } from 'react';
import axios from 'axios';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import { Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    id: "",
    email: "",
    role: "",
    fname: "",
    lname: "",
    password: ""
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const validateForm = () => {
    const { id, email, role, fname, lname, password } = formData;

    if (!id || !email || !role || !fname || !lname || !password) {
      setError("All fields are required.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:3000/register', formData);
      if (res.data.success) {
        alert('Registration successful! Please login.');
        window.location.replace('/login');
      } else {
        setError(res.data.message || 'Registration failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to register. Try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="pt-10 shadow-blue-300 bg-gray-100 px-4 bg-gradient-to-bl from-[#fdfdb1] to-[#85edff]">  
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          OR Management System
        </h2>
      </div>

      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 bg-gradient-to-bl from-[#85edff] to-[#fdfdb1]">
        <Card className="max-w-md w-full p-8 shadow-xl shadow-blue-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Register</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <section className="space-y-4">

              {/* ID */}
              <Input
                label="User ID"
                type="number"
                value={formData.id}
                onChange={(e) => handleInputChange('id', e.target.value)}
                placeholder="Enter user ID"
                required
              />

              {/* First Name */}
              <Input
                label="First Name"
                type="text"
                value={formData.fname}
                onChange={(e) => handleInputChange('fname', e.target.value)}
                placeholder="Enter first name"
                required
              />

              {/* Last Name */}
              <Input
                label="Last Name"
                type="text"
                value={formData.lname}
                onChange={(e) => handleInputChange('lname', e.target.value)}
                placeholder="Enter last name"
                required
              />

              {/* Email */}
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
                required
              />

              {/* Role Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                  required
                >
                  <option value="">Select Role</option>
                  <option value="Admin">Admin</option>
                  <option value="Surgeon">Surgeon</option>
                  <option value="Nurse">Nurse</option>
                  <option value="Anesthesiologist">Anesthesiologist</option>
                  <option value="Staff">Staff</option>
                </select>
              </div>

              {/* Password */}
              <Input
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Create a password"
                required
              />

            </section>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600 text-center">{error}</p>
              </div>
            )}

            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full flex justify-center items-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Registering...' : 'Register'}
              </Button>
            </div>

            <p className="text-center text-sm text-gray-600 pt-2">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:underline">
                Login
              </Link>
            </p>
          </form>
        </Card>
      </div>
    </>
  );
};

export default Register;
