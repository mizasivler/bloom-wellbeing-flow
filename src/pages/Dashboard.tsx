
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useApp } from '@/contexts/AppContext';
import { Heart, Calendar, BookOpen, MessageSquare, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { user } = useAuth();
  const { userMood, setUserMood, ritualStatus } = useApp();
  const firstName = user?.full_name?.split(' ')[0] || '';
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };
  
  const moodOptions = [
    { value: 'cansada', emoji: '😴', label: 'Cansada' },
    { value: 'aflita', emoji: '😟', label: 'Aflita' },
    { value: 'sensível', emoji: '🥺', label: 'Sensível' },
    { value: 'irritada', emoji: '😤', label: 'Irritada' },
    { value: 'esperançosa', emoji: '😊', label: 'Esperançosa' }
  ];
  
  useEffect(() => {
    document.title = "Florescer - Dashboard";
  }, []);
  
  return (
    <div className="space-y-8 pb-20 animate-fade-in">
      {/* Header and Greeting */}
      <div>
        <h1 className="text-2xl font-lora font-semibold text-florescer-text">
          {getGreeting()}, {firstName}!
        </h1>
        <p className="text-gray-600">Como está se sentindo hoje?</p>
      </div>
      
      {/* Mood Selector */}
      <div className="flex justify-between py-2">
        {moodOptions.map((mood) => (
          <button
            key={mood.value}
            onClick={() => setUserMood(mood.value as any)}
            className={`flex flex-col items-center transition-all ${
              userMood === mood.value ? 'scale-110 text-florescer-primary' : 'text-gray-500'
            }`}
          >
            <span className="text-3xl mb-1">{mood.emoji}</span>
            <span className="text-xs">{mood.label}</span>
          </button>
        ))}
      </div>
      
      {/* Progress Bar */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Dia {ritualStatus.day} de {ritualStatus.totalDays}</span>
          <span className="text-sm text-florescer-primary">Florescendo...</span>
        </div>
        
        <div className="w-full bg-gray-100 rounded-full h-3">
          <div 
            className="bg-florescer-primary rounded-full h-3 transition-all"
            style={{ width: `${(ritualStatus.day / ritualStatus.totalDays) * 100}%` }}
          ></div>
        </div>
        
        <div className="mt-2 flex">
          {Array.from({ length: Math.min(ritualStatus.day, 7) }).map((_, i) => (
            <span key={i} className="text-lg mr-1">🌸</span>
          ))}
          {Array.from({ length: Math.max(0, 7 - ritualStatus.day) }).map((_, i) => (
            <span key={i} className="text-lg mr-1 opacity-30">🌸</span>
          ))}
        </div>
      </div>
      
      {/* Quick Access Blocks */}
      <div className="grid grid-cols-2 gap-4">
        <Link to="/ritual" className="florescer-card hover:shadow-md">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-florescer-light flex items-center justify-center mb-2">
              <Heart className="text-florescer-primary" size={24} />
            </div>
            <h2 className="font-medium">Ritual do Dia</h2>
            <p className="text-sm text-gray-500 mt-1">Cuide de si hoje</p>
          </div>
        </Link>
        
        <Link to="/meditation" className="florescer-card hover:shadow-md">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-florescer-light flex items-center justify-center mb-2">
              <div className="text-florescer-primary">🧘‍♀️</div>
            </div>
            <h2 className="font-medium">Meditação</h2>
            <p className="text-sm text-gray-500 mt-1">Acalme sua mente</p>
          </div>
        </Link>
        
        <Link to="/planner" className="florescer-card hover:shadow-md">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-florescer-light flex items-center justify-center mb-2">
              <Calendar className="text-florescer-primary" size={24} />
            </div>
            <h2 className="font-medium">Meu Planner</h2>
            <p className="text-sm text-gray-500 mt-1">Organize seu dia</p>
          </div>
        </Link>
        
        <Link to="/diary" className="florescer-card hover:shadow-md">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-florescer-light flex items-center justify-center mb-2">
              <BookOpen className="text-florescer-primary" size={24} />
            </div>
            <h2 className="font-medium">Diário da Emoção</h2>
            <p className="text-sm text-gray-500 mt-1">Expresse seus sentimentos</p>
          </div>
        </Link>
        
        <Link to="/message" className="florescer-card hover:shadow-md">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-florescer-light flex items-center justify-center mb-2">
              <MessageSquare className="text-florescer-primary" size={24} />
            </div>
            <h2 className="font-medium">Mensagem da Célia</h2>
            <p className="text-sm text-gray-500 mt-1">Inspiração diária</p>
          </div>
        </Link>
        
        <Link to="/my-forest" className="florescer-card hover:shadow-md">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-florescer-light flex items-center justify-center mb-2">
              <div className="text-florescer-primary">🌿</div>
            </div>
            <h2 className="font-medium">Minha Floresta</h2>
            <p className="text-sm text-gray-500 mt-1">Veja seu progresso</p>
          </div>
        </Link>
      </div>
      
      {/* Shop Banner */}
      <div className="bg-gradient-to-r from-florescer-primary/10 to-florescer-secondary/10 rounded-xl p-6 text-center">
        <h2 className="font-lora text-xl font-medium mb-2">Desbloquear recursos premium</h2>
        <p className="text-gray-600 mb-4">Acesse meditações exclusivas e conteúdos personalizados</p>
        <Link to="/shop">
          <Button className="florescer-button">
            <ShoppingBag size={16} className="mr-2" />
            Visitar Loja
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
