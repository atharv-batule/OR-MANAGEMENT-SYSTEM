import React, { useState } from 'react';
import axios from 'axios';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import { Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password) {
      setError('All fields are required.');
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
      <div className=" m-4 shadow-blue-300"> 
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          OR Management System
        </h2>
      </div>

      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
        <Card className="max-w-md w-full p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Register</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <section className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
                required
              />
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
                required
              />
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
