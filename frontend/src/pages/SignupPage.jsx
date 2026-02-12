import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router';
import { GoogleLogin } from '@react-oauth/google';
import { registerSchema } from '../utils/schemas';
import { registerUser, googleAuthUser, clearError } from '../redux/slices/authSlice';
import { 
  Eye, 
  EyeOff, 
  Loader2, 
  User, 
  Mail, 
  Calendar, 
  Lock, 
  Code2 
} from 'lucide-react';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

const SignupPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(registerSchema),
    });

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
        return () => {
            dispatch(clearError());
        }
    }, [isAuthenticated, navigate, dispatch]);

    const onSubmit = async (data) => {
        const resultAction = await dispatch(registerUser(data));
        if (registerUser.fulfilled.match(resultAction)) {
            toast.success('Account created successfully! Welcome to CodeClimb.');
        } else {
            toast.error(resultAction.payload || 'Registration failed');
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        const resultAction = await dispatch(googleAuthUser(credentialResponse.credential));
        if (googleAuthUser.fulfilled.match(resultAction)) {
            toast.success('Account created successfully! Welcome to CodeClimb.');
        } else {
            toast.error(resultAction.payload || 'Google Sign Up failed');
        }
    };

return (
  <div className="min-h-screen flex items-center justify-center bg-base-200 py-8 px-4 relative overflow-hidden">

    <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-primary/20 rounded-full blur-[96px] opacity-60"></div>
    <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 bg-secondary/20 rounded-full blur-[96px] opacity-60"></div>

    <div className="card w-full max-w-md bg-base-100 shadow-xl rounded-2xl border border-base-200 z-10">
      <div className="card-body p-6 sm:p-8">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary mb-3">
            <Code2 size={22} />
          </div>
          <h2 className="text-2xl font-bold">Create Account</h2>
          <p className="text-base-content/60 text-xs mt-1">Join the community</p>
        </div>

        {/* Error Banner */}
        {error && (
          <div role="alert" className="alert alert-error text-xs py-2 mb-4 rounded-lg font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-4 w-4" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <div className="form-control">
            <label className="label pb-1">
              <span className="label-text text-xs font-medium uppercase opacity-70">Full Name</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={16} />
              <input
                type="text"
                className={`input input-bordered h-10 w-full pl-9 rounded-lg ${errors.fullName ? 'input-error' : ''}`}
                {...register('fullName')}
              />
            </div>
            {errors.fullName && <span className="text-xs text-error mt-1">{errors.fullName.message}</span>}
          </div>

          {/* Email */}
          <div className="form-control">
            <label className="label pb-1">
              <span className="label-text text-xs font-medium uppercase opacity-70">Email</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={16} />
              <input
                type="email"
                className={`input input-bordered h-10 w-full pl-9 rounded-lg ${errors.emailId ? 'input-error' : ''}`}
                {...register('emailId')}
              />
            </div>
            {errors.emailId && <span className="text-xs text-error mt-1">{errors.emailId.message}</span>}
          </div>

          {/* Password */}
          <div className="form-control">
            <label className="label pb-1">
              <span className="label-text text-xs font-medium uppercase opacity-70">Password</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={16} />
              <input
                type={showPassword ? 'text' : 'password'}
                className={`input input-bordered h-10 w-full pl-9 pr-9 rounded-lg ${errors.password ? 'input-error' : ''}`}
                {...register('password')}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <span className="text-xs text-error mt-1">{errors.password.message}</span>}
          </div>

          {/* Confirm Password */}
          <div className="form-control">
            <label className="label pb-1">
              <span className="label-text text-xs font-medium uppercase opacity-70">Confirm Password</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={16} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                className={`input input-bordered h-10 w-full pl-9 pr-9 rounded-lg ${errors.confirmPassword ? 'input-error' : ''}`}
                {...register('confirmPassword')}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && <span className="text-xs text-error mt-1">{errors.confirmPassword.message}</span>}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-full h-10 text-sm rounded-lg font-bold mt-1 shadow-md shadow-primary/20" 
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" size={16}/> : 'Get Started'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex py-3 items-center">
          <div className="flex-grow border-t border-base-300"></div>
          <span className="mx-2 text-[10px] font-medium text-base-content/50 uppercase">Or</span>
          <div className="flex-grow border-t border-base-300"></div>
        </div>

        {/* Google Login */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error('Google Sign Up Failed')}
            useOneTap
            theme="outline"
            size="medium"
            shape="circle"
          />
        </div>

        {/* Footer */}
        <p className="text-center mt-4 text-xs text-base-content/60">
          Already have an account? <Link to="/login" className="link link-primary font-bold">Log in</Link>
        </p>
      </div>
    </div>
  </div>
)}

export default SignupPage;