from __future__ import annotations

from models import Blog, Career, CaseStudy, FAQ, Industry, MarketUpdate, Report, Service, db


INDUSTRIES = [
    {
        "name": "Energy, Power & Infrastructure",
        "slug": "energy-power-infrastructure",
        "description": "Global energy and infrastructure markets are undergoing structural transformation driven by decarbonization priorities, grid modernization, capital reallocation, and technological advancement.",
        "details": "This research provides analytical perspectives on renewable energy deployment, evolving power systems, storage technologies, and infrastructure investment dynamics. Neargoal intelligence supports organizations evaluating market opportunities, regulatory developments, demand trajectories, and competitive risks.",
        "image": "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=2070",
        "sort_order": 1,
    },
    {
        "name": "Chemicals, Water & Materials",
        "slug": "chemicals-materials",
        "description": "Chemicals, water technologies, and advanced materials markets continue to evolve under the influence of sustainability mandates, regulatory pressures, innovation cycles, and feedstock volatility.",
        "details": "The research examines demand patterns, cost structures, application shifts, and emerging technological transitions. Organizations rely on Neargoal intelligence to assess growth potential, evaluate strategic risks, and understand competitive landscapes.",
        "image": "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=2070",
        "sort_order": 2,
    },
    {
        "name": "Automotive, EV & Mobility",
        "slug": "automotive-mobility",
        "description": "Electrification, digitalization, regulatory change, and shifting consumer adoption patterns are reshaping the global automotive and mobility landscape.",
        "details": "This intelligence evaluates technology transitions, adoption trajectories, supply chain evolution, and competitive dynamics across vehicles and mobility systems. Neargoal provides decision-oriented research used by strategic teams to model demand scenarios and navigate disruption.",
        "image": "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=2072",
        "sort_order": 3,
    },
    {
        "name": "Digital Tech, AI & Semiconductors",
        "slug": "digital-tech-ai",
        "description": "Rapid advances in artificial intelligence, digital platforms, and semiconductor technologies are redefining competitive advantage across global industries.",
        "details": "The research analyzes innovation trajectories, demand evolution, ecosystem dynamics, and structural market shifts. Strategic decision-makers use Neargoal intelligence to evaluate growth opportunities, assess competitive positioning, and anticipate technology-driven disruption.",
        "image": "/static/images/industries/digital-tech-ai.png",
        "sort_order": 4,
    },
    {
        "name": "Consumer Goods & Retail",
        "slug": "consumer-goods",
        "description": "Evolving consumer behavior, channel transformation, pricing pressures, and technological integration continue to redefine global consumer markets.",
        "details": "This research provides analytical perspectives on demand variability, category dynamics, retail transformation, and digital commerce ecosystems. Neargoal intelligence supports organizations identifying growth opportunities and navigating rapidly shifting consumption environments.",
        "image": "/static/images/industries/consumer-goods.png",
        "sort_order": 5,
    },
    {
        "name": "Healthcare & Life Sciences",
        "slug": "healthcare",
        "description": "Healthcare and life sciences markets are shaped by regulatory complexity, innovation cycles, pricing pressures, and evolving care delivery models.",
        "details": "The research evaluates demand dynamics, competitive landscapes, therapy adoption, and emerging technological shifts. Neargoal provides structured intelligence relied upon by stakeholders to assess market potential and navigate uncertainty.",
        "image": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=2070",
        "sort_order": 6,
    },
    {
        "name": "Defense & Aerospace",
        "slug": "defense-aerospace",
        "description": "Geopolitical developments, modernization initiatives, procurement cycles, and technological advancement continue to influence defense and aerospace markets.",
        "details": "This intelligence examines budgetary trends, capability evolution, technology transitions, and competitive positioning. Organizations use Neargoal research to understand long-term demand drivers and evaluate structural opportunities.",
        "image": "/static/images/industries/defense-aerospace.png",
        "sort_order": 7,
    },
]


SERVICES = [
    {
        "name": "Custom Market Research",
        "slug": "custom-research",
        "description": "Strategic decisions often require analysis tailored to highly specific market contexts, competitive environments, and business objectives.",
        "details": "This research is designed to address unique intelligence requirements, ranging from market opportunity assessments and demand analysis to competitive landscapes and growth evaluations. Neargoal works closely with organizations to develop structured research frameworks that reduce uncertainty and support decision confidence.",
        "image": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=2070",
        "benefits": [
            "Tailored methodology aligned with specific strategic questions",
            "Primary research-driven insights",
            "Granular market sizing and forecasting",
            "Direct analyst access and interactive workshops",
        ],
        "sort_order": 1,
    },
    {
        "name": "Competitive & Strategic Intelligence",
        "slug": "competitive-intelligence",
        "description": "Understanding competitive positioning, market structure, and strategic behavior is essential in increasingly dynamic industry environments.",
        "details": "This intelligence focuses on evaluating competitive dynamics, benchmarking strategies, identifying emerging risks, and interpreting structural market shifts. Organizations rely on Neargoal analysis to inform market entry decisions, strategic planning, and long-term positioning.",
        "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070",
        "benefits": [
            "Competitor benchmarking and strategy decoding",
            "Early warning signals for market shifts",
            "M&A and partnership activity tracking",
            "Value chain analysis and positioning",
        ],
        "sort_order": 2,
    },
    {
        "name": "Decision Support & Scenario Analysis",
        "slug": "decision-support",
        "description": "Complex business environments demand structured approaches to uncertainty, risk evaluation, and strategic trade-offs.",
        "details": "This analytical capability applies scenario modeling, sensitivity analysis, and forward-looking frameworks to assess potential outcomes under varying market conditions. The objective is not prediction, but improved decision resilience through structured analytical thinking.",
        "image": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=2071",
        "benefits": [
            "Scenario planning for uncertainty management",
            "Risk impact assessment",
            "Strategic option evaluation",
            "Policy and regulatory impact modeling",
        ],
        "sort_order": 3,
    },
    {
        "name": "Industry Tracking & Subscriptions",
        "slug": "industry-tracking",
        "description": "Rapidly evolving industries require continuous monitoring of market developments, competitive movements, regulatory changes, and emerging trends.",
        "details": "These subscription-based intelligence solutions provide ongoing analytical visibility across selected markets and sectors. Neargoal tracking frameworks are designed to support strategic teams requiring structured, consistent, and decision-relevant market intelligence.",
        "image": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2015",
        "benefits": [
            "Continuous market monitoring",
            "Quarterly or monthly strategic briefs",
            "Analyst briefings and Q&A sessions",
            "Curated news and impact analysis",
        ],
        "sort_order": 4,
    },
    {
        "name": "Investment & Due Diligence",
        "slug": "investment-due-diligence",
        "description": "Investment decisions demand rigorous evaluation of market potential, structural risks, competitive environments, and long-term growth dynamics.",
        "details": "This research provides decision-grade intelligence supporting opportunity validation, commercial assessments, and risk analysis. The analysis is structured to inform high-stakes capital allocation and transaction-related decisions.",
        "image": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=2072",
        "benefits": [
            "Commercial due diligence support",
            "Market opportunity validation",
            "Red flag identification",
            "Customer and competitor voice analysis",
        ],
        "sort_order": 5,
    },
]


REPORTS = [
    {
        "title": "Global Renewable Energy Market Outlook 2026-2030",
        "code": "NG-EPI-2026-01",
        "industry_slug": "energy-power-infrastructure",
        "geography": "Global",
        "published_label": "Feb 2026",
        "summary": "Comprehensive analysis of solar, wind, and hydrogen energy adoption trends across major economies.",
        "price": 4500,
        "pages": 185,
        "coverage": "Global",
        "description": "The global renewable energy market is poised for transformative growth over the next five years, driven by accelerated decarbonization mandates, falling technology costs, and robust policy support across major economies. This report provides a deep dive into structural shifts reshaping the energy landscape, with granular analysis of solar, wind, hydrogen, and energy storage sectors.",
        "toc": [
            "Executive Summary",
            "Market Overview & Key Drivers",
            "Regulatory Landscape & Policy Analysis",
            "Technology Trends: Solar PV, Wind, Green Hydrogen",
            "Regional Market Analysis (North America, Europe, APAC, MEA, LATAM)",
            "Competitive Landscape & Strategic Positioning",
            "Investment Analysis & M&A Trends",
            "Market Forecasts 2026-2030",
        ],
        "lof": [
            "Figure 1: Global Renewable Energy Capacity Additions (GW), 2020-2030",
            "Figure 2: LCOE Comparison: Solar PV vs. Wind vs. Fossil Fuels",
            "Figure 3: Green Hydrogen Production Cost Curve",
            "Figure 4: Regional Investment in Renewable Energy, 2025",
        ],
        "lot": [
            "Table 1: Key Regulatory Mandates by Region",
            "Table 2: Major Solar PV Manufacturers Market Share",
            "Table 3: Global Wind Turbine Orders (GW), 2024-2025",
        ],
        "companies": [
            "NextEra Energy",
            "Orsted",
            "Vestas",
            "Siemens Gamesa",
            "First Solar",
            "Enel Green Power",
            "Iberdrola",
            "Brookfield Renewable",
        ],
    },
    {
        "title": "North America Electric Vehicle Battery Supply Chain Analysis",
        "code": "NG-AEM-2026-04",
        "industry_slug": "automotive-mobility",
        "geography": "North America",
        "published_label": "Jan 2026",
        "summary": "Deep dive into raw material sourcing, manufacturing capacity, and regulatory impacts on the EV battery ecosystem.",
        "price": 3800,
        "pages": 142,
        "coverage": "Regional",
        "description": "This report analyzes the rapidly evolving EV battery supply chain in North America, focusing on critical mineral sourcing, gigafactory capacity expansion, and the impact of the Inflation Reduction Act.",
        "toc": [
            "Executive Summary",
            "Raw Material Supply & Demand",
            "Gigafactory Capacity Forecasts",
            "Regulatory Impact Analysis",
            "Recycling & Circular Economy",
            "Competitive Landscape",
        ],
        "lof": [
            "Figure 1: North America EV Battery Production Capacity (GWh)",
            "Figure 2: Lithium Supply vs. Demand Forecast",
            "Figure 3: Battery Cost Breakdown ($/kWh)",
        ],
        "lot": [
            "Table 1: Operational and Planned Gigafactories in North America",
            "Table 2: Key Raw Material Suppliers and Agreements",
        ],
        "companies": ["Tesla", "Panasonic", "LG Energy Solution", "Albemarle", "General Motors", "Ford"],
    },
    {
        "title": "Generative AI in Healthcare: Market Opportunities & Risks",
        "code": "NG-HLS-2025-12",
        "industry_slug": "healthcare",
        "geography": "Global",
        "published_label": "Dec 2025",
        "summary": "Strategic assessment of AI adoption in drug discovery, patient care, and administrative workflows.",
        "price": 5200,
        "pages": 210,
        "coverage": "Global",
        "description": "An in-depth look at how Generative AI is transforming healthcare, from accelerating drug discovery to personalizing patient care and automating administrative tasks.",
        "toc": [
            "Market Overview",
            "AI in Drug Discovery",
            "Clinical Applications",
            "Administrative Use Cases",
            "Regulatory & Ethical Considerations",
            "Market Forecasts",
        ],
        "lof": [
            "Figure 1: AI in Healthcare Market Size, 2024-2030",
            "Figure 2: Adoption Rates by Healthcare Segment",
            "Figure 3: Investment in Healthcare AI Startups",
        ],
        "lot": [
            "Table 1: Top Generative AI Use Cases in Healthcare",
            "Table 2: Regulatory Frameworks for AI in Medicine",
        ],
        "companies": ["NVIDIA", "Google Health", "Microsoft", "IBM Watson", "Tempus", "Insilico Medicine"],
    },
    {
        "title": "Europe Sustainable Packaging Market Forecast",
        "code": "NG-CGR-2025-11",
        "industry_slug": "consumer-goods",
        "geography": "Europe",
        "published_label": "Nov 2025",
        "summary": "Analysis of regulatory shifts and consumer preferences driving demand for biodegradable and recyclable packaging.",
        "price": 3200,
        "pages": 120,
        "coverage": "Regional",
        "description": "This report examines the shift towards sustainable packaging in Europe, driven by the EU Green Deal and changing consumer preferences.",
        "toc": [
            "Regulatory Landscape (PPWR)",
            "Material Innovation",
            "Consumer Sentiment Analysis",
            "Sector Analysis (Food, Beverage, Personal Care)",
            "Market Forecasts",
        ],
        "lof": [
            "Figure 1: European Sustainable Packaging Market Share by Material",
            "Figure 2: Consumer Willingness to Pay for Sustainable Packaging",
        ],
        "lot": [
            "Table 1: EU Packaging Waste Reduction Targets",
            "Table 2: Major Sustainable Packaging Initiatives by FMCG Companies",
        ],
        "companies": ["Amcor", "Mondi", "Smurfit Kappa", "Stora Enso", "Huhtamaki"],
    },
    {
        "title": "Asia-Pacific Semiconductor Manufacturing Equipment Market",
        "code": "NG-DTA-2025-10",
        "industry_slug": "digital-tech-ai",
        "geography": "APAC",
        "published_label": "Oct 2025",
        "summary": "Market sizing and competitive landscape of front-end and back-end semiconductor equipment in key Asian hubs.",
        "price": 4800,
        "pages": 165,
        "coverage": "Regional",
        "description": "A detailed analysis of the semiconductor equipment market in APAC, covering lithography, deposition, etching, and packaging technologies.",
        "toc": [
            "Semiconductor Industry Outlook",
            "Wafer Fab Equipment Market",
            "Assembly & Packaging Equipment",
            "Regional Analysis (China, Taiwan, Korea, Japan)",
            "Competitive Landscape",
        ],
        "lof": [
            "Figure 1: APAC Semiconductor Equipment Market Size",
            "Figure 2: Wafer Fab Capacity by Country",
        ],
        "lot": [
            "Table 1: Top Semiconductor Equipment Suppliers in APAC",
            "Table 2: Planned Fab Expansions in Asia",
        ],
        "companies": ["ASML", "Applied Materials", "Tokyo Electron", "Lam Research", "KLA"],
    },
]


BLOGS = [
    {
        "title": "The Future of Green Hydrogen in Heavy Industry",
        "slug": "future-of-green-hydrogen-heavy-industry",
        "author": "Sarah Jenkins",
        "date_label": "March 15, 2024",
        "category": "Energy",
        "summary": "Analyzing the cost competitiveness and adoption barriers of green hydrogen in steel and cement production.",
        "image": "https://picsum.photos/seed/hydrogen/1200/600",
        "tags": ["Hydrogen", "Renewable Energy", "Infrastructure"],
        "content": """
        <p class="lead text-xl text-slate-600 mb-8">As governments pledge billions to hydrogen infrastructure, we analyze the economic viability and technical hurdles that remain for widespread adoption.</p>
        <p class="mb-6">Green hydrogen has long been hailed as a versatile fuel capable of decarbonizing hard-to-abate sectors like steel, shipping, and heavy transport. However, despite enthusiastic policy support and project announcements, the sector still faces a reality check.</p>
        <h2 class="text-2xl font-bold text-slate-900 mt-8 mb-4">The Cost Conundrum</h2>
        <p class="mb-6">Currently, green hydrogen remains meaningfully more expensive than grey hydrogen. While electrolyzer costs are falling, they are not declining at the same pace that solar PV experienced in its scale-up phase.</p>
        <h2 class="text-2xl font-bold text-slate-900 mt-8 mb-4">Infrastructure Bottlenecks</h2>
        <p class="mb-6">Transporting hydrogen is difficult. Local hydrogen hubs where production and consumption happen in close proximity are likely to dominate early market development.</p>
        <div class="bg-slate-50 p-6 border-l-4 border-sky-600 my-8 italic text-slate-700">The winners in the hydrogen economy will be the players that can lock in offtake and infrastructure economics, not just technology novelty.</div>
        <h2 class="text-2xl font-bold text-slate-900 mt-8 mb-4">Strategic Outlook</h2>
        <p class="mb-6">Despite the challenges, momentum is undeniable. Investors should focus on integrated value chains and developers with a credible path to lower delivered cost.</p>
        """,
    },
    {
        "title": "Semiconductor Supply Chain Resilience Strategies",
        "slug": "semiconductor-supply-chain-resilience-strategies",
        "author": "David Chen",
        "date_label": "March 10, 2024",
        "category": "Technology",
        "summary": "How companies are diversifying suppliers and regionalizing production to mitigate geopolitical risks.",
        "image": "https://picsum.photos/seed/semiconductor/1200/600",
        "tags": ["Semiconductors", "Supply Chain", "APAC"],
        "content": """
        <p class="lead text-xl text-slate-600 mb-8">The global semiconductor shortage exposed critical vulnerabilities. The response is no longer limited to buffer inventory; it now includes structural redesign of the value chain.</p>
        <p class="mb-6">Regionalization strategies are accelerating across the US, Europe, Taiwan, and South Korea as governments deploy industrial policy to attract capacity.</p>
        <h2 class="text-2xl font-bold text-slate-900 mt-8 mb-4">Supplier Diversification</h2>
        <p class="mb-6">Multi-sourcing critical equipment and raw materials remains difficult, but firms are actively rethinking qualification strategies and geographic concentration.</p>
        <h2 class="text-2xl font-bold text-slate-900 mt-8 mb-4">Capex Discipline</h2>
        <p class="mb-6">The next phase will reward manufacturers that balance resilience with economic discipline rather than duplicating capacity indiscriminately.</p>
        """,
    },
    {
        "title": "AI in Drug Discovery: A Paradigm Shift",
        "slug": "ai-in-drug-discovery-a-paradigm-shift",
        "author": "Dr. Emily Wong",
        "date_label": "March 5, 2024",
        "category": "Healthcare",
        "summary": "Accelerating timelines and reducing costs in pharmaceutical R&D through generative models.",
        "image": "https://picsum.photos/seed/healthcare-ai/1200/600",
        "tags": ["Healthcare AI", "Drug Discovery", "R&D"],
        "content": """
        <p class="lead text-xl text-slate-600 mb-8">AI is reshaping the economics of molecule discovery, target identification, and trial design.</p>
        <p class="mb-6">The most valuable near-term use cases are not generic automation; they are workflow-specific interventions that improve hit rates and shorten iteration cycles.</p>
        <h2 class="text-2xl font-bold text-slate-900 mt-8 mb-4">Where the Value Is Forming</h2>
        <p class="mb-6">Platform companies with proprietary data partnerships have a stronger path to defensibility than model providers alone.</p>
        """,
    },
]


CASE_STUDIES = [
    {
        "title": "EV Market Entry Strategy for Southeast Asia",
        "slug": "ev-market-entry-strategy-southeast-asia",
        "client": "Global Automotive Manufacturer",
        "sector": "Automotive & Mobility",
        "challenge": "A leading European automotive OEM wanted to expand its electric vehicle portfolio into Southeast Asia but lacked clarity on consumer preferences, charging infrastructure readiness, and regulatory incentives across different countries in the region.",
        "solution": "Neargoal conducted a comprehensive market assessment covering Thailand, Indonesia, and Vietnam, including regulatory deep-dives, consumer research, and competitor benchmarking.",
        "impact": "Our roadmap enabled the client to prioritize Thailand as the initial launch market. The client successfully launched two EV models, captured 8 percent market share within the first year, and secured a strategic partnership for local assembly.",
        "image": "https://picsum.photos/seed/ev-case-study/1200/700",
        "stats": [
            {"label": "Market Opportunity", "value": "$2B+"},
            {"label": "Market Share Captured", "value": "8%"},
            {"label": "Launch Time", "value": "12 Months"},
        ],
    },
    {
        "title": "Digital Transformation for a Global Logistics Firm",
        "slug": "digital-transformation-global-logistics-firm",
        "client": "Top 10 Logistics Provider",
        "sector": "Transportation",
        "challenge": "Modernizing legacy systems to improve visibility and efficiency across regional operations.",
        "solution": "Neargoal mapped the operational stack, prioritized high-friction workflows, and designed an implementation plan for IoT tracking and AI-driven route optimization.",
        "impact": "The client reduced operational costs by 15 percent and improved on-time delivery rates by 12 percent within the first year of rollout.",
        "image": "https://picsum.photos/seed/logistics-case-study/1200/700",
        "stats": [
            {"label": "Cost Reduction", "value": "15%"},
            {"label": "Delivery Improvement", "value": "12%"},
            {"label": "Regions Standardized", "value": "7"},
        ],
    },
]


MARKET_UPDATES = [
    {
        "title": "Merger Announcement: TechGiant Acquires AI Startup",
        "slug": "techgiant-acquires-ai-startup",
        "date_label": "March 20, 2024",
        "category": "Corporate Developments",
        "summary": "Consolidation in the generative AI space continues as major players seek to bolster their capabilities.",
        "tags": ["AI", "M&A", "Corporate Developments"],
        "content": """
        <p class="mb-4"><strong>NEW YORK, March 20, 2024</strong> - Strategic acquisition activity in generative AI remains elevated as established players race to secure product capabilities, talent, and proprietary models.</p>
        <p class="mb-4">This transaction signals that buyers are increasingly willing to pay for speed-to-market and embedded enterprise relationships rather than pure experimentation.</p>
        """,
    },
    {
        "title": "New EU Regulations on Battery Recycling",
        "slug": "eu-regulations-battery-recycling",
        "date_label": "March 18, 2024",
        "category": "Press Releases",
        "summary": "Stricter mandates for material recovery rates will impact the entire EV supply chain.",
        "tags": ["EU", "Battery Recycling", "Press Releases"],
        "content": """
        <p class="mb-4">New European rules tighten material recovery requirements and reporting obligations for battery producers and recyclers.</p>
        <p class="mb-4">The shift is expected to accelerate secondary supply chain investment and force changes in contract structures with OEMs and pack manufacturers.</p>
        """,
    },
    {
        "title": "Oil Prices Surge Amid Geopolitical Tensions",
        "slug": "oil-prices-surge-amid-geopolitical-tensions",
        "date_label": "March 12, 2024",
        "category": "Corporate Developments",
        "summary": "Supply disruptions in the Middle East drive crude oil benchmarks to six-month highs.",
        "tags": ["Energy", "Oil", "Corporate Developments"],
        "content": """
        <p class="mb-4">Crude benchmarks rose sharply as market participants priced in heightened supply risk and limited spare capacity in the near term.</p>
        <p class="mb-4">Downstream users are reassessing hedging strategy and margin sensitivity under a more volatile freight and feedstock environment.</p>
        """,
    },
    {
        "title": "Neargoal Consulting Expands APAC Operations",
        "slug": "neargoal-expands-apac-operations",
        "date_label": "March 10, 2024",
        "category": "Press Releases",
        "summary": "New regional headquarters in Singapore to support growing demand for semiconductor market intelligence.",
        "tags": ["Expansion", "APAC", "Strategy"],
        "content": """
        <p class="mb-4"><strong>SINGAPORE, March 10, 2024</strong> - Neargoal Consulting announced the expansion of its Asia-Pacific footprint with a regional hub in Singapore.</p>
        <p class="mb-4">The office will support deeper coverage of semiconductor manufacturing, electric mobility supply chains, and industrial technology adoption across the region.</p>
        """,
    },
    {
        "title": "Strategic Partnership Announced with GreenEnergy Corp",
        "slug": "strategic-partnership-with-greenenergy-corp",
        "date_label": "March 05, 2024",
        "category": "Corporate Developments",
        "summary": "Joint venture aims to accelerate hydrogen infrastructure deployment across Northern Europe.",
        "tags": ["Hydrogen", "Partnership", "Corporate Developments"],
        "content": """
        <p class="mb-4">The partnership is expected to focus on infrastructure buildout, permitting coordination, and long-term industrial offtake.</p>
        <p class="mb-4">The move reinforces the increasing role of consortium-based delivery models in early hydrogen markets.</p>
        """,
    },
]


CAREERS = [
    {
        "title": "Senior Research Analyst - Energy",
        "slug": "senior-research-analyst-energy",
        "location": "Remote / New York",
        "job_type": "Full-time",
        "department": "Market Intelligence",
        "description": "We are seeking a Senior Research Analyst to lead our coverage of the global renewable energy sector. The ideal candidate will have a deep understanding of power markets, policy frameworks, and emerging technologies like green hydrogen and energy storage.",
        "responsibilities": [
            "Lead the production of in-depth market reports and strategic briefs on renewable energy trends.",
            "Build and maintain proprietary market sizing and forecasting models.",
            "Conduct primary research through interviews with industry experts and stakeholders.",
            "Support consulting engagements with data-driven insights and strategic recommendations.",
            "Mentor junior analysts and contribute to the development of research methodologies.",
        ],
        "requirements": [
            "5+ years of experience in market research, consulting, or equity research focused on the energy sector.",
            "Strong quantitative skills and proficiency in Excel or financial modeling.",
            "Excellent written and verbal communication skills.",
            "Ability to synthesize complex data into clear, actionable insights.",
            "Bachelor degree in Economics, Finance, Engineering, or a related field; Master degree preferred.",
        ],
        "sort_order": 1,
    },
    {
        "title": "Market Research Associate",
        "slug": "market-research-associate",
        "location": "Remote",
        "job_type": "Full-time",
        "department": "Market Intelligence",
        "description": "Join our team as a Market Research Associate. You will support senior analysts in data collection, market analysis, and report writing across technology and healthcare sectors.",
        "responsibilities": [
            "Collect and analyze secondary data from filings, industry reports, and news sources.",
            "Assist in the creation of market models and forecast scenarios.",
            "Draft sections of market reports and client presentations.",
            "Maintain internal databases and track key industry developments.",
            "Participate in client calls and support project delivery.",
        ],
        "requirements": [
            "1-3 years of experience in market research or a related field.",
            "Strong analytical skills and attention to detail.",
            "Proficiency in Microsoft Office Suite.",
            "Curiosity and a willingness to learn about new industries.",
            "Bachelor degree in Business, Economics, or a related field.",
        ],
        "sort_order": 2,
    },
    {
        "title": "Business Development Manager",
        "slug": "business-development-manager",
        "location": "New York",
        "job_type": "Full-time",
        "department": "Sales & Marketing",
        "description": "We are looking for a results-driven Business Development Manager to drive growth and expand our client base. You will identify new opportunities, build relationships with decision-makers, and close deals.",
        "responsibilities": [
            "Identify and prospect potential clients in target industries.",
            "Build and maintain a robust sales pipeline.",
            "Conduct product demonstrations and presentations to prospective clients.",
            "Negotiate contracts and close sales deals.",
            "Collaborate with the research team to understand client needs and tailor solutions.",
        ],
        "requirements": [
            "3-5 years of experience in B2B sales, preferably in research or consulting.",
            "Proven track record of meeting or exceeding sales targets.",
            "Strong communication and interpersonal skills.",
            "Ability to work independently and as part of a team.",
            "Bachelor degree in Business, Marketing, or a related field.",
        ],
        "sort_order": 3,
    },
]


FAQS = [
    {
        "question": "What industries does Neargoal cover?",
        "answer": "We focus on high-impact markets including energy, mobility, semiconductors, healthcare, consumer goods, and defense.",
        "sort_order": 1,
    },
    {
        "question": "Do you offer custom research or only syndicated reports?",
        "answer": "We do both. Our syndicated reports cover broad market opportunities, and our consulting team delivers tailored custom research engagements.",
        "sort_order": 2,
    },
    {
        "question": "Can we speak directly with an analyst before purchase?",
        "answer": "Yes. You can request an analyst call from report pages or contact us directly with your requirements.",
        "sort_order": 3,
    },
    {
        "question": "How are your reports delivered?",
        "answer": "Reports are delivered digitally, typically as PDF and spreadsheet-based supporting files where relevant.",
        "sort_order": 4,
    },
    {
        "question": "Do you support subscriptions and ongoing tracking?",
        "answer": "Yes. Our industry tracking and intelligence subscriptions are designed for teams that need continuous market monitoring.",
        "sort_order": 5,
    },
]


CORE_VALUES = [
    {
        "title": "Research Depth",
        "description": "We go beyond surface-level data to uncover structural drivers of markets.",
    },
    {
        "title": "Analytical Rigor",
        "description": "Our methodologies are built on disciplined frameworks and cross-verification.",
    },
    {
        "title": "Transparency",
        "description": "We are clear about sources, assumptions, and confidence levels.",
    },
    {
        "title": "Client-centric Approach",
        "description": "Every engagement is structured around the specific strategic needs of our partners.",
    },
    {
        "title": "Outcome Orientation",
        "description": "Our goal is not just to provide information, but to enable effective decision-making.",
    },
]


TEAM_MEMBERS = [
    {
        "name": "Sarah Jenkins",
        "role": "Managing Partner",
        "image": "https://picsum.photos/seed/sarah/400/400",
        "bio": "Over 20 years of experience in global strategy consulting and market research.",
    },
    {
        "name": "David Chen",
        "role": "Head of Research",
        "image": "https://picsum.photos/seed/david/400/400",
        "bio": "Expert in energy and infrastructure markets with a focus on renewable transition.",
    },
    {
        "name": "Elena Rodriguez",
        "role": "Director of Client Strategy",
        "image": "https://picsum.photos/seed/elena/400/400",
        "bio": "Specializes in competitive intelligence and strategic advisory for Fortune 500 clients.",
    },
]


LEGAL_CONTENT = {
    "privacy-policy": {
        "title": "Privacy Policy",
        "sections": [
            {
                "heading": "Data Collection and Usage",
                "body": "We collect information that you provide directly to us when you request a sample, contact us for inquiries, or subscribe to newsletters. We use this information to provide the services you request and to communicate with you.",
            },
            {
                "heading": "Cookies Policy",
                "body": "We use cookies to enhance your browsing experience and analyze website traffic. You can disable cookies through your browser settings, although doing so may affect site functionality.",
            },
        ],
    },
    "terms": {
        "title": "Terms & Conditions",
        "sections": [
            {
                "heading": "Intellectual Property Rights",
                "body": "All content, reports, and materials available on this website are the intellectual property of Neargoal Consulting and are protected by applicable copyright and trademark laws.",
            },
            {
                "heading": "Disclaimer",
                "body": "The information provided on this website is for general informational purposes only. While we strive to ensure accuracy, Neargoal Consulting makes no warranties regarding completeness or reliability.",
            },
        ],
    },
}


def seed_database() -> None:
    if Industry.query.count() == 0:
        db.session.bulk_insert_mappings(Industry, INDUSTRIES)
        db.session.commit()

    if Service.query.count() == 0:
        db.session.bulk_insert_mappings(Service, SERVICES)
        db.session.commit()

    if Report.query.count() == 0:
        industries_by_slug = {industry.slug: industry.id for industry in Industry.query.all()}
        report_rows = []
        for report in REPORTS:
            report_rows.append(
                {
                    "title": report["title"],
                    "code": report["code"],
                    "geography": report["geography"],
                    "published_label": report["published_label"],
                    "summary": report["summary"],
                    "price": report["price"],
                    "pages": report["pages"],
                    "coverage": report["coverage"],
                    "description": report["description"],
                    "toc": report["toc"],
                    "lof": report["lof"],
                    "lot": report["lot"],
                    "companies": report["companies"],
                    "status": "Published",
                    "industry_id": industries_by_slug[report["industry_slug"]],
                }
            )
        db.session.bulk_insert_mappings(Report, report_rows)
        db.session.commit()

    if Blog.query.count() == 0:
        db.session.bulk_insert_mappings(Blog, BLOGS)
        db.session.commit()

    if CaseStudy.query.count() == 0:
        db.session.bulk_insert_mappings(CaseStudy, CASE_STUDIES)
        db.session.commit()

    if MarketUpdate.query.count() == 0:
        db.session.bulk_insert_mappings(MarketUpdate, MARKET_UPDATES)
        db.session.commit()

    if Career.query.count() == 0:
        db.session.bulk_insert_mappings(Career, CAREERS)
        db.session.commit()

    if FAQ.query.count() == 0:
        db.session.bulk_insert_mappings(FAQ, FAQS)
        db.session.commit()
