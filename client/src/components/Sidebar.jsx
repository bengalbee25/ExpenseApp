import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { logout, user } = useAuth();

  const linkClass = ({ isActive }) =>
    `${isActive ? 'navlink navlink-active' : 'navlink'} hover:text-gray-800`;

  return (
    <aside className="w-full md:w-64 bg-white md:h-screen md:sticky top-0 shadow-soft rounded-2xl p-4 flex md:flex-col gap-2">
      <div className="flex flex-col md:block">
        <h1 className="text-2xl font-bold text-brand-700">ExpenseApp</h1>
        {user && (
          <p className="text-base mt-2 text-gray-700/90 dark:text-gray-300 font-medium">
            Welcome, <span className="text-brand-700 font-semibold text-lg">{user.name}</span>
          </p>
        )}
      </div>

      <nav className="flex-1 flex flex-col gap-1 mt-4">
        <NavLink to="/" end className={linkClass}>
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/income" className={linkClass}>
          <span>Income</span>
        </NavLink>
        <NavLink to="/expenses" className={linkClass}>
          <span>Expenses</span>
        </NavLink>
        <NavLink to="/search" className={linkClass}>
          <span>Search Transactions</span>
        </NavLink>
        <NavLink to="/report" className={linkClass}>
          <span>Generate Report</span>
        </NavLink>
        <NavLink to="/change-password" className={linkClass}>
          <span>Change Password</span>
        </NavLink>

        <button
          type="button"
          onClick={() => {
            if (window.confirm('Are you sure you want to logout?')) {
              logout();
            }
          }}
          className="w-[85%] mx-auto mt-6 flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold text-red-600 border border-red-200 hover:bg-red-100 hover:text-red-700 hover:shadow-md transition-colors"
        >
          Logout
        </button>
      </nav>
    </aside>
  );
}
