import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLogin } from '../api/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { apiClient } from '../api/client';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const loginMutation = useLogin();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    loginMutation.mutate(formData, {
      onSuccess: async (data) => {
        localStorage.setItem('access_token', data.access_token);
        try {
          const userRes = await apiClient.get('/auth/me');
          login(data.access_token, userRes.data);
          navigate('/');
        } catch (err) {
            setError("Failed to fetch user details.");
            localStorage.removeItem('access_token');
        }
      },
      onError: (err: any) => {
        if (!err.response) {
          setError("Network error: Cannot connect to server. Please ensure the backend is running with --host 0.0.0.0.");
        } else {
          setError(err.response?.data?.detail || "Invalid email or password");
        }
      }
    });
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0B1135] text-white flex-col px-16 py-12 justify-center relative overflow-hidden">
        <div className="absolute top-12 left-12 flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-[#1a2356] flex items-center justify-center border border-indigo-500/30">
            <span className="font-bold text-lg text-indigo-400">G</span>
          </div>
          <span className="text-xl font-bold">FormBuilder</span>
        </div>
        
        <div className="max-w-xl relative z-10 mt-20">
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Build Smarter<br />
            Forms. Collect<br />
            Better Responses.
          </h1>
          <p className="text-lg text-gray-300">
            Create powerful, flexible and dynamic forms: surveys, assessments, quizzes and more.
          </p>
        </div>
        
        {/* Abstract background shapes */}
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
            <p className="text-gray-500">Please sign in to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="admin@example.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 border-gray-200 focus-visible:ring-indigo-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 border-gray-200 focus-visible:ring-indigo-500 pr-10"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" className="border-gray-300 text-indigo-600 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600" />
                <Label htmlFor="remember" className="text-sm font-normal text-gray-600 cursor-pointer">Remember me</Label>
              </div>
              <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                Forgot password?
              </a>
            </div>

            <Button 
                type="submit" 
                className="w-full h-12 bg-[#5F3EE7] hover:bg-indigo-700 text-white font-medium rounded-lg text-base" 
                disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
