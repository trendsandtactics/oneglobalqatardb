import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import AdminSidebar from '@/pages/AdminSidebar';
import { isLoggedIn } from '@/pages/api';

const AdminLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/admin/login');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto p-8">
          <Outlet />
        </div>
      </main>
      <Toaster richColors />
    </div>
  );
};

export default AdminLayout;
