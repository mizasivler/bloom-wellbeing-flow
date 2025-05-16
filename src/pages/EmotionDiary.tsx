
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

const EmotionDiary = () => {
  const [entryContent, setEntryContent] = useState("");
  const [energyLevel, setEnergyLevel] = useState("");
  const [entries, setEntries] = useState<any[]>([]);
  
  useEffect(() => {
    document.title = "Florescer - Diário da Emoção";
    
    // Mock data - in a real app, this would come from a database
    const mockEntries = [
      { 
        id: 1, 
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), 
        content: "Hoje percebi que meu corpo está me pedindo mais descanso. Respeitei meus limites e me senti menos culpada por isso.", 
        energy: "Baixa, mas em paz" 
      },
      { 
        id: 2, 
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), 
        content: "Um dia difícil com muitas ondas de calor. Consegui praticar a respiração quando elas vinham e isso ajudou.", 
        energy: "Oscilante" 
      }
    ];
    
    setEntries(mockEntries);
  }, []);
  
  const saveEntry = () => {
    if (!entryContent.trim()) {
      toast({
        title: "Campo vazio",
        description: "Por favor, escreva algo para salvar no diário.",
      });
      return;
    }
    
    const newEntry = {
      id: Date.now(),
      date: new Date().toISOString(),
      content: entryContent,
      energy: energyLevel || "Não especificada"
    };
    
    setEntries([newEntry, ...entries]);
    setEntryContent("");
    setEnergyLevel("");
    
    toast({
      title: "Registro salvo",
      description: "Sua entrada foi salva no diário.",
    });
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      <div>
        <h1 className="text-2xl font-lora font-semibold text-florescer-text">Diário da Emoção</h1>
        <p className="text-gray-600">Registre seus sentimentos e percepções</p>
      </div>
      
      {/* New Entry Form */}
      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
        <h2 className="font-lora text-lg font-medium text-florescer-primary">Novo Registro</h2>
        
        <div className="space-y-2">
          <label htmlFor="entry" className="block text-sm font-medium text-gray-700">
            Hoje eu percebi que...
          </label>
          <Textarea
            id="entry"
            value={entryContent}
            onChange={(e) => setEntryContent(e.target.value)}
            placeholder="Escreva sobre suas percepções, sentimentos ou descobertas de hoje..."
            className="min-h-[120px] rounded-xl border-gray-200"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="energy" className="block text-sm font-medium text-gray-700">
            Minha energia estava...
          </label>
          <Textarea
            id="energy"
            value={energyLevel}
            onChange={(e) => setEnergyLevel(e.target.value)}
            placeholder="Como você descreveria sua energia hoje? (alta, baixa, oscilante...)"
            className="min-h-[60px] rounded-xl border-gray-200"
          />
        </div>
        
        <Button 
          onClick={saveEntry}
          className="florescer-button w-full"
        >
          Salvar no Diário
        </Button>
      </div>
      
      {/* Past Entries */}
      <div className="space-y-4">
        <h2 className="font-lora text-lg font-medium text-florescer-primary">Registros Anteriores</h2>
        
        {entries.length > 0 ? (
          entries.map(entry => (
            <div key={entry.id} className="bg-white rounded-2xl shadow-sm p-6 space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-sm text-gray-500">{formatDate(entry.date)}</span>
              </div>
              <p className="text-gray-700">{entry.content}</p>
              <div className="bg-florescer-light/50 rounded-lg p-3">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Energia: </span> 
                  {entry.energy}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhum registro encontrado</p>
            <p className="text-sm">Comece a escrever para criar seu primeiro registro</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmotionDiary;
