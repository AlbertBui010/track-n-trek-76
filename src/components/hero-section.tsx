import { Button } from "@/components/ui/button";
import { Play, MapPin, TrendingUp, Users } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-bg overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Runner on mountain trail"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent leading-tight">
            Track Your Journey,
            <br />
            Reach Your Goals
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Comprehensive running and cycling tracker with GPS routes, progress analytics, and community features.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button variant="hero" size="lg" className="text-lg px-8 py-6">
              <Play className="mr-2 h-5 w-5" />
              Start Tracking
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              View Demo
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="bg-gradient-card backdrop-blur-md rounded-2xl p-6 shadow-card border border-border/50">
              <div className="bg-primary/10 rounded-full p-3 w-fit mx-auto mb-4">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">GPS Tracking</h3>
              <p className="text-muted-foreground">
                Upload GPX files and visualize your routes on interactive maps
              </p>
            </div>

            <div className="bg-gradient-card backdrop-blur-md rounded-2xl p-6 shadow-card border border-border/50">
              <div className="bg-secondary/10 rounded-full p-3 w-fit mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Progress Analytics</h3>
              <p className="text-muted-foreground">
                Detailed statistics and charts to monitor your improvement
              </p>
            </div>

            <div className="bg-gradient-card backdrop-blur-md rounded-2xl p-6 shadow-card border border-border/50">
              <div className="bg-accent/10 rounded-full p-3 w-fit mx-auto mb-4">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Community</h3>
              <p className="text-muted-foreground">
                Share activities and connect with fellow athletes
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary/20 rounded-full blur-xl" />
    </section>
  );
};

export default HeroSection;