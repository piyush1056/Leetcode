import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router';
import { registerUser, clearError } from '../authSlice'
import { useEffect, useState } from 'react';
import GoogleSignInButton from '../components/GoogleSignInButton';
import toast from 'react-hot-toast';

const signupSchema = z.object({
  firstName: z.string().min(3, "First name must be at least 3 characters"),
  lastName: z.string().min(3, "Last name must be at least 3 characters"),
  emailId: z.string().email("Invalid email address"),
  age: z.number().min(6, "Age must be at least 6").max(80, "Age must be less than 80"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error, initialCheckDone } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ 
    resolver: zodResolver(signupSchema),
    defaultValues: {
      age: 18
    }
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error && hasSubmitted && initialCheckDone) {
      toast.error(error);
      dispatch(clearError());
      setHasSubmitted(false);
    }
  }, [error, hasSubmitted, initialCheckDone, dispatch]);

  const onSubmit = async (data) => {
    setHasSubmitted(true);
    try {
      const result = await dispatch(registerUser(data)).unwrap();
      if (result) {
        toast.success('Account created successfully! Welcome to CodeClimb! 🎉');
      }
    } catch (error) {
      // Error handled by useEffect
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 py-8"
      style={{
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 25%, #ede9fe 50%, #fdf2f8 75%, #fff7ed 100%)'
      }}
    >
      {/* Main Card Container - FIXED HEIGHT */}
      <div className="w-full max-w-md">
        {/* Card with REDUCED padding and COMPACT spacing */}
        <div 
          className="bg-white rounded-2xl p-6 w-full"
          style={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          {/* Header - REDUCED margins */}
          <div className="text-center mb-6">
            <h1 
              className="text-3xl font-bold mb-2"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              CodeClimb
            </h1>
            <p className="text-gray-600 text-sm font-medium">
              🚀 Join our community and start coding your future!
            </p>
          </div>
          
          {/* Google Sign-In Button */}
          <div className="mb-4">
            <GoogleSignInButton />
          </div>

          {/* Divider - REDUCED margins */}
          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-sm text-gray-500 bg-white">or continue with email</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Fields Row */}
            <div className="grid grid-cols-2 gap-3">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="John"
                  className={`w-full px-3 py-2.5 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 text-gray-900 font-medium ${
                    errors.firstName 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50' 
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200 bg-white focus:bg-white'
                  }`}
                  style={{
                    color: '#111827',
                    backgroundColor: errors.firstName ? '#fef2f2' : '#ffffff'
                  }}
                  {...register('firstName')}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Doe"
                  className={`w-full px-3 py-2.5 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 text-gray-900 font-medium ${
                    errors.lastName 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50' 
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200 bg-white focus:bg-white'
                  }`}
                  style={{
                    color: '#111827',
                    backgroundColor: errors.lastName ? '#fef2f2' : '#ffffff'
                  }}
                  {...register('lastName')}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                className={`w-full px-3 py-2.5 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 text-gray-900 font-medium ${
                  errors.emailId 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50' 
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200 bg-white focus:bg-white'
                }`}
                style={{
                  color: '#111827',
                  backgroundColor: errors.emailId ? '#fef2f2' : '#ffffff'
                }}
                {...register('emailId')}
              />
              {errors.emailId && (
                <p className="text-red-500 text-xs mt-1">{errors.emailId.message}</p>
              )}
            </div>

            {/* Age Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age
              </label>
              <input
                type="number"
                placeholder="18"
                min="6"
                max="80"
                className={`w-full px-3 py-2.5 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 text-gray-900 font-medium ${
                  errors.age 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50' 
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200 bg-white focus:bg-white'
                }`}
                style={{
                  color: '#111827',
                  backgroundColor: errors.age ? '#fef2f2' : '#ffffff'
                }}
                {...register('age', { valueAsNumber: true })}
              />
              {errors.age && (
                <p className="text-red-500 text-xs mt-1">{errors.age.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full px-3 py-2.5 pr-12 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 text-gray-900 font-medium ${
                    errors.password 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50' 
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200 bg-white focus:bg-white'
                  }`}
                  style={{
                    color: '#111827',
                    backgroundColor: errors.password ? '#fef2f2' : '#ffffff'
                  }}
                  {...register('password')}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button - REDUCED margins */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2.5 px-4 rounded-lg text-white font-semibold transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-blue-200 ${
                  loading 
                    ? 'opacity-80 cursor-not-allowed' 
                    : 'hover:shadow-xl active:scale-[0.98]'
                }`}
                style={{
                  background: loading 
                    ? 'linear-gradient(135deg, #9ca3af, #6b7280)' 
                    : 'linear-gradient(135deg, #0ea5e9, #3b82f6, #8b5cf6)',
                  boxShadow: loading ? 'none' : '0 10px 25px -5px rgba(59, 130, 246, 0.4)'
                }}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  '✨ Create Account'
                )}
              </button>
            </div>
          </form>

          {/* Login Link - REDUCED margins */}
          <div className="text-center mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Already part of our community?{' '}
              <NavLink 
                to="/login" 
                className="font-semibold text-blue-600 hover:text-purple-600 transition-colors"
              >
                Sign in here
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
