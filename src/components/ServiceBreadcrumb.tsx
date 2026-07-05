import { Link, useNavigate } from 'react-router-dom';
import { Home, ChevronRight, Layers, MessageSquareQuote } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ServiceBreadcrumbProps {
  serviceName: string;
}

const ServiceBreadcrumb = ({ serviceName }: ServiceBreadcrumbProps) => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-muted/80 to-muted/40 border-b border-border backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <nav className="flex items-center gap-2 text-sm">
          <Link 
            to="/" 
            className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-105"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </Link>
          <ChevronRight className="w-4 h-4 text-muted-foreground/60" />
          <Link 
            to="/services" 
            className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-105"
          >
            <Layers className="w-4 h-4" />
            <span>Services</span>
          </Link>
          <ChevronRight className="w-4 h-4 text-muted-foreground/60" />
          <span className="text-primary font-semibold flex items-center gap-1.5 bg-primary/10 px-3 py-1 rounded-full">
            {serviceName}
          </span>
        </nav>
        <Button 
          onClick={() => navigate('/contact')}
          size="sm"
          className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center gap-2"
        >
          <MessageSquareQuote className="w-4 h-4" />
          Get a Quote
        </Button>
      </div>
    </div>
  );
};

export default ServiceBreadcrumb;