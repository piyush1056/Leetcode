import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router';
import { GoogleLogin } from '@react-oauth/google';
import { loginSchema } from '../utils/schemas';
import { loginUser, googleAuthUser, clearError } from '../redux/slices/authSlice';
import { 
  Eye, 
  EyeOff, 
  Loader2, 
  Lock, 
  Mail, 
  Code2 
} from 'lucide-react';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
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
        const resultAction = await dispatch(loginUser(data));
        if (loginUser.fulfilled.match(resultAction)) {
            toast.success('Logged in successfully!');
        } else {
            toast.error(resultAction.payload || 'Login failed');
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        const resultAction = await dispatch(googleAuthUser(credentialResponse.credential));
        if (googleAuthUser.fulfilled.match(resultAction)) {
            toast.success('Logged in successfully!');
        } else {
            toast.error(resultAction.payload || 'Google Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 p-4 relative overflow-hidden">
            
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[128px] opacity-60"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-secondary/20 rounded-full blur-[128px] opacity-60"></div>

            {/* Card Container  */}
            <div className="card w-full max-w-md bg-base-100 shadow-2xl rounded-2xl border border-base-200 z-10">
                <div className="card-body p-8 sm:p-10">
                    
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
                            <Code2 size={28} />
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight">Welcome Back</h2>
                        <p className="text-sm text-base-content/60 mt-1">Sign in to continue climbing</p>
                    </div>

                    {/* Error Banner */}
                    {error && (
                        <div role="alert" className="alert alert-error text-xs py-3 mb-6 rounded-lg font-medium">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        
                        {/* Email Field */}
                        <div className="form-control w-full">
                            <label className="label pt-0 pb-1.5">
                                <span className="label-text font-medium text-xs uppercase tracking-wide opacity-70">Email Address</span>
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
                                <input
                                    type="email"
                                    className={`input input-bordered w-full pl-10 h-11 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all ${errors.emailId ? 'input-error' : ''}`}
                                    {...register('emailId')}
                                />
                            </div>
                            {errors.emailId && (
                                <span className="text-xs text-error mt-1 ml-1">{errors.emailId.message}</span>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="form-control w-full">
                            <div className="flex justify-between items-center pb-1.5">
                                <label className="label pt-0 pb-0">
                                    <span className="label-text font-medium text-xs uppercase tracking-wide opacity-70">Password</span>
                                </label>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className={`input input-bordered w-full pl-10 pr-10 h-11 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all ${errors.password ? 'input-error' : ''}`}
                                    {...register('password')}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && (
                                <span className="text-xs text-error mt-1 ml-1">{errors.password.message}</span>
                            )}
                        </div>

                        <button 
                            type="submit" 
                            className="btn btn-primary w-full h-11 text-sm rounded-xl font-bold mt-2 shadow-lg shadow-primary/20" 
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Sign In'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative flex py-4 items-center">
                        <div className="flex-grow border-t border-base-300"></div>
                        <span className="flex-shrink-0 mx-3 text-[10px] font-bold text-base-content/40 uppercase tracking-widest">Or continue with</span>
                        <div className="flex-grow border-t border-base-300"></div>
                    </div>

                    {/* Google Login */}
                    <div className="flex justify-center w-full">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => toast.error('Google Login Failed')}
                            useOneTap
                            theme="outline"
                            size="large"
                            width="100%"
                            shape="circle"
                        />
                    </div>

                    {/* Footer */}
                    <p className="text-center mt-6 text-sm text-base-content/60">
                        Don't have an account? <Link to="/register" className="link link-primary font-bold no-underline hover:underline">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;