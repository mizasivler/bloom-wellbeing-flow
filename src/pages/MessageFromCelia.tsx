
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Heart } from "lucide-react";

const MessageFromCelia = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [savedMessages, setSavedMessages] = useState<string[]>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  
  const messages = [
    "Você não precisa carregar o mundo sozinha. Permita-se receber ajuda e apoio.",
    "Seu corpo não está contra você. Ele está se adaptando. Tenha paciência com essa transição.",
    "A menopausa não é o fim de nada. É uma passagem para uma nova fase poderosa da sua vida.",
    "Suas emoções são válidas. Não deixe ninguém minimizar o que você sente.",
    "Hoje, celebre uma pequena vitória, por menor que pareça.",
    "Lembre-se de respirar profundamente quando a ansiedade vier. Você é mais forte que ela.",
    "A vulnerabilidade é uma forma de coragem.",
  ];

  useEffect(() => {
    document.title = "Florescer - Mensagem da Célia";
    
    // Get a random message index when component mounts
    setCurrentMessageIndex(Math.floor(Math.random() * messages.length));
    
    // Mock data for saved messages - in a real app, this would come from a database
    setSavedMessages([
      "Suas emoções são válidas. Não deixe ninguém minimizar o que você sente.",
      "A vulnerabilidade é uma forma de coragem."
    ]);
  }, []);
  
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    
    // In a real app, this would play/pause an audio file
    setTimeout(() => {
      setIsPlaying(false);
    }, 5000);
  };
  
  const saveMessage = () => {
    const messageToSave = messages[currentMessageIndex];
    if (!savedMessages.includes(messageToSave)) {
      setSavedMessages([...savedMessages, messageToSave]);
      toast({
        title: "Mensagem salva",
        description: "A mensagem foi salva em suas favoritas.",
      });
    } else {
      toast({
        title: "Mensagem já salva",
        description: "Esta mensagem já está em suas favoritas.",
      });
    }
  };
  
  const currentMessage = messages[currentMessageIndex];
  const isCurrentMessageSaved = savedMessages.includes(currentMessage);
  
  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      <div>
        <h1 className="text-2xl font-lora font-semibold text-florescer-text">Mensagem da Célia</h1>
        <p className="text-gray-600">Inspiração e apoio diário</p>
      </div>
      
      {/* Today's Message */}
      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-florescer-primary/10 flex items-center justify-center">
            <span className="text-florescer-primary text-xl">🧠</span>
          </div>
          <div>
            <h2 className="font-lora text-lg font-medium">Célia diz:</h2>
            <p className="text-gray-500 text-sm">Mensagem de hoje</p>
          </div>
        </div>
        
        <div className="bg-florescer-light/50 rounded-xl p-5 text-center">
          <p className="text-florescer-text text-lg font-lora italic">"{currentMessage}"</p>
        </div>
        
        <div className="flex space-x-3">
          <Button
            onClick={togglePlay}
            variant="outline"
            className="flex-1"
          >
            <span className="mr-2">{isPlaying ? "⏸️" : "🔊"}</span>
            {isPlaying ? "Pausar" : "Ouvir em Áudio"}
          </Button>
          
          <Button
            onClick={saveMessage}
            variant="outline"
            className={`flex-1 ${isCurrentMessageSaved ? 'bg-florescer-primary/10 text-florescer-primary' : ''}`}
          >
            <Heart size={16} className={`mr-2 ${isCurrentMessageSaved ? 'fill-florescer-primary' : ''}`} />
            {isCurrentMessageSaved ? "Salva" : "Salvar"}
          </Button>
        </div>
      </div>
      
      {/* Saved Messages */}
      <div className="space-y-4">
        <h2 className="font-lora text-lg font-medium text-florescer-primary">Mensagens Salvas</h2>
        
        {savedMessages.length > 0 ? (
          <div className="space-y-3">
            {savedMessages.map((message, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-4">
                <p className="text-gray-700 italic">"{message}"</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <p className="text-gray-500">Nenhuma mensagem salva ainda</p>
            <p className="text-sm text-gray-400 mt-1">
              Clique em "Salvar" para guardar mensagens especiais
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageFromCelia;
