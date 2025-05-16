
import { useState, useEffect } from "react";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

const Planner = () => {
  const { ritualStatus } = useApp();
  
  const [tasks, setTasks] = useState([
    { id: "ritual", label: "Ritual do dia", completed: ritualStatus.completed },
    { id: "meditation", label: "Meditação", completed: false },
    { id: "hydration", label: "Beber água (8 copos)", completed: false },
    { id: "reflection", label: "Reflexão", completed: false }
  ]);
  
  const [feelingsNote, setFeelingsNote] = useState("");
  const [bodyNote, setBodyNote] = useState("");
  
  useEffect(() => {
    document.title = "Florescer - Planner";
    
    // Update ritual task when ritualStatus changes
    setTasks(prev => prev.map(task => 
      task.id === "ritual" ? { ...task, completed: ritualStatus.completed } : task
    ));
  }, [ritualStatus.completed]);
  
  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };
  
  const handleSave = () => {
    toast({
      title: "Planner salvo",
      description: "Suas anotações e tarefas foram salvas com sucesso.",
    });
  };
  
  const getTasksCompletedCount = () => {
    return tasks.filter(task => task.completed).length;
  };
  
  const today = new Date();
  const formattedDate = today.toLocaleDateString('pt-BR', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
  
  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      <div>
        <h1 className="text-2xl font-lora font-semibold text-florescer-text">Meu Planner</h1>
        <p className="text-gray-600 capitalize">{formattedDate}</p>
      </div>
      
      {/* Daily Checklist */}
      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-lora text-lg font-medium text-florescer-primary">Checklist Diário</h2>
          <span className="text-sm text-gray-500">{getTasksCompletedCount()}/{tasks.length}</span>
        </div>
        
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center space-x-2">
              <Checkbox 
                id={task.id} 
                checked={task.completed} 
                onCheckedChange={() => toggleTask(task.id)}
              />
              <Label 
                htmlFor={task.id}
                className={task.completed ? "line-through text-gray-400" : ""}
              >
                {task.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Reflection Section */}
      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
        <h2 className="font-lora text-lg font-medium text-florescer-primary">Reflexão do Dia</h2>
        
        <div className="space-y-3">
          <div className="space-y-2">
            <label htmlFor="feelings" className="block text-sm font-medium text-gray-700">
              Hoje eu me senti...
            </label>
            <Textarea
              id="feelings"
              value={feelingsNote}
              onChange={(e) => setFeelingsNote(e.target.value)}
              placeholder="Como você se sentiu hoje? Descreva suas emoções..."
              className="min-h-[100px] rounded-xl border-gray-200"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="body" className="block text-sm font-medium text-gray-700">
              Meu corpo me disse...
            </label>
            <Textarea
              id="body"
              value={bodyNote}
              onChange={(e) => setBodyNote(e.target.value)}
              placeholder="Como seu corpo reagiu hoje? Teve ondas de calor, dores, energia ou outros sintomas?"
              className="min-h-[100px] rounded-xl border-gray-200"
            />
          </div>
        </div>
      </div>
      
      {/* Save Button */}
      <div className="pt-4">
        <Button 
          onClick={handleSave}
          className="florescer-button w-full"
        >
          Salvar Planner
        </Button>
      </div>
    </div>
  );
};

export default Planner;
