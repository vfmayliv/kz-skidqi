
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold mb-4">SKIDQI.KZ</h1>
        <p className="text-xl text-muted-foreground">Доска объявлений Казахстана</p>
        <div className="space-y-4">
          <Link to="/create-ad">
            <Button size="lg" className="w-full max-w-xs">
              Подать объявление
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
