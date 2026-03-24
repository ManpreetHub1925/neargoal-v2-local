from datetime import datetime
from sqlalchemy import text


def _upsert_rows(conn, table_name, rows, update_columns=None):
    if not rows:
        return

    columns = list(rows[0].keys())
    placeholders = ", ".join(f":{col}" for col in columns)
    insert_columns = ", ".join(columns)

    if update_columns is None:
        update_columns = [col for col in columns if col not in {"id", "created_at"}]
    if not update_columns:
        update_columns = [columns[0]]

    updates = ", ".join(f"{col}=VALUES({col})" for col in update_columns)

    query = text(
        f"""
        INSERT INTO {table_name} ({insert_columns})
        VALUES ({placeholders})
        ON DUPLICATE KEY UPDATE {updates}
        """
    )
    for row in rows:
        conn.execute(query, row)


def seed(engine):
    now = datetime.utcnow()

    industry_segments = [
        {
            "name": "Energy, Power & Infrastructure",
            "slug": "energy-power-infrastructure",
            "tagline": "Transition pathways across generation, grids, storage and infrastructure investments.",
            "display_order": 1,
            "is_active": 1,
            "created_at": now,
            "updated_at": now,
        },
        {
            "name": "Chemicals, Water Technologies & Advanced Materials",
            "slug": "chemicals-water-technologies-advanced-materials",
            "tagline": "Coverage across specialty chemicals, environmental technologies and advanced material ecosystems.",
            "display_order": 2,
            "is_active": 1,
            "created_at": now,
            "updated_at": now,
        },
        {
            "name": "Automotive, EV & Mobility",
            "slug": "automotive-ev-mobility",
            "tagline": "Research on electrification, mobility demand, supply chain shifts and innovation cycles.",
            "display_order": 3,
            "is_active": 1,
            "created_at": now,
            "updated_at": now,
        },
        {
            "name": "Digital Technologies, AI & Semiconductors",
            "slug": "digital-technologies-ai-semiconductors",
            "tagline": "Decision-focused intelligence across AI, digital ecosystems and semiconductor value chains.",
            "display_order": 4,
            "is_active": 1,
            "created_at": now,
            "updated_at": now,
        },
        {
            "name": "Consumer Goods, Retail & E-Commerce",
            "slug": "consumer-goods-retail-e-commerce",
            "tagline": "Demand and channel intelligence for evolving consumer markets and digital commerce.",
            "display_order": 5,
            "is_active": 1,
            "created_at": now,
            "updated_at": now,
        },
        {
            "name": "Healthcare & Life Sciences",
            "slug": "healthcare-life-sciences",
            "tagline": "Structured insights on therapy adoption, care models, regulation and market potential.",
            "display_order": 6,
            "is_active": 1,
            "created_at": now,
            "updated_at": now,
        },
        {
            "name": "Defense & Aerospace",
            "slug": "defense-aerospace",
            "tagline": "Long-horizon intelligence on procurement cycles, technology transitions and demand drivers.",
            "display_order": 7,
            "is_active": 1,
            "created_at": now,
            "updated_at": now,
        },
    ]

    advisory_segments = [
        {
            "name": "Custom Market Research",
            "slug": "custom-market-research",
            "display_order": 1,
            "is_active": 1,
            "created_at": now,
            "updated_at": now,
        },
        {
            "name": "Competitive & Strategic Intelligence",
            "slug": "competitive-strategic-intelligence",
            "display_order": 2,
            "is_active": 1,
            "created_at": now,
            "updated_at": now,
        },
        {
            "name": "Decision Support & Scenario Analysis",
            "slug": "decision-support-scenario-analysis",
            "display_order": 3,
            "is_active": 1,
            "created_at": now,
            "updated_at": now,
        },
        {
            "name": "Industry Tracking & Intelligence Subscriptions",
            "slug": "industry-tracking-intelligence-subscriptions",
            "display_order": 4,
            "is_active": 1,
            "created_at": now,
            "updated_at": now,
        },
        {
            "name": "Investment & Due Diligence Research",
            "slug": "investment-due-diligence-research",
            "display_order": 5,
            "is_active": 1,
            "created_at": now,
            "updated_at": now,
        },
    ]

    service_families = [
        {
            "title": "Market Intelligence Reports",
            "slug": "market-intelligence-reports",
            "display_order": 1,
            "is_active": 1,
            "created_at": now,
            "updated_at": now,
        },
        {
            "title": "Research & Advisory Services",
            "slug": "research-advisory-services",
            "display_order": 2,
            "is_active": 1,
            "created_at": now,
            "updated_at": now,
        },
    ]

    blog_categories = [
        {"name": "News", "slug": "news", "is_active": 1, "created_at": now},
        {"name": "Insights", "slug": "insights", "is_active": 1, "created_at": now},
        {"name": "Case Studies", "slug": "case-studies", "is_active": 1, "created_at": now},
        {"name": "Press Releases", "slug": "press-releases", "is_active": 1, "created_at": now},
        {"name": "Corporate Developments", "slug": "corporate-developments", "is_active": 1, "created_at": now},
    ]

    reports = [
        {
            "title": "Global Energy Storage Systems Market Outlook 2026-2032",
            "slug": "global-energy-storage-systems-market-outlook-2026-2032",
            "industry_slug": "energy-power-infrastructure",
            "excerpt": "Assessment of demand trajectory, policy frameworks and competitive landscape across storage technologies.",
            "content": "<h2>Executive Summary</h2><p>Global storage investments continue to rise with grid balancing demand.</p>",
            "table_of_contents": "<h2>Table of Contents</h2><h3>Market Overview</h3><h3>Regional Outlook</h3>",
            "banner_image": "https://img.freepik.com/free-vector/research-concept-illustration_114360-1338.jpg",
            "price": 2500.00,
            "is_active": 1,
            "created_at": now,
            "updated_at": now,
        },
        {
            "title": "Advanced Water Treatment Chemicals Market Intelligence Report",
            "slug": "advanced-water-treatment-chemicals-market-intelligence-report",
            "industry_slug": "chemicals-water-technologies-advanced-materials",
            "excerpt": "Demand and pricing outlook across municipal and industrial applications with feedstock risk analysis.",
            "content": "<h2>Executive Summary</h2><p>Water treatment chemistry demand is evolving under stricter compliance requirements.</p>",
            "table_of_contents": "<h2>Table of Contents</h2><h3>Demand Analysis</h3><h3>Competitive Landscape</h3>",
            "banner_image": "https://img.freepik.com/free-vector/research-concept-illustration_114360-1338.jpg",
            "price": 2300.00,
            "is_active": 1,
            "created_at": now,
            "updated_at": now,
        },
        {
            "title": "EV Charging Infrastructure and Mobility Services Forecast",
            "slug": "ev-charging-infrastructure-and-mobility-services-forecast",
            "industry_slug": "automotive-ev-mobility",
            "excerpt": "Scenario-based forecast of charging demand, asset utilization and service economics.",
            "content": "<h2>Executive Summary</h2><p>Charging ecosystems are expanding across public and fleet-focused deployments.</p>",
            "table_of_contents": "<h2>Table of Contents</h2><h3>Technology Trends</h3><h3>Investment Priorities</h3>",
            "banner_image": "https://img.freepik.com/free-vector/research-concept-illustration_114360-1338.jpg",
            "price": 2700.00,
            "is_active": 1,
            "created_at": now,
            "updated_at": now,
        },
        {
            "title": "AI Accelerator and Semiconductor Demand Tracking 2026",
            "slug": "ai-accelerator-and-semiconductor-demand-tracking-2026",
            "industry_slug": "digital-technologies-ai-semiconductors",
            "excerpt": "Evaluation of demand pockets, supply-side constraints and value chain opportunities in AI hardware.",
            "content": "<h2>Executive Summary</h2><p>Accelerated computing demand is driving major changes in semiconductor procurement patterns.</p>",
            "table_of_contents": "<h2>Table of Contents</h2><h3>Supply Dynamics</h3><h3>Competitive Positioning</h3>",
            "banner_image": "https://img.freepik.com/free-vector/research-concept-illustration_114360-1338.jpg",
            "price": 2900.00,
            "is_active": 1,
            "created_at": now,
            "updated_at": now,
        },
        {
            "title": "Global Omnichannel Retail Strategy Benchmark Report",
            "slug": "global-omnichannel-retail-strategy-benchmark-report",
            "industry_slug": "consumer-goods-retail-e-commerce",
            "excerpt": "Comparative analysis of channel integration, pricing strategy and conversion performance.",
            "content": "<h2>Executive Summary</h2><p>Retail operating models are shifting toward hybrid demand capture and rapid fulfillment.</p>",
            "table_of_contents": "<h2>Table of Contents</h2><h3>Channel Dynamics</h3><h3>Consumer Behavior</h3>",
            "banner_image": "https://img.freepik.com/free-vector/research-concept-illustration_114360-1338.jpg",
            "price": 2200.00,
            "is_active": 1,
            "created_at": now,
            "updated_at": now,
        },
        {
            "title": "Healthcare Analytics and Digital Care Delivery Market Review",
            "slug": "healthcare-analytics-and-digital-care-delivery-market-review",
            "industry_slug": "healthcare-life-sciences",
            "excerpt": "Insights on provider adoption, regulatory factors and investment momentum across digital care segments.",
            "content": "<h2>Executive Summary</h2><p>Digital health integration is expanding with outcome-linked care models.</p>",
            "table_of_contents": "<h2>Table of Contents</h2><h3>Regulatory Trends</h3><h3>Adoption Scenarios</h3>",
            "banner_image": "https://img.freepik.com/free-vector/research-concept-illustration_114360-1338.jpg",
            "price": 2600.00,
            "is_active": 1,
            "created_at": now,
            "updated_at": now,
        },
        {
            "title": "Defense Systems Modernization and Aerospace Procurement Outlook",
            "slug": "defense-systems-modernization-and-aerospace-procurement-outlook",
            "industry_slug": "defense-aerospace",
            "excerpt": "Multi-year view on procurement priorities, capability transitions and supplier opportunity mapping.",
            "content": "<h2>Executive Summary</h2><p>Defense modernization programs are reshaping demand visibility across major platforms.</p>",
            "table_of_contents": "<h2>Table of Contents</h2><h3>Budgetary Outlook</h3><h3>Program Pipeline</h3>",
            "banner_image": "https://img.freepik.com/free-vector/research-concept-illustration_114360-1338.jpg",
            "price": 3100.00,
            "is_active": 1,
            "created_at": now,
            "updated_at": now,
        },
    ]

    blog_payloads = [
        {
            "category_slug": "corporate-developments",
            "title": "Corporate Development: Expansion of Grid Modernization Projects Across Europe",
            "slug": "corporate-development-grid-modernization-europe",
            "short_description": "Corporate development update covering expansion plans and strategic capacity buildouts.",
            "content": "<p>Corporate development activity has accelerated across energy infrastructure portfolios in Europe, with stronger procurement visibility and upgraded deployment timelines.</p>",
            "featured_image": "https://img.freepik.com/free-vector/press-release-concept-illustration_114360-1114.jpg",
            "tags": "corporate,development,energy",
            "author_name": "Neargoal Research Desk",
        },
        {
            "category_slug": "press-releases",
            "title": "Press Release: Neargoal Launches AI Semiconductor Demand Tracker",
            "slug": "press-release-neargoal-ai-semiconductor-demand-tracker",
            "short_description": "Neargoal launches a periodic intelligence product focused on AI accelerator and semiconductor demand signals.",
            "content": "<p>Neargoal Consulting announced the launch of a subscription-based tracker focused on AI hardware demand trends, supply-chain movements, and strategic signal interpretation.</p>",
            "featured_image": "https://img.freepik.com/free-vector/press-release-concept-illustration_114360-1114.jpg",
            "tags": "press release,semiconductor,ai",
            "author_name": "Neargoal Communications",
        },
        {
            "category_slug": "insights",
            "title": "Insight: Scenario Analysis for EV Charging Demand Variability",
            "slug": "insight-scenario-analysis-ev-charging-demand",
            "short_description": "Analyst perspective on uncertainty modeling for charging network scale-up decisions.",
            "content": "<p>Decision support models indicate material differences by urban adoption curve and tariff structures. Sensitivity assumptions around utilization and energy cost remain key to capital planning.</p>",
            "featured_image": "https://img.freepik.com/free-vector/press-release-concept-illustration_114360-1114.jpg",
            "tags": "insight,ev,mobility,scenario analysis",
            "author_name": "Neargoal Insights",
        },
        {
            "category_slug": "insights",
            "title": "Insight: Competitive Positioning in Digital Health Platforms",
            "slug": "insight-competitive-positioning-digital-health-platforms",
            "short_description": "How reimbursement, product differentiation, and care integration are shaping digital health market share.",
            "content": "<p>Competitive intensity in digital health continues to increase as platforms consolidate adjacent workflow capabilities and strengthen provider integration models.</p>",
            "featured_image": "https://img.freepik.com/free-vector/data-analysis-concept-illustration_114360-8073.jpg",
            "tags": "insight,healthcare,competition",
            "author_name": "Neargoal Healthcare Desk",
        },
        {
            "category_slug": "case-studies",
            "title": "Case Study: Market Entry Intelligence for Specialty Chemicals",
            "slug": "case-study-market-entry-specialty-chemicals",
            "short_description": "A specialty chemicals client used market-entry intelligence to refine product-market sequencing and pricing strategy.",
            "content": "<p>The engagement combined demand modeling, competitive benchmarking, and channel intelligence to prioritize product launch timing and regional expansion focus.</p>",
            "featured_image": "https://img.freepik.com/free-vector/data-analysis-concept-illustration_114360-8073.jpg",
            "tags": "case study,chemicals,market entry",
            "author_name": "Neargoal Advisory",
        },
        {
            "category_slug": "case-studies",
            "title": "Case Study: Defense Supplier Opportunity Mapping",
            "slug": "case-study-defense-supplier-opportunity-mapping",
            "short_description": "Structured opportunity mapping enabled a supplier to align capability roadmap with procurement priorities.",
            "content": "<p>By mapping upcoming programs and technology transitions, the client improved bid prioritization and long-term partnership positioning.</p>",
            "featured_image": "https://img.freepik.com/free-vector/case-study-concept-illustration_114360-5316.jpg",
            "tags": "case study,defense,opportunity mapping",
            "author_name": "Neargoal Aerospace Desk",
        },
        {
            "category_slug": "news",
            "title": "Market Update: Capital Allocation Trends in Renewable Infrastructure",
            "slug": "market-update-capital-allocation-renewable-infrastructure",
            "short_description": "Institutional allocation patterns indicate sustained long-horizon demand for renewable infrastructure assets.",
            "content": "<p>Recent investment flow data suggests stronger confidence in utility-scale projects, with financing focus shifting toward operational resilience and grid integration.</p>",
            "featured_image": "https://img.freepik.com/free-vector/press-release-concept-illustration_114360-1114.jpg",
            "tags": "news,energy,investment",
            "author_name": "Neargoal Market Updates",
        },
        {
            "category_slug": "news",
            "title": "Market Update: Automotive EV Supply Chain Restructuring",
            "slug": "market-update-automotive-ev-supply-chain-restructuring",
            "short_description": "EV platform manufacturers are increasing regional localization to improve resilience and cost control.",
            "content": "<p>Battery sourcing diversification and modular platform design are becoming central to medium-term competitiveness across major vehicle programs.</p>",
            "featured_image": "https://img.freepik.com/free-vector/data-analysis-concept-illustration_114360-8073.jpg",
            "tags": "news,automotive,ev,supply chain",
            "author_name": "Neargoal Mobility Desk",
        },
    ]

    policies = [
        {
            "policy_type": "privacy",
            "title": "Privacy Policy",
            "content": "<p>Data collection and usage, cookies policy, user data protection and privacy contact details will be maintained here.</p>",
            "created_at": now,
            "updated_at": now,
        },
        {
            "policy_type": "terms_of_service",
            "title": "Terms and Conditions",
            "content": "<p>Website usage terms, intellectual property rights, disclaimer and limitation of liability will be maintained here.</p>",
            "created_at": now,
            "updated_at": now,
        },
        {
            "policy_type": "return_policy",
            "title": "Return Policy",
            "content": "<p>Return and cancellation policy will be shared and maintained here.</p>",
            "created_at": now,
            "updated_at": now,
        },
    ]

    jobs = [
        {
            "title": "Research Analyst - Market Intelligence",
            "location": "Remote",
            "employment_type": "Full time",
            "description": "Support analyst-led research projects, report development and market tracking programs.",
            "requirements": "Strong secondary research capability, structured writing and analytical reasoning.",
            "status": "open",
            "posted_at": now,
            "updated_at": now,
        },
        {
            "title": "Senior Consultant - Competitive Intelligence",
            "location": "Hybrid",
            "employment_type": "Full time",
            "description": "Lead strategic intelligence workstreams, synthesize market signals, and support executive decision forums.",
            "requirements": "5+ years in strategy/consulting, strong analytical storytelling, client-facing delivery experience.",
            "status": "open",
            "posted_at": now,
            "updated_at": now,
        },
        {
            "title": "Research Associate - Healthcare & Life Sciences",
            "location": "Remote",
            "employment_type": "Full time",
            "description": "Support healthcare and life sciences research, including demand modeling and competitor tracking.",
            "requirements": "Excellent research hygiene, familiarity with healthcare ecosystem, strong presentation skills.",
            "status": "open",
            "posted_at": now,
            "updated_at": now,
        },
    ]

    services = [
        {
            "service_name": "Custom Market Research",
            "slug": "custom-market-research",
            "short_description": "Tailored research frameworks aligned to specific business decisions.",
            "description": "<p>Custom market research built around strategic objectives, opportunity sizing, and competitive context.</p>",
            "icon": "tji-optimization",
            "display_order": 1,
            "is_active": 1,
            "is_featured": 1,
            "banner_image": "https://img.freepik.com/free-vector/team-creatives-isometric-illustration_33099-926.jpg",
            "service_group": "Consulting & Advisory Services",
            "industry_subcategories": "All Industries",
            "created_at": now,
            "updated_at": now,
        },
        {
            "service_name": "Competitive & Strategic Intelligence",
            "slug": "competitive-strategic-intelligence",
            "short_description": "Structured evaluation of competitors, strategy signals, and market movement.",
            "description": "<p>Deep intelligence support for strategy teams evaluating market entry, response options, and long-term positioning.</p>",
            "icon": "tji-pie-chart",
            "display_order": 2,
            "is_active": 1,
            "is_featured": 1,
            "banner_image": "https://img.freepik.com/free-vector/team-creatives-isometric-illustration_33099-926.jpg",
            "service_group": "Consulting & Advisory Services",
            "industry_subcategories": "All Industries",
            "created_at": now,
            "updated_at": now,
        },
        {
            "service_name": "Decision Support & Scenario Analysis",
            "slug": "decision-support-scenario-analysis",
            "short_description": "Scenario-led models to improve resilience under uncertainty.",
            "description": "<p>Scenario and sensitivity frameworks for investment, policy, and demand uncertainty assessments.</p>",
            "icon": "tji-analytics",
            "display_order": 3,
            "is_active": 1,
            "is_featured": 1,
            "banner_image": "https://img.freepik.com/free-vector/team-creatives-isometric-illustration_33099-926.jpg",
            "service_group": "Consulting & Advisory Services",
            "industry_subcategories": "All Industries",
            "created_at": now,
            "updated_at": now,
        },
    ]

    team_members = [
        {
            "name": "Aarav Mehta",
            "slug": "aarav-mehta",
            "designation": "Director, Market Intelligence",
            "department": "Research",
            "profile_image": "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg",
            "bio": "Leads cross-sector market intelligence programs for strategic and investment teams.",
            "email": "aarav@neargoal.com",
            "linkedin_url": "https://www.linkedin.com/",
            "display_order": 1,
            "is_active": 1,
            "created_at": now,
            "updated_at": now,
        },
        {
            "name": "Ishita Rao",
            "slug": "ishita-rao",
            "designation": "Principal Consultant",
            "department": "Advisory",
            "profile_image": "https://img.freepik.com/free-vector/businesswoman-character-avatar-isolated_24877-60112.jpg",
            "bio": "Supports clients on competitive intelligence and scenario-based decision frameworks.",
            "email": "ishita@neargoal.com",
            "linkedin_url": "https://www.linkedin.com/",
            "display_order": 2,
            "is_active": 1,
            "created_at": now,
            "updated_at": now,
        },
        {
            "name": "Rohan Kapoor",
            "slug": "rohan-kapoor",
            "designation": "Senior Research Lead",
            "department": "Industry Coverage",
            "profile_image": "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg",
            "bio": "Focuses on digital technology, semiconductor, and mobility intelligence mandates.",
            "email": "rohan@neargoal.com",
            "linkedin_url": "https://www.linkedin.com/",
            "display_order": 3,
            "is_active": 1,
            "created_at": now,
            "updated_at": now,
        },
        {
            "name": "Naina Sharma",
            "slug": "naina-sharma",
            "designation": "Client Partner",
            "department": "Client Success",
            "profile_image": "https://img.freepik.com/free-vector/businesswoman-character-avatar-isolated_24877-60112.jpg",
            "bio": "Works with strategic clients to define intelligence scope and engagement outcomes.",
            "email": "naina@neargoal.com",
            "linkedin_url": "https://www.linkedin.com/",
            "display_order": 4,
            "is_active": 1,
            "created_at": now,
            "updated_at": now,
        },
    ]

    faqs = [
        {
            "question": "How do I request a report sample?",
            "answer": "Use the Request Sample button on report pages or submit your requirement through Contact Us.",
            "display_order": 1,
            "is_active": 1,
            "created_at": now,
            "updated_at": now,
        },
        {
            "question": "Can Neargoal customize research for our market?",
            "answer": "Yes. Our Custom Market Research service is designed for specific business questions and strategic contexts.",
            "display_order": 2,
            "is_active": 1,
            "created_at": now,
            "updated_at": now,
        },
        {
            "question": "Do you provide ongoing intelligence subscriptions?",
            "answer": "Yes. We offer Industry Tracking & Intelligence Subscriptions for continuous monitoring.",
            "display_order": 3,
            "is_active": 1,
            "created_at": now,
            "updated_at": now,
        },
        {
            "question": "How quickly can a custom engagement begin?",
            "answer": "Typical kickoff is within 3-5 business days after scope and objectives are finalized.",
            "display_order": 4,
            "is_active": 1,
            "created_at": now,
            "updated_at": now,
        },
    ]

    testimonials = [
        {
            "client_name": "Strategy Lead, Energy Infrastructure Company",
            "feedback": "Neargoal's intelligence helped us validate long-term demand assumptions before major capital deployment.",
            "created_at": now,
            "updated_at": now,
        },
        {
            "client_name": "Vice President, Private Equity Firm",
            "feedback": "The due diligence work was structured, practical, and directly useful for investment committee decisions.",
            "created_at": now,
            "updated_at": now,
        },
        {
            "client_name": "Head of Corporate Planning, Automotive OEM",
            "feedback": "Their scenario analysis sharpened our EV supply strategy and reduced planning uncertainty.",
            "created_at": now,
            "updated_at": now,
        },
    ]

    landing_pages = [
        {
            "title": "Home Hero - Strategic Intelligence",
            "slug": "home-main",
            "hero_title": "Research That Brings You Closer to Your Business Goals",
            "hero_subtitle": "analyst-driven market intelligence",
            "content": "Neargoal Consulting delivers deep, analyst-driven market research and strategic intelligence across high-impact global industries.",
            "cta_text": "Request Sample",
            "cta_url": "/contact-us",
            "banner_svg": "assets/images/slider/slider-1.webp",
            "seo_title": "Neargoal Home",
            "seo_description": "Market intelligence and advisory research",
            "seo_keywords": "market intelligence, strategic research",
            "show_in_menu": 0,
            "is_active": 1,
            "created_at": now,
            "updated_at": now,
        }
    ]

    with engine.begin() as conn:
        _upsert_rows(conn, "industry_segments", industry_segments)
        _upsert_rows(conn, "advisory_segments", advisory_segments)
        _upsert_rows(conn, "service_families", service_families)
        _upsert_rows(conn, "services", services)
        _upsert_rows(conn, "team_members", team_members)
        _upsert_rows(conn, "landing_pages", landing_pages)
        _upsert_rows(conn, "blog_categories", blog_categories, update_columns=["name", "is_active"])
        _upsert_rows(conn, "reports", reports)

        category_rows = conn.execute(text("SELECT id, slug FROM blog_categories")).fetchall()
        category_map = {row.slug: row.id for row in category_rows}
        blogs = []
        for payload in blog_payloads:
            category_id = category_map.get(payload["category_slug"])
            if not category_id:
                continue
            blogs.append({
                "category_id": category_id,
                "title": payload["title"],
                "slug": payload["slug"],
                "short_description": payload["short_description"],
                "content": payload["content"],
                "featured_image": payload["featured_image"],
                "tags": payload["tags"],
                "author_name": payload["author_name"],
                "status": "published",
                "published_at": now,
                "created_at": now,
                "updated_at": now,
            })

        _upsert_rows(
            conn,
            "blogs",
            blogs,
            update_columns=[
                "category_id",
                "title",
                "short_description",
                "content",
                "featured_image",
                "tags",
                "author_name",
                "status",
                "published_at",
                "updated_at",
            ],
        )

        # policies table has no unique key on policy_type, so keep only one latest row per type.
        for row in policies:
            existing = conn.execute(
                text("SELECT id FROM policies WHERE policy_type=:policy_type ORDER BY id ASC LIMIT 1"),
                {"policy_type": row["policy_type"]},
            ).fetchone()
            if existing:
                conn.execute(
                    text(
                        """
                        UPDATE policies
                        SET title=:title, content=:content, updated_at=:updated_at
                        WHERE id=:id
                        """
                    ),
                    {
                        "id": existing.id,
                        "title": row["title"],
                        "content": row["content"],
                        "updated_at": now,
                    },
                )
            else:
                conn.execute(
                    text(
                        """
                        INSERT INTO policies (policy_type, title, content, created_at, updated_at)
                        VALUES (:policy_type, :title, :content, :created_at, :updated_at)
                        """
                    ),
                    row,
                )

        faq_count = conn.execute(text("SELECT COUNT(*) AS cnt FROM faqs")).scalar() or 0
        if faq_count == 0:
            for row in faqs:
                conn.execute(
                    text(
                        """
                        INSERT INTO faqs (question, answer, display_order, is_active, created_at, updated_at)
                        VALUES (:question, :answer, :display_order, :is_active, :created_at, :updated_at)
                        """
                    ),
                    row,
                )

        testimonial_count = conn.execute(text("SELECT COUNT(*) AS cnt FROM testimonials")).scalar() or 0
        if testimonial_count == 0:
            for row in testimonials:
                conn.execute(
                    text(
                        """
                        INSERT INTO testimonials (client_name, feedback, created_at, updated_at)
                        VALUES (:client_name, :feedback, :created_at, :updated_at)
                        """
                    ),
                    row,
                )

        for row in jobs:
            exists = conn.execute(
                text("SELECT id FROM jobs WHERE title=:title LIMIT 1"),
                {"title": row["title"]},
            ).fetchone()
            if not exists:
                conn.execute(
                    text(
                        """
                        INSERT INTO jobs (title, location, employment_type, description, requirements, status, posted_at, updated_at)
                        VALUES (:title, :location, :employment_type, :description, :requirements, :status, :posted_at, :updated_at)
                        """
                    ),
                    row,
                )
