import { Navbar } from "@/components/ui/navbar";
import { HeroSection } from "@/components/hero-section";
import { StatsOverview } from "@/components/stats-overview";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <StatsOverview />
      
      {/* Call to Action Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Tracking?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of runners and cyclists who are already using TrackTrek to achieve their fitness goals.
          </p>
          {user ? (
            <Button 
              size="lg" 
              onClick={() => navigate('/dashboard')}
              className="mr-4"
            >
              Go to Dashboard
            </Button>
          ) : (
            <div className="space-x-4">
              <Button 
                size="lg" 
                onClick={() => navigate('/auth')}
              >
                Get Started
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/auth')}
              >
                Sign In
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;
