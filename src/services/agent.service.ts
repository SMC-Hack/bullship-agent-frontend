import { sleep } from "@/utils/time";

const PAGE_SIZE = 2;

const TOP_AGENTS = [
  {
    id: "1",
    name: "Alpha Trader",
    symbol: "ALPHA",
    aum: 125000,
    pnl: 12.5,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "2",
    name: "Beta Investor",
    symbol: "BETA",
    aum: 85000,
    pnl: 8.2,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "3",
    name: "Gamma Strategy",
    symbol: "GAMMA",
    aum: 250000,
    pnl: 15.7,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "4",
    name: "Delta Hedge",
    symbol: "DELTA",
    aum: 175000,
    pnl: -2.3,
    image: "/placeholder.svg?height=80&width=80",
  },
];

const LATEST_AGENTS = [
  {
    id: "5",
    name: "Epsilon Bot",
    symbol: "EPS",
    aum: 95000,
    pnl: 5.8,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "6",
    name: "Zeta AI",
    symbol: "ZETA",
    aum: 145000,
    pnl: -3.2,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "7",
    name: "Theta Quant",
    symbol: "THETA",
    aum: 210000,
    pnl: 9.4,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "8",
    name: "Omega Algo",
    symbol: "OMEGA",
    aum: 165000,
    pnl: 11.2,
    image: "/placeholder.svg?height=80&width=80",
  },
];

const fetchTopAgents = async (page: number) => {
  await sleep(1000);
  return TOP_AGENTS.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
};

const fetchLatestAgents = async (page: number) => {
  await sleep(1000);
  return LATEST_AGENTS.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
};

const agentService = {
  fetchTopAgents,
  fetchLatestAgents,
};

export default agentService;
