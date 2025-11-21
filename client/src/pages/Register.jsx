import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const togglePassword = () => setShowPassword(prev => !prev);

  const submit = async (e) => {
    e.preventDefault();
    try { await register(name, email, password); nav('/'); }
    catch (e) { setError(e.response?.data?.message || 'Registration failed'); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={submit} className="card w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-brand-700">Create your account</h2>
        {error && <p className="text-red-600 mb-2 text-sm">{error}</p>}
        <input className="input mb-3" name="name" placeholder="Name"  value={name} onChange={e=>setName(e.target.value)} required autoComplete="name" />
        <input className="input mb-3" type="email" name="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="email" />
        {/* <input className="input mb-4" type="password" placeholder="Password (min 6)" value={password} onChange={e=>setPassword(e.target.value)} required /> */}
        <div className="relative mb-4">
          <input
            className="input w-full pr-12"
            type={showPassword ? "text" : "password"}
            name="password" 
            placeholder="Password (min 6)"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={togglePassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        <button className="btn-primary w-full">Register</button>
        <p className="text-sm text-gray-500 mt-3">Have an account? <Link className="text-brand-700" to="/login">Login</Link></p>
      </form>
    </div>
  );
}
