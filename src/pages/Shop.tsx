
import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const Shop = () => {
  const { products } = useApp();
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  
  const handleSelectProduct = (productId: string) => {
    setSelectedProduct(productId);
  };
  
  const handleBuyProduct = (productId: string) => {
    // This would integrate with Stripe in a real implementation
    toast({
      title: "Processando pagamento",
      description: "Esta funcionalidade estará disponível em breve com a integração do Stripe.",
    });
  };
  
  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      <div>
        <h1 className="text-2xl font-lora font-semibold text-florescer-text">
          Loja Florescer
        </h1>
        <p className="text-gray-600">
          Encontre produtos especiais para sua jornada
        </p>
      </div>
      
      <div className="space-y-6">
        {products.map(product => (
          <div 
            key={product.id}
            className={`bg-white rounded-2xl shadow-sm overflow-hidden ${
              selectedProduct === product.id ? 'ring-2 ring-florescer-primary' : ''
            }`}
            onClick={() => handleSelectProduct(product.id)}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-3xl mb-2">{product.icon}</div>
                  <h2 className="font-lora text-xl font-medium">{product.name}</h2>
                </div>
                <div className="bg-florescer-light text-florescer-primary px-3 py-1 rounded-full font-medium">
                  {product.priceFormatted}
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">{product.description}</p>
              
              <div className="space-y-2">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <div className="text-florescer-primary mr-2">✓</div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-t p-4">
              <Button 
                onClick={() => handleBuyProduct(product.id)}
                className={product.isSubscription ? "florescer-button-secondary w-full" : "florescer-button w-full"}
              >
                {product.isSubscription ? 'Assinar Agora' : 'Comprar Agora'}
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-florescer-light rounded-2xl p-6">
        <h2 className="font-lora text-lg font-medium text-florescer-primary mb-2">
          Dúvidas sobre os produtos?
        </h2>
        <p className="text-gray-600 mb-4">
          Entre em contato conosco pelo email contato@florescer.com.br ou pelo WhatsApp.
        </p>
        <Button variant="outline" className="w-full">
          Enviar Mensagem
        </Button>
      </div>
    </div>
  );
};

export default Shop;
