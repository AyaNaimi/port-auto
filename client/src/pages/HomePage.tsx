import { useLocation } from "wouter";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";

export default function HomePage() {
  const [, setLocation] = useLocation();

  const handleGetStarted = () => {
    setLocation("/create");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Hero onGetStarted={handleGetStarted} />
      <Features />
    </div>
  );
}
