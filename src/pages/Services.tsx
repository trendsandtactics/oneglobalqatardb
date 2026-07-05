import Header from '@/components/Header';
import About from '@/components/About';
import Services from '@/components/Services';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Services />
  
      </main>
      <Footer />
    </div>
  );
};

export default Index;
