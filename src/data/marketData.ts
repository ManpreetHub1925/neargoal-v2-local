
export const industries = [
  'Energy, Power & Infrastructure',
  'Chemicals, Water Technologies & Advanced Materials',
  'Automotive, EV & Mobility',
  'Digital Technologies, AI & Semiconductors',
  'Consumer Goods, Retail & E-Commerce',
  'Healthcare & Life Sciences',
  'Defense & Aerospace',
];

export const industrySlugs: Record<string, string> = {
  'Energy, Power & Infrastructure': 'energy-power-infrastructure',
  'Chemicals, Water Technologies & Advanced Materials': 'chemicals-materials',
  'Automotive, EV & Mobility': 'automotive-mobility',
  'Digital Technologies, AI & Semiconductors': 'digital-tech-ai',
  'Consumer Goods, Retail & E-Commerce': 'consumer-goods',
  'Healthcare & Life Sciences': 'healthcare',
  'Defense & Aerospace': 'defense-aerospace',
};

export const slugToIndustry: Record<string, string> = Object.entries(industrySlugs).reduce((acc, [key, value]) => {
  acc[value] = key;
  return acc;
}, {} as Record<string, string>);

export const reports = [
  {
    id: 1,
    title: 'Global Renewable Energy Market Outlook 2026-2030',
    code: 'NG-EPI-2026-01',
    category: 'Energy, Power & Infrastructure',
    geography: 'Global',
    date: 'Feb 2026',
    summary: 'Comprehensive analysis of solar, wind, and hydrogen energy adoption trends across major economies.',
    price: 4500,
    pages: 185,
    coverage: 'Global',
    description: 'The global renewable energy market is poised for transformative growth over the next five years, driven by accelerated decarbonization mandates, falling technology costs, and robust policy support across major economies. This comprehensive report provides a deep dive into the structural shifts reshaping the energy landscape, with granular analysis of solar, wind, hydrogen, and energy storage sectors.',
    toc: [
      'Executive Summary',
      'Market Overview & Key Drivers',
      'Regulatory Landscape & Policy Analysis',
      'Technology Trends: Solar PV, Wind, Green Hydrogen',
      'Regional Market Analysis (North America, Europe, APAC, MEA, LATAM)',
      'Competitive Landscape & Strategic Positioning',
      'Investment Analysis & M&A Trends',
      'Market Forecasts 2026-2030'
    ],
    lof: [
      'Figure 1: Global Renewable Energy Capacity Additions (GW), 2020-2030',
      'Figure 2: LCOE Comparison: Solar PV vs. Wind vs. Fossil Fuels',
      'Figure 3: Green Hydrogen Production Cost Curve',
      'Figure 4: Regional Investment in Renewable Energy, 2025'
    ],
    lot: [
      'Table 1: Key Regulatory Mandates by Region',
      'Table 2: Major Solar PV Manufacturers Market Share',
      'Table 3: Global Wind Turbine Orders (GW), 2024-2025'
    ],
    companies: [
      'NextEra Energy', 'Orsted', 'Vestas', 'Siemens Gamesa', 'First Solar', 'Enel Green Power', 'Iberdrola', 'Brookfield Renewable'
    ]
  },
  {
    id: 2,
    title: 'North America Electric Vehicle Battery Supply Chain Analysis',
    code: 'NG-AEM-2026-04',
    category: 'Automotive, EV & Mobility',
    geography: 'North America',
    date: 'Jan 2026',
    summary: 'Deep dive into raw material sourcing, manufacturing capacity, and regulatory impacts on the EV battery ecosystem.',
    price: 3800,
    pages: 142,
    coverage: 'Regional',
    description: 'This report analyzes the rapidly evolving EV battery supply chain in North America, focusing on critical mineral sourcing, gigafactory capacity expansion, and the impact of the Inflation Reduction Act.',
    toc: [
      'Executive Summary',
      'Raw Material Supply & Demand',
      'Gigafactory Capacity Forecasts',
      'Regulatory Impact Analysis',
      'Recycling & Circular Economy',
      'Competitive Landscape'
    ],
    lof: [
      'Figure 1: North America EV Battery Production Capacity (GWh)',
      'Figure 2: Lithium Supply vs. Demand Forecast',
      'Figure 3: Battery Cost Breakdown ($/kWh)'
    ],
    lot: [
      'Table 1: Operational and Planned Gigafactories in North America',
      'Table 2: Key Raw Material Suppliers and Agreements'
    ],
    companies: ['Tesla', 'Panasonic', 'LG Energy Solution', 'Albemarle', 'General Motors', 'Ford']
  },
  {
    id: 3,
    title: 'Generative AI in Healthcare: Market Opportunities & Risks',
    code: 'NG-HLS-2025-12',
    category: 'Healthcare & Life Sciences',
    geography: 'Global',
    date: 'Dec 2025',
    summary: 'Strategic assessment of AI adoption in drug discovery, patient care, and administrative workflows.',
    price: 5200,
    pages: 210,
    coverage: 'Global',
    description: 'An in-depth look at how Generative AI is transforming healthcare, from accelerating drug discovery to personalizing patient care and automating administrative tasks.',
    toc: [
      'Market Overview',
      'AI in Drug Discovery',
      'Clinical Applications',
      'Administrative Use Cases',
      'Regulatory & Ethical Considerations',
      'Market Forecasts'
    ],
    lof: [
      'Figure 1: AI in Healthcare Market Size, 2024-2030',
      'Figure 2: Adoption Rates by Healthcare Segment',
      'Figure 3: Investment in Healthcare AI Startups'
    ],
    lot: [
      'Table 1: Top Generative AI Use Cases in Healthcare',
      'Table 2: Regulatory Frameworks for AI in Medicine'
    ],
    companies: ['NVIDIA', 'Google Health', 'Microsoft', 'IBM Watson', 'Tempus', 'Insilico Medicine']
  },
  {
    id: 4,
    title: 'Europe Sustainable Packaging Market Forecast',
    code: 'NG-CGR-2025-11',
    category: 'Consumer Goods, Retail & E-Commerce',
    geography: 'Europe',
    date: 'Nov 2025',
    summary: 'Analysis of regulatory shifts and consumer preferences driving demand for biodegradable and recyclable packaging.',
    price: 3200,
    pages: 120,
    coverage: 'Regional',
    description: 'This report examines the shift towards sustainable packaging in Europe, driven by the EU Green Deal and changing consumer preferences.',
    toc: [
      'Regulatory Landscape (PPWR)',
      'Material Innovation',
      'Consumer Sentiment Analysis',
      'Sector Analysis (Food, Beverage, Personal Care)',
      'Market Forecasts'
    ],
    lof: [
      'Figure 1: European Sustainable Packaging Market Share by Material',
      'Figure 2: Consumer Willingness to Pay for Sustainable Packaging'
    ],
    lot: [
      'Table 1: EU Packaging Waste Reduction Targets',
      'Table 2: Major Sustainable Packaging Initiatives by FMCG Companies'
    ],
    companies: ['Amcor', 'Mondi', 'Smurfit Kappa', 'Stora Enso', 'Huhtamaki']
  },
  {
    id: 5,
    title: 'Asia-Pacific Semiconductor Manufacturing Equipment Market',
    code: 'NG-DTA-2025-10',
    category: 'Digital Technologies, AI & Semiconductors',
    geography: 'APAC',
    date: 'Oct 2025',
    summary: 'Market sizing and competitive landscape of front-end and back-end semiconductor equipment in key Asian hubs.',
    price: 4800,
    pages: 165,
    coverage: 'Regional',
    description: 'A detailed analysis of the semiconductor equipment market in APAC, covering lithography, deposition, etching, and packaging technologies.',
    toc: [
      'Semiconductor Industry Outlook',
      'Wafer Fab Equipment Market',
      'Assembly & Packaging Equipment',
      'Regional Analysis (China, Taiwan, Korea, Japan)',
      'Competitive Landscape'
    ],
    lof: [
      'Figure 1: APAC Semiconductor Equipment Market Size',
      'Figure 2: Wafer Fab Capacity by Country'
    ],
    lot: [
      'Table 1: Top Semiconductor Equipment Suppliers in APAC',
      'Table 2: Planned Fab Expansions in Asia'
    ],
    companies: ['ASML', 'Applied Materials', 'Tokyo Electron', 'Lam Research', 'KLA']
  },
];

export const industryData: Record<string, { title: string; description: string; details: string; image: string }> = {
  'energy-power-infrastructure': {
    title: 'Energy, Power & Infrastructure',
    description: 'Global energy and infrastructure markets are undergoing structural transformation driven by decarbonization priorities, grid modernization, capital reallocation, and technological advancement.',
    details: 'This research provides analytical perspectives on renewable energy deployment, evolving power systems, storage technologies, and infrastructure investment dynamics. Neargoal’s intelligence supports organizations evaluating market opportunities, regulatory developments, demand trajectories, and competitive risks. The analysis enables long-term planning and capital allocation decisions within industries characterized by complex transition cycles and high capital intensity.',
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=2070',
  },
  'chemicals-materials': {
    title: 'Chemicals, Water Technologies & Advanced Materials',
    description: 'Chemicals, water technologies, and advanced materials markets continue to evolve under the influence of sustainability mandates, regulatory pressures, innovation cycles, and feedstock volatility.',
    details: 'The research examines demand patterns, cost structures, application shifts, and emerging technological transitions. Organizations rely on Neargoal’s intelligence to assess growth potential, evaluate strategic risks, model pricing dynamics, and understand competitive landscapes. The insights support informed decision-making across specialty chemicals, environmental technologies, and next-generation material ecosystems.',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=2070',
  },
  'automotive-mobility': {
    title: 'Automotive, EV & Mobility',
    description: 'Electrification, digitalization, regulatory change, and shifting consumer adoption patterns are reshaping the global automotive and mobility landscape.',
    details: 'This intelligence evaluates technology transitions, adoption trajectories, supply chain evolution, and competitive dynamics across vehicles and mobility systems. Neargoal provides decision-oriented research used by strategic teams to model demand scenarios, assess investment priorities, evaluate emerging technologies, and navigate industry disruption driven by rapid innovation cycles.',
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=2072',
  },
  'digital-tech-ai': {
    title: 'Digital Technologies, AI & Semiconductors',
    description: 'Rapid advances in artificial intelligence, digital platforms, and semiconductor technologies are redefining competitive advantage across global industries.',
    details: 'The research analyzes innovation trajectories, demand evolution, ecosystem dynamics, and structural market shifts. Strategic decision-makers use Neargoal’s intelligence to evaluate growth opportunities, assess competitive positioning, understand adoption patterns, and anticipate technology-driven disruption across digital and semiconductor value chains.',
    image: '/industries/digital-tech-ai.png',
  },
  'consumer-goods': {
    title: 'Consumer Goods, Retail & E-Commerce',
    description: 'Evolving consumer behavior, channel transformation, pricing pressures, and technological integration continue to redefine global consumer markets.',
    details: 'This research provides analytical perspectives on demand variability, category dynamics, retail transformation, and digital commerce ecosystems. Neargoal’s intelligence supports organizations identifying growth opportunities, evaluating competitive positioning, modeling demand sensitivity, and navigating rapidly shifting consumption and distribution environments.',
    image: '/industries/consumer-goods.png',
  },
  'healthcare': {
    title: 'Healthcare & Life Sciences',
    description: 'Healthcare and life sciences markets are shaped by regulatory complexity, innovation cycles, pricing pressures, and evolving care delivery models.',
    details: 'The research evaluates demand dynamics, competitive landscapes, therapy adoption, and emerging technological shifts. Neargoal provides structured intelligence relied upon by industry stakeholders to assess market potential, evaluate strategic risks, support investment decisions, and navigate uncertainty across global healthcare ecosystems.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=2070',
  },
  'defense-aerospace': {
    title: 'Defense & Aerospace',
    description: 'Geopolitical developments, modernization initiatives, procurement cycles, and technological advancement continue to influence defense and aerospace markets.',
    details: 'This intelligence examines budgetary trends, capability evolution, technology transitions, and competitive positioning. Organizations use Neargoal’s research to understand long-term demand drivers, assess investment priorities, evaluate emerging technologies, and identify structural opportunities within policy-driven and highly specialized sectors.',
    image: '/industries/defense-aerospace.png',
  },
};

export const blogs = [
  {
    id: 1,
    title: 'The Future of Green Hydrogen in Heavy Industry',
    author: 'Sarah Jenkins',
    date: 'March 15, 2024',
    category: 'Energy',
    summary: 'Analyzing the cost competitiveness and adoption barriers of green hydrogen in steel and cement production.',
    content: 'Green hydrogen is poised to play a pivotal role in decarbonizing hard-to-abate sectors...'
  },
  {
    id: 2,
    title: 'Semiconductor Supply Chain Resilience Strategies',
    author: 'David Chen',
    date: 'March 10, 2024',
    category: 'Technology',
    summary: 'How companies are diversifying suppliers and regionalizing production to mitigate geopolitical risks.',
    content: 'The global semiconductor shortage exposed critical vulnerabilities...'
  },
  {
    id: 3,
    title: 'AI in Drug Discovery: A Paradigm Shift',
    author: 'Dr. Emily Wong',
    date: 'March 5, 2024',
    category: 'Healthcare',
    summary: 'Accelerating timelines and reducing costs in pharmaceutical R&D through generative models.',
    content: 'Traditional drug discovery is a lengthy and expensive process...'
  }
];

export const caseStudies = [
  {
    id: 1,
    title: 'Market Entry Strategy for EV Charging Infrastructure',
    client: 'Major European Utility',
    sector: 'Automotive & Energy',
    challenge: 'Identifying optimal locations and business models for expansion into the US market.',
    solution: 'Comprehensive geospatial analysis and regulatory assessment.',
    impact: 'Successfully deployed 500+ charging stations in key corridors with 20% higher utilization than average.'
  },
  {
    id: 2,
    title: 'Digital Transformation for a Global Logistics Firm',
    client: 'Top 10 Logistics Provider',
    sector: 'Transportation',
    challenge: 'Modernizing legacy systems to improve visibility and efficiency.',
    solution: 'Implemented IoT tracking and AI-driven route optimization.',
    impact: 'Reduced operational costs by 15% and improved on-time delivery rates by 12%.'
  }
];

export const marketUpdates = [
  {
    id: 1,
    title: 'Merger Announcement: TechGiant acquires AI Startup',
    date: 'March 20, 2024',
    category: 'Corporate Developments',
    summary: 'Consolidation in the generative AI space continues as major players seek to bolster their capabilities.'
  },
  {
    id: 2,
    title: 'New EU Regulations on Battery Recycling',
    date: 'March 18, 2024',
    category: 'Press Releases',
    summary: 'Stricter mandates for material recovery rates will impact the entire EV supply chain.'
  },
  {
    id: 3,
    title: 'Oil Prices Surge Amidst Geopolitical Tensions',
    date: 'March 12, 2024',
    category: 'Corporate Developments',
    summary: 'Supply disruptions in the Middle East drive crude oil benchmarks to 6-month highs.'
  },
  {
    id: 4,
    title: 'Neargoal Consulting Expands APAC Operations',
    date: 'March 10, 2024',
    category: 'Press Releases',
    summary: 'New regional headquarters in Singapore to support growing demand for semiconductor market intelligence.'
  },
  {
    id: 5,
    title: 'Strategic Partnership Announced with GreenEnergy Corp',
    date: 'March 05, 2024',
    category: 'Corporate Developments',
    summary: 'Joint venture aims to accelerate hydrogen infrastructure deployment across Northern Europe.'
  }
];
