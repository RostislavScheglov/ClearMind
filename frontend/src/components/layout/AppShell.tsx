import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const navItems = [
  { path: '/', label: 'Home', icon: '🏠', exact: true },
  { path: '/chat', label: 'Chat', icon: '💬' },
  { path: '/breathing', label: 'Breathe', icon: '🌬️' },
  { path: '/exercises', label: 'Exercises', icon: '🏋️' },
  { path: '/history', label: 'History', icon: '📋' },
  { path: '/insights', label: 'Insights', icon: '✨' },
  { path: '/account', label: 'Account', icon: '👤' },
];

// Show fewer items on mobile to avoid crowding
const mobileNavItems = navItems.filter((item) =>
  ['/', '/chat', '/breathing', '/exercises', '/account'].includes(item.path)
);

export function AppShell() {
  const location = useLocation();
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-white border-r border-gray-200 p-4">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-primary-700">🧠 ClearMind</h1>
          {user && <p className="text-sm text-gray-500 mt-1">Hi, {user.name}</p>}
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                (item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path))
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 pb-20 md:pb-0">
        <div className="max-w-3xl mx-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 z-40">
        {mobileNavItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-0.5 text-xs ${
              (item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path)) ? 'text-primary-700' : 'text-gray-500'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
