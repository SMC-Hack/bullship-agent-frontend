import TrendingAgents from '@/components/home/trending-agents';
import Heading from '@/components/home/heading';
import BannerCarousel from '@/components/home/banner-carousel';
import LatestAgents from '@/components/home/latest-agents';
import useTopAgents from '@/hooks/useTopAgents';
import { useEffect, useState } from 'react';
import useLatestAgents from '@/hooks/useLatestAgents';

export default function HomeScreen() {
  const [page] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const { data: latestAgents, isLoading: isLatestAgentsLoading } =
    useLatestAgents(page);
  const { data: topAgents, isLoading: isTopAgentsLoading } = useTopAgents(page);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredTopAgents = topAgents?.filter((agent) =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLatestAgents = latestAgents?.filter((agent) =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container px-4 py-6 max-w-md mx-auto">
      <Heading onSearch={handleSearch} />
      <BannerCarousel />
      <LatestAgents
        agents={filteredLatestAgents}
        isLoading={isLatestAgentsLoading}
      />
      <TrendingAgents
        agents={filteredTopAgents}
        isLoading={isTopAgentsLoading}
      />
    </div>
  );
}
