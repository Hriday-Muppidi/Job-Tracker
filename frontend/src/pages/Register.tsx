import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

type Form = { name?: string; email: string; password: string };

export function Register() {
  const { register, handleSubmit } = useForm<Form>();
  const navigate = useNavigate();
  const onSubmit = async (data: Form) => {
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, data);
    navigate('/login');
  };
  return (
    <div className="max-w-sm mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-lg font-semibold mb-4">Register</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <input {...register('name')} placeholder="Name" className="w-full border rounded px-3 py-2" />
        <input {...register('email')} placeholder="Email" className="w-full border rounded px-3 py-2" />
        <input {...register('password')} type="password" placeholder="Password" className="w-full border rounded px-3 py-2" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">Create account</button>
        <Link className="text-sm text-blue-600" to="/login">Have an account? Login</Link>
      </form>
    </div>
  );
}

