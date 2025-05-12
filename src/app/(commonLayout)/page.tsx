import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Truck, ShieldCheck, Sprout } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const features = [
    {
      icon: Leaf,
      title: "Quality Products",
      description: "We offer high-quality fertilizers and agricultural supplies for optimal crop growth."
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Quick delivery services to ensure you get your supplies when you need them."
    },
    {
      icon: ShieldCheck,
      title: "Trusted Service",
      description: "Trusted by farmers for years with reliable products and expert advice."
    },
    {
      icon: Sprout,
      title: "Sustainable Options",
      description: "Eco-friendly and sustainable agricultural solutions for modern farming."
    }
  ];

  return (
    <Container>
      {/* Hero Section */}
      <div className="py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Welcome to <span className="text-gradient">Krishan Traders</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Your trusted partner for quality fertilizers and agricultural supplies
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/login">Shop Now</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/about">Learn More</Link>
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-muted/30 rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
          {features.map((feature, index) => (
            <Card key={index} className="fertilizer-card">
              <CardContent className="pt-6">
                <div className="mb-4 bg-primary/10 p-3 rounded-full w-fit">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Boost Your Crop Yield?</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Join hundreds of satisfied farmers who trust Krishan Traders for their agricultural needs
        </p>
        <Button size="lg" asChild>
          <Link href="/login">Get Started</Link>
        </Button>
      </div>
    </Container>
  );
}
