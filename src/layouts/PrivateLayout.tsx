import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, User, Heart, BookOpen, Moon, ShoppingBag, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const PrivateLayout = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  
  const currentPath = location.pathname;
  
  const isActivePath = (path: string) => {
    return currentPath === path;
  };
  
  return (
    <div className="min-h-screen bg-florescer-background flex flex-col">
      {/* Header */}
      <header className="w-full bg-white shadow-sm py-4 px-6">
        <div className="flex justify-between items-center">
          <Link to="/dashboard" className="text-florescer-primary font-lora text-2xl font-semibold">
            Florescer
          </Link>
          <div className="flex items-center space-x-2">
            <Link to="/shop">
              <Button variant="ghost" size="icon" className="text-florescer-primary">
                <ShoppingBag size={20} />
              </Button>
            </Link>
            <Link to="/settings">
              <Button variant="ghost" size="icon" className="text-florescer-primary">
                <Settings size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 container max-w-2xl px-4 py-6">
        <Outlet />
      </main>
      
      {/* Emergency Button */}
      <div className="fixed bottom-24 right-4 md:right-8 z-10">
        <Button 
          onClick={() => setShowEmergencyModal(true)}
          className="bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg px-4 py-2 text-sm font-medium"
        >
          Preciso disso agora
        </Button>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <nav className="w-full bg-white shadow-[0_-1px_4px_rgba(0,0,0,0.05)] fixed bottom-0 left-0 right-0 z-10">
        <div className="container max-w-md mx-auto">
          <div className="flex justify-between items-center py-3 px-6">
            <Link to="/dashboard" className={`flex flex-col items-center ${isActivePath('/dashboard') ? 'text-florescer-primary' : 'text-gray-500'}`}>
              <Home size={20} />
              <span className="text-xs mt-1">Início</span>
            </Link>
            
            <Link to="/ritual" className={`flex flex-col items-center ${isActivePath('/ritual') ? 'text-florescer-primary' : 'text-gray-500'}`}>
              <Heart size={20} />
              <span className="text-xs mt-1">Ritual</span>
            </Link>
            
            <Link to="/meditation" className={`flex flex-col items-center ${isActivePath('/meditation') ? 'text-florescer-primary' : 'text-gray-500'}`}>
              <Moon size={20} />
              <span className="text-xs mt-1">Meditar</span>
            </Link>
            
            <Link to="/diary" className={`flex flex-col items-center ${isActivePath('/diary') ? 'text-florescer-primary' : 'text-gray-500'}`}>
              <BookOpen size={20} />
              <span className="text-xs mt-1">Diário</span>
            </Link>
            
            <Link to="/my-forest" className={`flex flex-col items-center ${isActivePath('/my-forest') ? 'text-florescer-primary' : 'text-gray-500'}`}>
              <User size={20} />
              <span className="text-xs mt-1">Floresta</span>
            </Link>
          </div>
        </div>
      </nav>
      
      {/* Emergency Modal */}
      {showEmergencyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md animate-fade-in">
            <h2 className="text-xl font-lora font-semibold text-florescer-text mb-2">Meditações de Crise</h2>
            <p className="text-gray-600 mb-4">Escolha uma meditação para ajudar você agora:</p>
            
            <div className="space-y-3">
              <button className="w-full bg-florescer-light text-florescer-text p-4 rounded-xl flex items-center gap-3 hover:bg-florescer-primary hover:text-white transition-colors">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                  <Moon size={20} className="text-florescer-primary" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium">Volte a Dormir</h3>
                  <p className="text-sm opacity-80">5 minutos</p>
                </div>
              </button>
              
              <button className="w-full bg-florescer-light text-florescer-text p-4 rounded-xl flex items-center gap-3 hover:bg-florescer-primary hover:text-white transition-colors">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                  <Heart size={20} className="text-florescer-primary" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium">Segura em Mim</h3>
                  <p className="text-sm opacity-80">7 minutos</p>
                </div>
              </button>
              
              <button className="w-full bg-florescer-light text-florescer-text p-4 rounded-xl flex items-center gap-3 hover:bg-florescer-primary hover:text-white transition-colors">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                  <Moon size={20} className="text-florescer-primary" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium">Clareza no Caos</h3>
                  <p className="text-sm opacity-80">10 minutos</p>
                </div>
              </button>
            </div>
            
            <Button
              onClick={() => setShowEmergencyModal(false)}
              className="w-full mt-6"
              variant="outline"
            >
              Fechar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivateLayout;
