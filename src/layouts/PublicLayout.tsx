
import { Outlet } from 'react-router-dom';

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-florescer-background flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default PublicLayout;
