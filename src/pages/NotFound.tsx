
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-florescer-background p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="text-6xl">🌿</div>
        <h1 className="text-4xl font-lora font-semibold text-florescer-primary">Página não encontrada</h1>
        <p className="text-xl text-gray-600 mb-4">
          Parece que você se perdeu em nossa floresta. Vamos ajudá-la a encontrar o caminho de volta.
        </p>
        <Link to="/">
          <Button className="florescer-button">
            Voltar ao Início
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
