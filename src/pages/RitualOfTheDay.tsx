
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const RitualOfTheDay = () => {
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [completed, setCompleted] = useState(false);
  const { user } = useAuth();
  const { userMood, completeRitual, ritualStatus } = useApp();
  const navigate = useNavigate();

  // Helper function to get ritual content based on mood
  const getRitualContent = () => {
    switch (userMood) {
      case "cansada":
        return {
          message: "Hoje, permita-se descansar sem culpa. Seu corpo está pedindo uma pausa.",
          food: "Chá de camomila, nozes e uma fruta de sua preferência.",
          movement: "Alongamento suave para os ombros e pescoço, 5 minutos apenas.",
          task: "Liste 3 momentos em que você se sentiu forte hoje, mesmo estando cansada.",
        };
      case "aflita":
        return {
          message: "Respire fundo. A ansiedade é como uma onda - ela vem, mas também vai embora.",
          food: "Água com limão, banana e um punhado de amêndoas.",
          movement: "Respiração 4-7-8: inspire por 4 segundos, segure por 7, expire por 8.",
          task: "Escreva o que está gerando aflição e uma pequena ação que pode ajudar.",
        };
      case "sensível":
        return {
          message: "Hoje, permita-se acolher suas emoções com gentileza.",
          food: "Chá de melissa, aveia com canela e mel, frutas vermelhas.",
          movement: "10 minutos de caminhada lenta, focando na sua respiração.",
          task: "Escreva uma mensagem de compaixão para si mesma.",
        };
      case "irritada":
        return {
          message: "Sua irritação tem algo a ensinar. Observe-a com curiosidade, não julgamento.",
          food: "Água com pepino, proteína magra, vegetais verdes.",
          movement: "8 respirações profundas, tensionando e relaxando os músculos.",
          task: "Identifique o gatilho da irritação e anote uma forma construtiva de lidar com ele.",
        };
      case "esperançosa":
        return {
          message: "Esse brilho em você ilumina seu caminho. Celebre a esperança.",
          food: "Smoothie de frutas, iogurte com granola e mel.",
          movement: "Dança livre por 5 minutos com sua música favorita.",
          task: "Escreva uma intenção positiva para o dia de hoje.",
        };
      default:
        return {
          message: "A cada dia, uma nova oportunidade de se reconectar consigo mesma.",
          food: "Água, frutas frescas e uma porção de proteína magra.",
          movement: "10 minutos de alongamento suave para todo o corpo.",
          task: "Escreva 3 coisas pelas quais você é grata hoje.",
        };
    }
  };

  const ritual = getRitualContent();

  const toggleAudio = () => {
    setAudioPlaying(!audioPlaying);
  };

  const handleComplete = () => {
    if (ritualStatus.completed) {
      toast({
        title: "Ritual já concluído",
        description: "Você já completou o ritual de hoje. Continue amanhã!",
      });
      return;
    }

    setCompleted(true);
    completeRitual();
    
    setTimeout(() => {
      toast({
        title: "Ritual concluído!",
        description: "Uma nova flor foi adicionada à sua floresta.",
      });
      navigate("/my-forest");
    }, 1000);
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      <div>
        <h1 className="text-2xl font-lora font-semibold text-florescer-text">Ritual do Dia</h1>
        <p className="text-gray-600">Dia {ritualStatus.day} de {ritualStatus.totalDays}</p>
      </div>

      {/* Emotional Message */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-lora text-lg font-medium text-florescer-primary mb-2">Mensagem Emocional</h2>
        <p className="text-gray-700 italic">"{ritual.message}"</p>
      </div>

      {/* Morning Audio */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-lora text-lg font-medium text-florescer-primary mb-4">Áudio Matinal da Célia</h2>
        
        <div className="flex items-center justify-between bg-florescer-light rounded-xl p-4">
          <div className="flex items-center">
            <button 
              onClick={toggleAudio}
              className="w-10 h-10 rounded-full bg-florescer-primary text-white flex items-center justify-center mr-3"
            >
              {audioPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="6" y="4" width="4" height="16"></rect>
                  <rect x="14" y="4" width="4" height="16"></rect>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              )}
            </button>
            <div>
              <div className="font-medium">Ritual Diário para {userMood || 'Hoje'}</div>
              <div className="text-sm text-gray-500">5:32 • Por Célia</div>
            </div>
          </div>
          
          <div className="w-24 h-2 bg-white rounded-full overflow-hidden">
            <div 
              className="h-full bg-florescer-primary"
              style={{ width: audioPlaying ? '60%' : '0%', transition: 'width 0.3s' }}
            ></div>
          </div>
        </div>
      </div>

      {/* Food Suggestions */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-lora text-lg font-medium text-florescer-primary mb-2">Mini-Cardápio Funcional</h2>
        <p className="text-gray-700">{ritual.food}</p>
      </div>

      {/* Movement Suggestion */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-lora text-lg font-medium text-florescer-primary mb-2">Dica de Movimento</h2>
        <p className="text-gray-700">{ritual.movement}</p>
      </div>

      {/* Emotional Task */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-lora text-lg font-medium text-florescer-primary mb-2">Tarefa Emocional</h2>
        <p className="text-gray-700">{ritual.task}</p>
      </div>

      {/* Complete Button */}
      <div className="py-4">
        <Button
          className={`w-full py-6 text-lg ${completed ? 'bg-florescer-secondary' : 'florescer-button'}`}
          onClick={handleComplete}
          disabled={completed || ritualStatus.completed}
        >
          {completed || ritualStatus.completed ? "Ritual Concluído ✓" : "Concluir Ritual do Dia"}
        </Button>
      </div>
    </div>
  );
};

export default RitualOfTheDay;
