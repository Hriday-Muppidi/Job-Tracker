import { Link, Outlet, useNavigate } from 'react-router-dom';

export function Layout() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-semibold">Job Tracker</Link>
          <nav className="space-x-4">
            {!token && <Link to="/login" className="text-sm">Login</Link>}
            {!token && <Link to="/register" className="text-sm">Register</Link>}
            {token && (
              <button
                className="text-sm text-red-600"
                onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}
              >Logout</button>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}

