import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../store/store';

const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { email } = useSelector((state: RootState) => state.admin);

  if (!email) {
    return <Navigate to="/admin/login" />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
