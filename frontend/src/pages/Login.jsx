import React, { useState } from 'react';
import axios from 'axios';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';

const Login = () => {
  const [formData, setFormData] = useState({
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
    if (!formData.email || !formData.password) {
      setError('All fields are required.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setError('');
    setIsSubmitting(true);

    try {
      const payload = {
        email: formData.email,
        password: formData.password
      };
      
      console.log('Payload being sent:', payload);

      // POST request to backend
      const res = await axios.post('http://localhost:3000/login', payload);
      
      console.log('Login response:', res.data);

      if (res.data.success) {
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(res.data.user));
        
        // Success message
        alert(`Welcome back!`);
        
        // Redirect to dashboard
        window.location.replace('/dashboard');
      } else {
        setError(res.data.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      
      if (err.response) {
        // Server responded with error
        setError(err.response.data.message || 'Invalid email or password.');
      } else if (err.request) {
        // Request made but no response
        setError('Unable to reach server. Please try again.');
      } else {
        // Something else happened
        setError('Login failed. Please check your credentials.');
      }
    } finally {
      setIsSubmitting(false);
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
            {/* Login Fields Section */}
            <section className="space-y-4">
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
                placeholder="Enter your password"
                required
              />
            </section>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600 text-center">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full flex justify-center items-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
};

export default Login;