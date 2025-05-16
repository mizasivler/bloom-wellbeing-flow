
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";

const Meditation = () => {
  const [activeAudio, setActiveAudio] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { userMood } = useApp();
  
  useEffect(() => {
    document.title = "Florescer - Meditação";
    
    // Clean up audio when component unmounts
    return () => {
      setIsPlaying(false);
    };
  }, []);
  
  const meditations = [
    {
      id: "meditation-1",
      title: "Respiração de Calma",
      duration: "5 min",
      description: "Técnica de respiração para acalmar a mente e o corpo.",
      category: "calma",
      premium: false
    },
    {
      id: "meditation-2",
      title: "Autocompaixão",
      duration: "8 min",
      description: "Meditação guiada para cultivar autocompaixão e acolhimento.",
      category: "sensivel",
      premium: false
    },
    {
      id: "meditation-3",
      title: "Clareza Mental",
      duration: "10 min",
      description: "Meditação para trazer clareza em momentos de indecisão.",
      category: "irritada",
      premium: false
    },
    {
      id: "meditation-4",
      title: "Reconexão com o Corpo",
      duration: "15 min",
      description: "Meditação guiada para reconectar-se com seu corpo durante a menopausa.",
      category: "cansada",
      premium: true
    },
    {
      id: "meditation-5",
      title: "Florescer na Transição",
      duration: "12 min",
      description: "Visualização guiada para abraçar a transição da menopausa.",
      category: "esperancosa",
      premium: true
    }
  ];
  
  // Helper to get recommended meditations based on user's mood
  const getRecommendedMeditations = () => {
    if (!userMood) return meditations.filter(m => !m.premium).slice(0, 2);
    
    const moodMap: Record<string, string> = {
      "cansada": "calma",
      "aflita": "calma",
      "sensivel": "sensivel",
      "irritada": "irritada",
      "esperancosa": "esperancosa"
    };
    
    const recommendedCategory = moodMap[userMood] || "calma";
    const recommended = meditations.filter(m => 
      m.category === recommendedCategory || !m.premium
    ).slice(0, 2);
    
    return recommended.length ? recommended : meditations.filter(m => !m.premium).slice(0, 2);
  };
  
  const togglePlay = (id: string) => {
    if (activeAudio === id) {
      setIsPlaying(!isPlaying);
    } else {
      setActiveAudio(id);
      setIsPlaying(true);
    }
  };
  
  const recommendedMeditations = getRecommendedMeditations();
  
  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      <div>
        <h1 className="text-2xl font-lora font-semibold text-florescer-text">Meditação</h1>
        <p className="text-gray-600">Momentos de calma e reconexão</p>
      </div>
      
      {/* Recommendation Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-lora text-florescer-primary">Recomendadas para você</h2>
        
        <div className="space-y-3">
          {recommendedMeditations.map((meditation) => (
            <div 
              key={meditation.id}
              className="bg-white rounded-2xl shadow-sm p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <button 
                    onClick={() => togglePlay(meditation.id)}
                    className="w-12 h-12 rounded-full bg-florescer-primary text-white flex items-center justify-center mr-3"
                  >
                    {isPlaying && activeAudio === meditation.id ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="6" y="4" width="4" height="16"></rect>
                        <rect x="14" y="4" width="4" height="16"></rect>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                    )}
                  </button>
                  <div>
                    <div className="font-medium">{meditation.title}</div>
                    <div className="text-sm text-gray-500">{meditation.duration}</div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">{meditation.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Library Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-lora text-florescer-primary">Biblioteca</h2>
        
        <div className="grid grid-cols-1 gap-3">
          {meditations.map((meditation) => (
            <div 
              key={meditation.id}
              className={`bg-white rounded-2xl shadow-sm p-4 ${meditation.premium ? 'border border-florescer-secondary/30' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <button 
                    onClick={() => togglePlay(meditation.id)}
                    className={`w-10 h-10 rounded-full ${meditation.premium ? 'bg-florescer-secondary/80' : 'bg-florescer-primary'} text-white flex items-center justify-center mr-3`}
                    disabled={meditation.premium}
                  >
                    {isPlaying && activeAudio === meditation.id ? (
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
                    <div className="flex items-center">
                      <span className="font-medium">{meditation.title}</span>
                      {meditation.premium && (
                        <span className="ml-2 text-xs bg-florescer-secondary/20 text-florescer-secondary px-2 py-0.5 rounded-full">
                          Premium
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">{meditation.duration}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Premium Prompt */}
      <div className="bg-gradient-to-r from-florescer-primary/10 to-florescer-secondary/10 rounded-xl p-6 text-center">
        <h2 className="font-lora text-xl font-medium mb-2">Meditações Premium</h2>
        <p className="text-gray-600 mb-4">Acesse todas as meditações guiadas para a menopausa</p>
        <Button className="florescer-button">
          Desbloquear Meditações Premium
        </Button>
      </div>
    </div>
  );
};

export default Meditation;
