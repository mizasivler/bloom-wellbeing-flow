
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { register, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    
    try {
      await register(email, password, name);
      setSuccess('Cadastro realizado com sucesso! Verifique seu email para confirmação.');
    } catch (err: any) {
      console.error('Register error:', err);
      const errorMsg = err.message || 'Erro ao criar conta. Tente novamente.';
      setError(errorMsg);
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-lora font-semibold text-florescer-primary">Florescer</h1>
        <p className="mt-2 text-gray-600">Crie sua conta e comece sua jornada</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nome completo
          </Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Maria Silva"
            required
            className="input-field"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
            className="input-field"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Senha
          </Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            required
            minLength={6}
            className="input-field"
          />
        </div>
        
        <Button
          type="submit"
          className="florescer-button w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Criando conta...' : 'Criar conta'}
        </Button>
      </form>
      
      <div className="text-center">
        <p className="text-gray-600">
          Já tem uma conta?{' '}
          <Link to="/login" className="text-florescer-primary font-medium hover:underline">
            Entre aqui
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
