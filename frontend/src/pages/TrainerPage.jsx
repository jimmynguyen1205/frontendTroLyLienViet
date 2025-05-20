import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const TrainerPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkRole = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        // Gọi API xác thực, ví dụ /api/auth/verify
        const res = await api.get('/auth/verify');
        if (res.role !== 'trainer') {
          setError('Không có quyền truy cập');
          setTimeout(() => navigate('/login'), 1500);
        } else {
          setLoading(false);
        }
      } catch (err) {
        setError('Không có quyền truy cập');
        setTimeout(() => navigate('/login'), 1500);
      }
    };
    checkRole();
  }, [navigate]);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Đang kiểm tra quyền truy cập...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen text-red-600">{error}</div>;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-2xl font-bold">Trainer Page - Chỉ trainer mới thấy trang này!</div>
      {/* TODO: Thêm giao diện huấn luyện AI ở đây */}
    </div>
  );
};

export default TrainerPage; 