import { RouterProvider } from 'react-router';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { LoginModal } from './components/LoginModal';
import { router } from './routes';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
        {/* Global login modal — triggered by 401 LOGIN_MODAL responses */}
        <LoginModal />
      </AuthProvider>
    </ThemeProvider>
  );
}
