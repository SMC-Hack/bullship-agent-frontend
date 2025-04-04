import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

export default function BannerCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const banners = [
    {
      id: 1,
      title: "Welcome to Bull Ship Agent",
      description: "Your AI-powered trading companion",
      gradient: "from-pink-500 via-orange-500 to-yellow-500",
      icon: "💹",
    },
    {
      id: 2,
      title: "Smart Portfolio Management",
      description: "Let our AI agents handle your investments",
      gradient: "from-purple-500 via-blue-500 to-cyan-500",
      icon: "🤖",
    },
    {
      id: 3,
      title: "Real-time Market Analysis",
      description: "Stay ahead with AI-driven insights",
      gradient: "from-green-500 via-teal-500 to-blue-500",
      icon: "📊",
    },
  ];

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  useEffect(() => {
    const autoplayInterval = setInterval(() => {
      if (api) {
        api.scrollNext();
      }
    }, 5000);

    return () => clearInterval(autoplayInterval);
  }, [api]);

  return (
    <div className="relative mb-6">
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent>
          {banners.map((banner) => (
            <CarouselItem key={banner.id}>
              <div
                className={`w-full h-32 bg-gradient-to-r ${banner.gradient} p-4 flex items-center rounded-xl`}
              >
                <div className="flex-1">
                  <h2 className="text-white text-xl font-bold mb-2">
                    {banner.title}
                  </h2>
                  <p className="text-white text-sm opacity-90">
                    {banner.description}
                  </p>
                </div>
                <div className="text-4xl select-none">{banner.icon}</div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === current ? "bg-white" : "bg-white/50"
            }`}
            onClick={() => api?.scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
}
