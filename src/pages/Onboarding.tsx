
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { MoodType, QuizResult } from '@/types';

const moodOptions: { value: MoodType; label: string; emoji: string }[] = [
  { value: 'cansada', label: 'Cansada', emoji: '😴' },
  { value: 'aflita', label: 'Aflita', emoji: '😟' },
  { value: 'sensível', label: 'Sensível', emoji: '🥺' },
  { value: 'irritada', label: 'Irritada', emoji: '😤' },
  { value: 'esperançosa', label: 'Esperançosa', emoji: '😊' },
];

const quizResults: { value: QuizResult; label: string; description: string }[] = [
  { 
    value: 'A', 
    label: 'Tipo Sabedoria', 
    description: 'Você está na fase de aceitação e sabedoria, onde busca entender as mudanças como parte natural da vida.' 
  },
  { 
    value: 'B', 
    label: 'Tipo Transição', 
    description: 'Você está na fase de transição, alternando entre momentos de desafio e descoberta de novas possibilidades.' 
  },
  { 
    value: 'C', 
    label: 'Tipo Sensibilidade', 
    description: 'Você está na fase de maior sensibilidade, onde as emoções e sensações físicas estão intensificadas.' 
  },
  { 
    value: 'D', 
    label: 'Tipo Renovação', 
    description: 'Você está na fase de renovação, pronta para reconstruir sua identidade e explorar novos caminhos.' 
  },
];

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult>('B'); // For demo, we'll pre-select this
  const { user, updateUserData } = useAuth();
  const navigate = useNavigate();

  const handleMoodSelection = (mood: MoodType) => {
    setSelectedMood(mood);
  };

  const handleNextStep = async () => {
    if (step === 1 && selectedMood) {
      await updateUserData({ mood: selectedMood });
      setStep(2);
    } else if (step === 2) {
      await updateUserData({ quiz_result: quizResult });
      setStep(3);
    } else if (step === 3) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="animate-fade-in space-y-8 py-4">
      {/* Progress Indicator */}
      <div className="flex justify-center">
        <div className="flex space-x-2">
          {[1, 2, 3].map((i) => (
            <div 
              key={i}
              className={`w-2.5 h-2.5 rounded-full ${
                i === step ? 'bg-florescer-primary' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
      
      {/* Step 1: Mood Selection */}
      {step === 1 && (
        <div className="text-center space-y-8">
          <div>
            <h1 className="text-2xl font-lora font-semibold text-florescer-text">Como você está se sentindo hoje?</h1>
            <p className="mt-2 text-gray-600">Escolha a opção que melhor representa seu estado emocional atual</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
            {moodOptions.map((mood) => (
              <button
                key={mood.value}
                onClick={() => handleMoodSelection(mood.value)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedMood === mood.value
                    ? 'border-florescer-primary bg-florescer-light'
                    : 'border-gray-200 hover:border-florescer-primary'
                }`}
              >
                <div className="text-3xl mb-1">{mood.emoji}</div>
                <div className="text-sm font-medium">{mood.label}</div>
              </button>
            ))}
          </div>
          
          <Button
            onClick={handleNextStep}
            className="florescer-button"
            disabled={!selectedMood}
          >
            Continuar
          </Button>
        </div>
      )}
      
      {/* Step 2: Quiz Result */}
      {step === 2 && (
        <div className="text-center space-y-8">
          <div>
            <h1 className="text-2xl font-lora font-semibold text-florescer-text">Seu tipo de menopausa</h1>
            <p className="mt-2 text-gray-600">Baseado nas suas respostas, identificamos seu perfil</p>
          </div>
          
          <div className="max-w-sm mx-auto bg-white rounded-2xl shadow-md p-6">
            <div className="text-center mb-4">
              <h2 className="text-xl font-lora font-semibold text-florescer-primary">{quizResults.find(r => r.value === quizResult)?.label}</h2>
            </div>
            
            <p className="text-gray-700">
              {quizResults.find(r => r.value === quizResult)?.description}
            </p>
          </div>
          
          <Button
            onClick={handleNextStep}
            className="florescer-button"
          >
            Continuar
          </Button>
        </div>
      )}
      
      {/* Step 3: Welcome Message */}
      {step === 3 && (
        <div className="text-center space-y-8">
          <div>
            <h1 className="text-2xl font-lora font-semibold text-florescer-text">
              Bem-vinda, {user?.full_name?.split(' ')[0] || ''}!
            </h1>
            <p className="mt-2 text-gray-600">Uma mensagem especial da Célia para você</p>
          </div>
          
          <div className="max-w-sm mx-auto bg-white rounded-2xl shadow-md p-6">
            <div className="text-center mb-4">
              <div className="w-16 h-16 rounded-full bg-florescer-light mx-auto mb-2 flex items-center justify-center">
                <span className="text-2xl">👩‍🦱</span>
              </div>
              <h2 className="text-xl font-lora font-semibold">Célia</h2>
            </div>
            
            <p className="text-gray-700 italic">
              "Olá querida! Estou muito feliz que você decidiu cuidar de si mesma nesta jornada. 
              A menopausa não é o fim de nada - é uma transformação e o início de uma fase poderosa da sua vida. 
              Estou aqui com você em cada passo deste caminho de autoconhecimento e florescimento."
            </p>
            
            <div className="mt-4 pt-4 border-t border-gray-100">
              <button className="text-florescer-secondary flex items-center justify-center w-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                  <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"></path>
                  <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
                </svg>
                Ouvir mensagem
              </button>
            </div>
          </div>
          
          <Button
            onClick={handleNextStep}
            className="florescer-button"
          >
            Ir para o Dashboard
          </Button>
        </div>
      )}
    </div>
  );
};

export default Onboarding;
