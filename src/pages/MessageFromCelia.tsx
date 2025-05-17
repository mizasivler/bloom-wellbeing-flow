
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { generateCeliaMessage } from "@/services/messageService";

const MessageFromCelia = () => {
  const [message, setMessage] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const { user } = useAuth();
  const { userMood, savedMessages, saveMessage } = useApp();

  // Buscar mensagem personalizada quando o componente carregar
  useEffect(() => {
    const fetchCeliaMessage = async () => {
      if (userMood) {
        try {
          setIsLoading(true);
          const personalizedMessage = await generateCeliaMessage({
            mood: userMood,
            quizResult: user?.quiz_result as any,
            dayNumber: user?.completed_rituals || 1,
            userName: user?.full_name
          });
          
          setMessage(personalizedMessage);
        } catch (error) {
          console.error('Erro ao buscar mensagem personalizada:', error);
          setMessage("Você é mais forte do que pensa, mais sábia do que acredita, e mais amada do que imagina.");
        } finally {
          setIsLoading(false);
        }
      } else {
        setMessage("Você é mais forte do que pensa, mais sábia do que acredita, e mais amada do que imagina.");
        setIsLoading(false);
      }
    };
    
    fetchCeliaMessage();
  }, [userMood, user]);

  const handleSaveMessage = async () => {
    if (!message) return;
    
    setIsSaving(true);
    await saveMessage(message);
    setIsSaving(false);
  };

  const toggleAudio = () => {
    setIsPlaying(!isPlaying);
    // Aqui seria implementada a lógica de síntese de voz ou reprodução de áudio
  };

  const isMessageSaved = message && savedMessages.includes(message);

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div>
        <h1 className="text-2xl font-lora font-semibold text-florescer-text">Mensagem da Célia</h1>
        <p className="text-gray-600">Uma reflexão diária para inspirar seu dia</p>
      </div>

      {/* Mensagem do dia */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-florescer-light flex items-center justify-center">
            <span className="text-2xl">👩‍🦱</span>
          </div>
        </div>
        
        <div className="text-center">
          <h2 className="font-lora text-lg font-medium text-florescer-primary mb-4">Sua mensagem de hoje</h2>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-florescer-primary" />
            </div>
          ) : (
            <p className="text-gray-700 text-lg italic">"<span id="messageText">{message}</span>"</p>
          )}
          
          <div className="mt-6 space-y-3">
            <Button 
              variant="outline" 
              className="w-full border-florescer-secondary text-florescer-secondary hover:bg-florescer-light"
              onClick={toggleAudio}
              disabled={isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"></path>
                <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
              </svg>
              {isPlaying ? "Pausar Áudio" : "Ouvir em Áudio"}
            </Button>
            
            <Button 
              className="w-full florescer-button-secondary"
              onClick={handleSaveMessage}
              disabled={isMessageSaved || isLoading || isSaving}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
              )}
              {isMessageSaved ? "Mensagem Salva" : "Salvar no Coração 💗"}
            </Button>
          </div>
        </div>
      </div>

      {/* Mensagens salvas */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="font-lora text-lg font-medium text-florescer-primary mb-4">Mensagens Salvas</h2>
        
        {savedMessages.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Você ainda não salvou nenhuma mensagem. Quando encontrar uma mensagem especial, salve-a aqui.</p>
        ) : (
          <div className="space-y-4">
            {savedMessages.map((savedMsg, index) => (
              <div key={index} className="p-4 bg-florescer-light rounded-lg">
                <p className="italic text-gray-700">"{savedMsg}"</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageFromCelia;
