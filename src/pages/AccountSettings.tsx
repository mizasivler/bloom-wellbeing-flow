
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

const AccountSettings = () => {
  const { user, logout, updateUserData, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: user?.full_name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    // This would do more validation in a real app
    if (formData.fullName.trim() === '') {
      toast({
        title: "Erro ao atualizar",
        description: "Nome completo não pode estar vazio.",
        variant: "destructive",
      });
      return;
    }
    
    updateUserData({ full_name: formData.fullName });
    
    toast({
      title: "Perfil atualizado",
      description: "Suas informações pessoais foram atualizadas com sucesso.",
    });
  };
  
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Erro ao atualizar",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }
    
    // This would call the appropriate auth method in a real app
    toast({
      title: "Senha atualizada",
      description: "Sua senha foi atualizada com sucesso.",
    });
    
    setFormData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }));
  };
  
  return (
    <div className="space-y-8 pb-24 animate-fade-in">
      <div>
        <h1 className="text-2xl font-lora font-semibold text-florescer-text">
          Configurações da Conta
        </h1>
        <p className="text-gray-600">
          Gerencie seus dados pessoais e preferências
        </p>
      </div>
      
      {/* Profile Section */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-lora text-lg font-medium text-florescer-primary mb-4">
          Informações Pessoais
        </h2>
        
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Nome Completo
            </label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Maria Silva"
              className="input-field"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              disabled
              className="input-field bg-gray-50"
            />
            <p className="text-xs text-gray-500">
              O email não pode ser alterado.
            </p>
          </div>
          
          <Button
            type="submit"
            className="florescer-button"
            disabled={isLoading}
          >
            {isLoading ? 'Atualizando...' : 'Atualizar Perfil'}
          </Button>
        </form>
      </div>
      
      {/* Change Password Section */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-lora text-lg font-medium text-florescer-primary mb-4">
          Alterar Senha
        </h2>
        
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
              Senha Atual
            </label>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="input-field"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              Nova Senha
            </label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="input-field"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirmar Nova Senha
            </label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="input-field"
            />
          </div>
          
          <Button
            type="submit"
            className="florescer-button"
            disabled={isLoading}
          >
            {isLoading ? 'Atualizando...' : 'Alterar Senha'}
          </Button>
        </form>
      </div>
      
      {/* Logout Button */}
      <div className="py-4">
        <Button
          onClick={logout}
          variant="outline"
          className="w-full text-gray-700"
          disabled={isLoading}
        >
          {isLoading ? 'Saindo...' : 'Sair da Conta'}
        </Button>
      </div>
    </div>
  );
};

export default AccountSettings;
