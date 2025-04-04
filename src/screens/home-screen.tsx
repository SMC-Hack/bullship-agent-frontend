import TrendingAgents from "@/components/home/trending-agents";
import Heading from "@/components/home/heading";
import BannerCarousel from "@/components/home/banner-carousel";
import LatestAgents from "@/components/home/latest-agents";
import useTopAgents from "@/hooks/useTopAgents";
import { useState } from "react";
import useLatestAgents from "@/hooks/useLatestAgents";

export default function HomeScreen() {
  const [page] = useState(1);
  const { data: latestAgents, isLoading: isLatestAgentsLoading } =
    useLatestAgents(page);
  const { data: topAgents, isLoading: isTopAgentsLoading } = useTopAgents(page);

  return (
    <div className="container px-4 py-6 max-w-md mx-auto">
      <Heading />
      <BannerCarousel />
      <LatestAgents agents={latestAgents} isLoading={isLatestAgentsLoading} />
      <TrendingAgents agents={topAgents} isLoading={isTopAgentsLoading} />
    </div>
  );
}
