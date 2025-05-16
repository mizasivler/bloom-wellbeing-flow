
import { useEffect } from "react";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const MyForest = () => {
  const { ritualStatus } = useApp();
  const completedDays = ritualStatus.day - 1; // Since current day is not yet completed
  const totalDays = ritualStatus.totalDays;
  
  useEffect(() => {
    document.title = "Florescer - Minha Floresta";
  }, []);
  
  const getAchievementStatus = () => {
    if (completedDays >= 21) {
      return {
        title: "Floresta completa 🌸 x21",
        description: "Você concluiu 21 rituais! Sua floresta está em plena floração!",
        achieved: true
      };
    } else if (completedDays >= 7) {
      return {
        title: "Jardim com 7 flores 🌷",
        description: "Você concluiu 7 rituais! Seu jardim está crescendo!",
        achieved: true
      };
    } else if (completedDays >= 1) {
      return {
        title: "Primeira flor 🌱",
        description: "Você concluiu seu primeiro ritual! O início da sua jornada de florescimento!",
        achieved: true
      };
    } else {
      return {
        title: "Plante sua primeira flor 🌱",
        description: "Complete seu primeiro ritual para começar sua floresta.",
        achieved: false
      };
    }
  };
  
  const achievement = getAchievementStatus();
  
  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      <div>
        <h1 className="text-2xl font-lora font-semibold text-florescer-text">Minha Floresta</h1>
        <p className="text-gray-600">
          Acompanhe seu crescimento dia a dia
        </p>
      </div>
      
      {/* Forest Visualization */}
      <div className="bg-white rounded-2xl shadow-sm p-6 min-h-[300px] relative overflow-hidden">
        {/* Background with subtle pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-florescer-light/50 to-white"></div>
        
        {/* Ground */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-florescer-secondary/20 rounded-b-2xl"></div>
        
        {/* Forest Content */}
        <div className="relative h-[300px] flex items-end justify-center">
          <div className="grid grid-cols-7 gap-1 pb-4 px-4 w-full max-w-sm">
            {Array.from({ length: 21 }).map((_, index) => {
              const isGrown = index < completedDays;
              const flower = isGrown ? (
                <div className="flex flex-col items-center animate-grow-flower" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="text-2xl mb-1">
                    {index < 7 ? '🌸' : index < 14 ? '🌷' : '🌺'}
                  </div>
                  <div className="h-10 w-1 bg-florescer-secondary"></div>
                </div>
              ) : (
                <div className="flex flex-col items-center opacity-30">
                  <div className="text-2xl mb-1">
                    {index < 7 ? '🌱' : index < 14 ? '🌱' : '🌱'}
                  </div>
                  <div className="h-10 w-1 bg-gray-300"></div>
                </div>
              );
              return (
                <div key={index} className="flex justify-center">
                  {flower}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Progress Stats */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-lora text-lg font-medium text-florescer-text">Seu Progresso</h2>
          <div className="text-lg font-medium text-florescer-primary">
            {completedDays}/{totalDays}
          </div>
        </div>
        
        <div className="w-full bg-gray-100 rounded-full h-3 mb-4">
          <div 
            className="bg-florescer-primary rounded-full h-3 transition-all"
            style={{ width: `${(completedDays / totalDays) * 100}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>Início</span>
          <span>Meio</span>
          <span>Completo</span>
        </div>
      </div>
      
      {/* Achievement Card */}
      <div className={`p-6 rounded-2xl ${achievement.achieved ? 'bg-florescer-primary/10' : 'bg-gray-100'}`}>
        <div className="flex items-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
            achievement.achieved ? 'bg-florescer-primary text-white' : 'bg-gray-200 text-gray-500'
          }`}>
            {achievement.achieved ? '✓' : '🔒'}
          </div>
          <div>
            <h3 className="font-medium text-lg">{achievement.title}</h3>
            <p className="text-gray-600 text-sm">{achievement.description}</p>
          </div>
        </div>
      </div>
      
      {/* Next Steps */}
      <div className="py-4">
        {!ritualStatus.completed ? (
          <Link to="/ritual">
            <Button className="florescer-button w-full">
              Completar Ritual do Dia
            </Button>
          </Link>
        ) : (
          <div className="text-center text-gray-500 italic">
            Você já completou o ritual de hoje! Volte amanhã para continuar seu crescimento.
          </div>
        )}
      </div>
    </div>
  );
};

export default MyForest;
