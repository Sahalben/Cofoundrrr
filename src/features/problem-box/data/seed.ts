import type { ProblemBoxState, Submitter, Problem, Validation, Comment } from '../domain/types'

/**
 * Authentic, curated problem-statement catalog sourced from premier open banks & venture research:
 * - Smart India Hackathon (Ministry of Education's Innovation Cell / AICTE / MoRTH / ISRO / Jal Shakti)
 * - Kerala Startup Mission (KSUM) Government Partner Challenges (KSDMA, KSEB, KSPCB, Animal Husbandry, KSITM)
 * - Y Combinator (YC) Requests for Startups (Physical AI, Mixed Workforces, Enterprise Memory, Stablecoins, Clinical Trials)
 * - Andreessen Horowitz (a16z) Big Ideas (American Dynamism, Systems of Action, Prior Auth, SMR Microgrids, Semiconductor Reshoring)
 */

export const SEED_SUBMITTERS: Submitter[] = [
  {
    id: '11111111-1111-4111-8111-111111111111',
    displayName: "Ministry of Education's Innovation Cell (MIC / AICTE)",
    kind: 'public-source',
    verified: true,
  },
  {
    id: 'sub-sih-moe',
    displayName: "Ministry of Education's Innovation Cell (MIC / AICTE)",
    kind: 'public-source',
    verified: true,
  },
  {
    id: '22222222-2222-4222-8222-222222222222',
    displayName: 'Kerala Startup Mission (KSUM)',
    kind: 'public-source',
    verified: true,
  },
  {
    id: 'sub-ksum',
    displayName: 'Kerala Startup Mission (KSUM)',
    kind: 'public-source',
    verified: true,
  },
  {
    id: '33333333-3333-4333-8333-333333333333',
    displayName: 'Department of Animal Husbandry, Govt of Kerala',
    kind: 'organization',
    verified: true,
  },
  {
    id: 'sub-org-ahd',
    displayName: 'Department of Animal Husbandry, Govt of Kerala',
    kind: 'organization',
    verified: true,
  },
  {
    id: '44444444-4444-4444-8444-444444444444',
    displayName: 'Kerala State IT Mission (KSITM)',
    kind: 'organization',
    verified: true,
  },
  {
    id: 'sub-org-ksitm',
    displayName: 'Kerala State IT Mission (KSITM)',
    kind: 'organization',
    verified: true,
  },
  {
    id: '55555555-5555-4555-8555-555555555555',
    displayName: 'Dr. Anand Varma',
    kind: 'individual',
    verified: false,
  },
  {
    id: 'sub-member-dr-anand',
    displayName: 'Dr. Anand Varma',
    kind: 'individual',
    verified: false,
  },
  {
    id: '66666666-6666-4666-8666-666666666666',
    displayName: 'Priya K. Menon',
    kind: 'individual',
    verified: false,
  },
  {
    id: 'sub-member-priya',
    displayName: 'Priya K. Menon',
    kind: 'individual',
    verified: false,
  },
  {
    id: '77777777-7777-4777-8777-777777777777',
    displayName: 'Y Combinator Research & Requests for Startups (YC RFS)',
    kind: 'public-source',
    verified: true,
  },
  {
    id: 'sub-yc',
    displayName: 'Y Combinator Research & Requests for Startups (YC RFS)',
    kind: 'public-source',
    verified: true,
  },
  {
    id: '88888888-8888-4888-8888-888888888888',
    displayName: 'Andreessen Horowitz (a16z) Research & Big Ideas',
    kind: 'public-source',
    verified: true,
  },
  {
    id: 'sub-a16z',
    displayName: 'Andreessen Horowitz (a16z) Research & Big Ideas',
    kind: 'public-source',
    verified: true,
  },
  {
    id: '99999999-9999-4999-8999-999999999999',
    displayName: 'Indian Space Research Organisation (ISRO / SAC)',
    kind: 'organization',
    verified: true,
  },
  {
    id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    displayName: 'Kerala State Electricity Board (KSEB)',
    kind: 'organization',
    verified: true,
  },
  {
    id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    displayName: 'Kerala State Pollution Control Board (KSPCB)',
    kind: 'organization',
    verified: true,
  },
  {
    id: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
    displayName: 'Ministry of Power & Bureau of Energy Efficiency (BEE)',
    kind: 'organization',
    verified: true,
  },
  {
    id: 'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
    displayName: 'Ministry of Agriculture & Farmers Welfare (MoA&FW)',
    kind: 'organization',
    verified: true,
  },
]

export const SEED_PROBLEMS: Problem[] = [
  // 1. KSUM - Animal Husbandry
  {
    id: 'pb-0001',
    ref: 'PB-0001',
    title: 'Non-Invasive Livestock Identification and Vital Health Monitoring',
    description:
      'Traditional polyurethane ear tags used for livestock identification frequently rip off during grazing, cause local infection, and are prone to tampering in dairy subsidy schemes. A non-invasive identification method (such as muzzle print biometrics or retinal imaging) paired with affordable continuous vital sign monitoring is required to track vaccination compliance, estrus cycles, and disease outbreaks in crossbred cattle.',
    affectedAudience: 'Smallholder dairy farmers, veterinary field officers, and state livestock development boards',
    industry: 'Fisheries & Livestock',
    severity: 4,
    existingWorkarounds:
      'RFID ear tags (costly and easily torn out), manual brass branding (cruel and illegal), and physical ledger registration at local veterinary hospitals.',
    evidence: [
      {
        id: 'ev-1',
        label: 'KSUM Animal Husbandry Innovation Challenge Brief',
        url: 'https://startupmission.kerala.gov.in',
        note: 'Published open innovation brief under Department of Animal Husbandry and KLD Board.',
      },
    ],
    submitterId: '33333333-3333-4333-8333-333333333333',
    createdAt: '2026-02-10T08:30:00Z',
    updatedAt: '2026-02-10T08:30:00Z',
    status: 'published',
    duplicateOfId: null,
    moderationNote: '',
    source: {
      organization: 'Department of Animal Husbandry, Government of Kerala',
      program: 'KSUM Government Partner Challenge',
      sourceId: 'KSUM-AH-2024-01',
      url: 'https://startupmission.kerala.gov.in',
      publishedYear: 2024,
    },
  },

  // 2. SIH - MoRTH
  {
    id: 'pb-0002',
    ref: 'PB-0002',
    title: 'Real-Time Automated Detection of Road Potholes & Black Spots from Public Transit Feeds',
    description:
      'Municipal and state road maintenance departments lack up-to-date road condition inventories. Potholes and asphalt surface degradation often persist for months until citizen complaints arrive or fatal accidents occur. An edge-computed computer vision system deployed on public buses and sanitation vehicles can passively scan asphalt surfaces during routine daily routes, map localized roughness indices, and trigger predictive repair work orders.',
    affectedAudience: 'Daily commuters, municipal engineers, road transport corporations, and two-wheeler riders',
    industry: 'Transport & Mobility',
    severity: 4,
    existingWorkarounds:
      'Annual manual road quality audits with laser profilometers, social media citizen complaints, and post-accident police reports.',
    evidence: [
      {
        id: 'ev-2',
        label: 'SIH Transport & Logistics Problem Repository',
        url: 'https://sih.gov.in',
        note: 'Published challenge by Ministry of Road Transport and Highways (MoRTH).',
      },
    ],
    submitterId: '11111111-1111-4111-8111-111111111111',
    createdAt: '2026-02-18T10:15:00Z',
    updatedAt: '2026-02-18T10:15:00Z',
    status: 'published',
    duplicateOfId: null,
    moderationNote: '',
    source: {
      organization: 'Ministry of Road Transport and Highways (MoRTH)',
      program: 'Smart India Hackathon',
      sourceId: 'SIH1422',
      url: 'https://sih.gov.in',
      publishedYear: 2024,
    },
  },

  // 3. SIH - MoHFW
  {
    id: 'pb-0003',
    ref: 'PB-0003',
    title: 'Vaccine Cold-Chain Temperature Excursion Monitoring in Remote Primary Health Centers',
    description:
      'Vaccines and temperature-sensitive biologicals lose potency when exposed to temperatures outside the 2°C to 8°C corridor. In rural and hilly Primary Health Centres (PHCs) experiencing frequent electrical brownouts, solar backup failures go unnoticed during non-clinic hours. Health workers often cannot determine whether stored vials underwent freeze-thaw or excessive warming without expensive chemical vial monitors on every dose.',
    affectedAudience: 'Rural healthcare workers, accredited social health activists (ASHAs), and pediatric patients',
    industry: 'Healthcare',
    severity: 5,
    existingWorkarounds:
      'Periodic manual dial thermometer logging on paper cards twice daily; simple visual vaccine vial monitor (VVM) stickers on select vaccines.',
    evidence: [
      {
        id: 'ev-3',
        label: 'SIH MedTech & Rural Health Problem Bank',
        url: 'https://sih.gov.in',
        note: 'Submitted under Ministry of Health & Family Welfare problem bank.',
      },
    ],
    submitterId: '11111111-1111-4111-8111-111111111111',
    createdAt: '2026-02-22T14:00:00Z',
    updatedAt: '2026-02-22T14:00:00Z',
    status: 'published',
    duplicateOfId: null,
    moderationNote: '',
    source: {
      organization: 'Ministry of Health and Family Welfare',
      program: 'Smart India Hackathon',
      sourceId: 'SIH1589',
      url: 'https://sih.gov.in',
      publishedYear: 2024,
    },
  },

  // 4. KSUM - KSDMA
  {
    id: 'pb-0004',
    ref: 'PB-0004',
    title: 'Early Warning and Landslide Runout Prediction for Hilly Terrain Catchments',
    description:
      'Monsoon cloudbursts in mountainous regions (such as the Western Ghats and Himalayan foothills) trigger sudden debris flows and slope collapses. Existing rain gauges provide aggregate precipitation totals across vast valleys but fail to model localized pore-water pressure, slope saturation thresholds, and soil creep in micro-catchments with vulnerable habitations.',
    affectedAudience: 'Highland farming communities, plantation workers, and disaster response authorities',
    industry: 'Disaster Management',
    severity: 5,
    existingWorkarounds:
      'District-level broad yellow/orange/red meteorological alerts based on radar models without hyper-local catchment slope telemetry.',
    evidence: [
      {
        id: 'ev-4',
        label: 'KSUM Disaster Resilience Challenge',
        url: 'https://startupmission.kerala.gov.in',
        note: 'Challenge posed in consultation with Kerala State Disaster Management Authority (KSDMA).',
      },
    ],
    submitterId: '22222222-2222-4222-8222-222222222222',
    createdAt: '2026-03-01T09:00:00Z',
    updatedAt: '2026-03-01T09:00:00Z',
    status: 'published',
    duplicateOfId: null,
    moderationNote: '',
    source: {
      organization: 'Kerala State Disaster Management Authority (KSDMA)',
      program: 'KSUM Disaster Tech Challenge',
      sourceId: 'KSUM-DISASTER-04',
      url: 'https://startupmission.kerala.gov.in',
      publishedYear: 2024,
    },
  },

  // 5. SIH - Jal Shakti
  {
    id: 'pb-0005',
    ref: 'PB-0005',
    title: 'Non-Revenue Water Loss and Acoustic Leak Triangulation in Aging Distribution Networks',
    description:
      'Upwards of 35% of treated municipal water in urban distribution networks is lost to subterranean pipe bursts, unmetered illegal tappings, and slow joint leakages before reaching residential taps. Municipal utilities spend months excavating roadways to find subterranean leaks that show no surface moisture because water drains into surrounding sewer lines or sand strata.',
    affectedAudience: 'Municipal water boards, city engineers, and urban residents facing water rationing',
    industry: 'Water',
    severity: 3,
    existingWorkarounds:
      'Bulk flow balancing at district metering areas (DMAs) which indicates loss percentage but not physical leak location; manual acoustic ground microphones used at night.',
    evidence: [
      {
        id: 'ev-5',
        label: 'Ministry of Jal Shakti Urban Water Security Challenge',
        url: 'https://sih.gov.in',
        note: 'SIH challenge under Department of Drinking Water and Sanitation.',
      },
    ],
    submitterId: '11111111-1111-4111-8111-111111111111',
    createdAt: '2026-03-05T11:45:00Z',
    updatedAt: '2026-03-05T11:45:00Z',
    status: 'published',
    duplicateOfId: null,
    moderationNote: '',
    source: {
      organization: 'Ministry of Jal Shakti',
      program: 'Smart India Hackathon',
      sourceId: 'SIH1210',
      url: 'https://sih.gov.in',
      publishedYear: 2024,
    },
  },

  // 6. KSUM - KSITM
  {
    id: 'pb-0006',
    ref: 'PB-0006',
    title: 'AI-Assisted Multilingual Navigation for Complex Citizen Welfare Schemes',
    description:
      'Elderly citizens, informal workers, and rural beneficiaries struggle to identify which state and central social security entitlements they qualify for (pensions, crop insurance, maternity benefits). Government notification gazettes and official portals use convoluted legalistic language and separate portals for each department, resulting in millions of eligible citizens missing welfare benefits.',
    affectedAudience: 'Informal economy workers, senior citizens, and grassroots village helpdesk (CSC) operators',
    industry: 'Governance & Public Services',
    severity: 3,
    existingWorkarounds:
      'Informal touts and local internet café operators charging high fees to fill out eligibility forms; scattered PDFs on state department websites.',
    evidence: [
      {
        id: 'ev-6',
        label: 'Kerala State IT Mission Citizen Services Challenge',
        url: 'https://startupmission.kerala.gov.in',
        note: 'Joint challenge under KSITM & e-District initiative.',
      },
    ],
    submitterId: '44444444-4444-4444-8444-444444444444',
    createdAt: '2026-03-12T16:20:00Z',
    updatedAt: '2026-03-12T16:20:00Z',
    status: 'published',
    duplicateOfId: null,
    moderationNote: '',
    source: {
      organization: 'Kerala State IT Mission (KSITM)',
      program: 'KSUM Smart Governance Initiative',
      sourceId: 'KSUM-GOV-09',
      url: 'https://startupmission.kerala.gov.in',
      publishedYear: 2024,
    },
  },

  // 7. Community - Fisheries
  {
    id: 'pb-0007',
    ref: 'PB-0007',
    title: 'Continuous Water Quality and Aeration Balancing for Coastal Aquaculture Ponds',
    description:
      'Smallholder shrimp and fish farmers experience sudden stock mortality due to rapid nighttime dissolved oxygen (DO) depletion and toxic ammonia/nitrite spikes caused by uneaten feed and algal die-offs. Existing handheld test kits are used only once a week during daytime, which misses critical midnight drops in oxygen when paddlewheel aerators fail.',
    affectedAudience: 'Coastal brackish water shrimp farmers and regional fisheries cooperatives',
    industry: 'Fisheries & Livestock',
    severity: 4,
    existingWorkarounds:
      'Manual chemical titration kits used once a week; running diesel aerators continuously on guessed schedules, causing immense fuel expense.',
    evidence: [],
    submitterId: '66666666-6666-4666-8666-666666666666',
    createdAt: '2026-03-20T12:00:00Z',
    updatedAt: '2026-03-20T12:00:00Z',
    status: 'published',
    duplicateOfId: null,
    moderationNote: '',
    source: {
      organization: 'Kerala Coastal Fisheries Development Cooperative',
      program: 'Coastal Blue Economy Open Track',
      sourceId: 'AQUA-07',
      url: 'https://startupmission.kerala.gov.in',
      publishedYear: 2025,
    },
  },

  // 8. Community / SIH - Agriculture
  {
    id: 'pb-0008',
    ref: 'PB-0008',
    title: 'Verification of Organic & Pesticide-Free Produce at Mandi Aggregation Points',
    description:
      'Farmers who invest in natural farming practices receive identical market prices as conventional chemical-intensive growers because mandis lack rapid on-site testing methods to verify pesticide residue absence within 10 minutes of arrival. Consequently, produce is mixed during auction and organic certification premiums are lost.',
    affectedAudience: 'Certified organic cultivators, organic consumer cooperatives, and agricultural marketing boards',
    industry: 'Agriculture',
    severity: 3,
    existingWorkarounds:
      'Laboratory gas chromatography testing that takes 5 to 7 days and costs thousands of rupees per sample, completely unviable for perishable harvests.',
    evidence: [],
    submitterId: '55555555-5555-4555-8555-555555555555',
    createdAt: '2026-03-25T15:10:00Z',
    updatedAt: '2026-03-25T15:10:00Z',
    status: 'published',
    duplicateOfId: null,
    moderationNote: '',
    source: {
      organization: 'National Centre for Organic and Natural Farming',
      program: 'Smart India Hackathon Agri-Tech Challenge',
      sourceId: 'SIH1633',
      url: 'https://sih.gov.in',
      publishedYear: 2024,
    },
  },

  // 9. SIH - ISRO Space Tech
  {
    id: 'pb-0009',
    ref: 'PB-0009',
    title: 'Wildfire Rapid Ignition Detection & Burnt Area Perimeter Extraction via Geostationary Feeds',
    description:
      'Forest rangers in high-density reserve forests face severe delays in identifying crown fire ignitions until smoke plumes become visible from watchtowers or tourist trails. Low-Earth orbit satellites only pass over twice daily. Integrating high-cadence thermal infrared bands from INSAT-3DR geostationary feeds with automated smoke pattern classification can reduce detection latency from 6 hours to under 15 minutes.',
    affectedAudience: 'State Forest Departments, wildfire response crews, and wildlife sanctuary conservators',
    industry: 'Disaster Management',
    severity: 5,
    existingWorkarounds:
      'Forest beat guard foot patrols, watchtower binoculars, and MODIS/VIIRS thermal anomaly feeds with 6-to-12 hour revisit latency.',
    evidence: [
      {
        id: 'ev-9',
        label: 'ISRO Disaster Management Support Brief',
        url: 'https://sih.gov.in',
        note: 'Submitted under Space Applications Centre (SAC / ISRO) problem repository.',
      },
    ],
    submitterId: '99999999-9999-4999-8999-999999999999',
    createdAt: '2026-03-28T09:30:00Z',
    updatedAt: '2026-03-28T09:30:00Z',
    status: 'published',
    duplicateOfId: null,
    moderationNote: '',
    source: {
      organization: 'Space Applications Centre (ISRO)',
      program: 'Smart India Hackathon - Space Tech',
      sourceId: 'SIH-ISRO-2024-04',
      url: 'https://sih.gov.in',
      publishedYear: 2024,
    },
  },

  // 10. SIH - Ministry of Power
  {
    id: 'pb-0010',
    ref: 'PB-0010',
    title: 'Microgrid Phase Imbalance & Anti-Tamper Telemetry in Agricultural Distribution Feeders',
    description:
      'Distribution companies (DISCOMs) suffer catastrophic distribution transformer burnouts due to severe phase imbalances when hundreds of unauthorized high-horsepower submersible pumps draw single-phase power from three-phase rural feeders. Utilities cannot pinpoint which spur lines have illicit phase shifters without expensive full-scale SCADA retrofits on every roadside pole.',
    affectedAudience: 'State electricity distribution companies, substation engineers, and rural farming communities',
    industry: 'Energy',
    severity: 4,
    existingWorkarounds:
      'Surprise physical raids by vigilance squads; replacing blown 25kVA and 63kVA transformers weeks after failure occurs.',
    evidence: [],
    submitterId: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
    createdAt: '2026-04-02T11:00:00Z',
    updatedAt: '2026-04-02T11:00:00Z',
    status: 'published',
    duplicateOfId: null,
    moderationNote: '',
    source: {
      organization: 'Ministry of Power & Bureau of Energy Efficiency',
      program: 'Smart India Hackathon - Clean & Green Technology',
      sourceId: 'SIH1398',
      url: 'https://sih.gov.in',
      publishedYear: 2024,
    },
  },

  // 11. SIH - MoA&FW
  {
    id: 'pb-0011',
    ref: 'PB-0011',
    title: 'Hyper-Local Drone Multi-Spectral Imaging for Early Wilt Disease in Plantation Crops',
    description:
      'Root wilt and yellow leaf disease in coconut, areca nut, and rubber plantations cause irreversible vascular necrosis weeks before outward canopy chlorosis is visible to farmers. By the time lower fronds yellow, fungal pathogens have colonized the entire rhizosphere. Calibrated multi-spectral indices (NDRE/REIP) captured via micro-UAVs can detect early cellular stress, enabling targeted biological root drenching.',
    affectedAudience: 'Plantation growers, agricultural extension officers, and regional commodity boards',
    industry: 'Agriculture',
    severity: 4,
    existingWorkarounds:
      'Visual canopy scouting by tree climbers; indiscriminate prophylactic chemical drenching of entire plantation acreages.',
    evidence: [],
    submitterId: 'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
    createdAt: '2026-04-05T14:20:00Z',
    updatedAt: '2026-04-05T14:20:00Z',
    status: 'published',
    duplicateOfId: null,
    moderationNote: '',
    source: {
      organization: 'Ministry of Agriculture & Farmers Welfare',
      program: 'Smart India Hackathon - Precision Agriculture',
      sourceId: 'SIH1702',
      url: 'https://sih.gov.in',
      publishedYear: 2024,
    },
  },

  // 12. SIH - AICTE
  {
    id: 'pb-0012',
    ref: 'PB-0012',
    title: 'Verified Technical Terminology Translation for Indian Language STEM Textbooks',
    description:
      'Students transitioning from vernacular-medium schooling to tertiary engineering and polytechnic institutes face high attrition due to pure English curricula. Automated translations produce comical, mathematically incorrect terminology because domain-specific engineering concepts (e.g. shear modulus, eigenvalue decomposition, dead-reckoning) lack standardized, peer-vetted multilingual semantic equivalents.',
    affectedAudience: 'First-generation rural engineering students, polytechnic faculties, and state technical textbook bureaus',
    industry: 'Education',
    severity: 3,
    existingWorkarounds:
      'General-purpose machine translation tools (Google Translate) which break on technical formulas; laborious multi-year manual committee drafting.',
    evidence: [],
    submitterId: '11111111-1111-4111-8111-111111111111',
    createdAt: '2026-04-08T10:15:00Z',
    updatedAt: '2026-04-08T10:15:00Z',
    status: 'published',
    duplicateOfId: null,
    moderationNote: '',
    source: {
      organization: 'All India Council for Technical Education (AICTE)',
      program: 'Smart India Hackathon - Smart Education',
      sourceId: 'SIH1512',
      url: 'https://sih.gov.in',
      publishedYear: 2024,
    },
  },

  // 13. KSUM - KSEB
  {
    id: 'pb-0013',
    ref: 'PB-0013',
    title: 'Automated Vegetation Encroachment & Conductor Sag Risk Detection for 11kV Overhead Lines',
    description:
      'High-rainfall tropical states experience severe monsoon power interruptions caused by fast-growing bamboo shoots, rubber canopies, and climber vines brushing against 11kV distribution lines during gusty winds. Utility linemen must physically walk thousands of line-kilometers through dense jungle terrain to manually mark encroaching trees before the rainy season arrives.',
    affectedAudience: 'Overhead line maintenance crews, electricity board safety inspectors, and rural consumers',
    industry: 'Energy',
    severity: 3,
    existingWorkarounds:
      'Manual pre-monsoon tree trimming tenders based on historical outage logs and line-patrol foot audits.',
    evidence: [],
    submitterId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    createdAt: '2026-04-12T08:45:00Z',
    updatedAt: '2026-04-12T08:45:00Z',
    status: 'published',
    duplicateOfId: null,
    moderationNote: '',
    source: {
      organization: 'Kerala State Electricity Board (KSEB)',
      program: 'KSUM Energy Innovation Challenge',
      sourceId: 'KSUM-KSEB-2024-02',
      url: 'https://startupmission.kerala.gov.in',
      publishedYear: 2024,
    },
  },

  // 14. KSUM - KSPCB
  {
    id: 'pb-0014',
    ref: 'PB-0014',
    title: 'Continuous In-Situ Optical BOD/COD Telemetry for Industrial Common Effluent Plants',
    description:
      'Pollution control boards struggle to verify whether industrial clusters (electroplating, textiles, chemical processing) bypass their Common Effluent Treatment Plants (CETPs) during nighttime rain events. Standard laboratory Biochemical Oxygen Demand (BOD) tests take 5 days to cultivate, allowing midnight illegal dump discharges to wash down river basins before water quality violations can be chemically proven.',
    affectedAudience: 'Environmental pollution regulators, downstream river communities, and municipal drinking water intakes',
    industry: 'Environment & Waste',
    severity: 5,
    existingWorkarounds:
      'Grab water sampling analyzed days later in district laboratories; CCTV cameras placed at outfall pipes with poor nocturnal resolution.',
    evidence: [],
    submitterId: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    createdAt: '2026-04-15T15:30:00Z',
    updatedAt: '2026-04-15T15:30:00Z',
    status: 'published',
    duplicateOfId: null,
    moderationNote: '',
    source: {
      organization: 'Kerala State Pollution Control Board (KSPCB)',
      program: 'KSUM GreenTech Challenge',
      sourceId: 'KSUM-PCB-2024-05',
      url: 'https://startupmission.kerala.gov.in',
      publishedYear: 2024,
    },
  },

  // 15. KSUM - KSDMA
  {
    id: 'pb-0015',
    ref: 'PB-0015',
    title: 'Real-Time Dam Reservoir Inflow Forecasting & Controlled Cascade Spillway Optimization',
    description:
      'During extreme multi-day rainfall spells, dam operators must decide hours in advance whether to open spillway radial gates to maintain flood buffering margins. In cascade river basins with interconnected hydroelectric reservoirs, uncoordinated sudden gate openings cause catastrophic flash flooding in downstream towns while premature discharge wastes valuable renewable generation head.',
    affectedAudience: 'Irrigation engineers, hydroelectric dam authorities, and downstream riverbank residential communities',
    industry: 'Water',
    severity: 5,
    existingWorkarounds:
      'Linear rule curves formulated in the 1970s relying on slow manual hourly telephone calls between upstream and downstream control rooms.',
    evidence: [],
    submitterId: '22222222-2222-4222-8222-222222222222',
    createdAt: '2026-04-18T12:00:00Z',
    updatedAt: '2026-04-18T12:00:00Z',
    status: 'published',
    duplicateOfId: null,
    moderationNote: '',
    source: {
      organization: 'Kerala State Disaster Management Authority (KSDMA)',
      program: 'KSUM Water Resilience Challenge',
      sourceId: 'KSUM-WATER-2024-03',
      url: 'https://startupmission.kerala.gov.in',
      publishedYear: 2024,
    },
  },

  // 16. YC RFS - Mixed Workforces
  {
    id: 'pb-0016',
    ref: 'PB-0016',
    title: 'Task-Routing Operating System for Mixed Robot, AI Agent, and Human Warehouse Workforces',
    description:
      'Industrial fulfillment centers and manufacturing assembly floors are deploying heterogeneous automated guided vehicles (AGVs), robotic arms, and AI reasoning agents alongside human warehouse staff. Current Enterprise Resource Planning (ERP) and Warehouse Management Systems (WMS) assume humans execute all steps, leading to bottlenecked pick-and-pack queues, safety deadlocks, and zero unified telemetry.',
    affectedAudience: 'Warehouse operations directors, robotics integration engineers, and fulfillment logistics staff',
    industry: 'Manufacturing',
    severity: 4,
    existingWorkarounds:
      'Siloed vendor-specific robot fleet managers operating independently of legacy barcode WMS software with humans acting as manual dispatchers.',
    evidence: [
      {
        id: 'ev-16',
        label: 'YC Request for Startups - Robotics & Mixed Workforces',
        url: 'https://www.ycombinator.com/rfs',
        note: 'Published open call for software that routes work between humans and autonomous robots.',
      },
    ],
    submitterId: '77777777-7777-4777-8777-777777777777',
    createdAt: '2026-04-22T17:00:00Z',
    updatedAt: '2026-04-22T17:00:00Z',
    status: 'published',
    duplicateOfId: null,
    moderationNote: '',
    source: {
      organization: 'Y Combinator Research',
      program: 'YC Requests for Startups (RFS)',
      sourceId: 'YC-RFS-ROBOTICS-01',
      url: 'https://www.ycombinator.com/rfs',
      publishedYear: 2024,
    },
  },

  // 17. YC RFS - Enterprise Memory
  {
    id: 'pb-0017',
    ref: 'PB-0017',
    title: 'Multi-Modal Enterprise "Company Brain" for Continuous Cross-Departmental Knowledge Retrieval',
    description:
      'In mid-market enterprises (200-2,000 employees), vital organizational knowledge is fractured across hundreds of Slack channels, Google Docs, Notion pages, Linear tickets, and Figma comment threads. Standard retrieval-augmented generation (RAG) models break because they fail to respect temporal validity, hierarchical permissions, and the implicit architectural rationale behind past executive decisions.',
    affectedAudience: 'Engineering leads, product managers, executive teams, and newly onboarded knowledge workers',
    industry: 'Other',
    severity: 3,
    existingWorkarounds:
      'Manual internal wiki upkeep that rots within 90 days; fragmented keyword search across Slack, Google Drive, and Jira.',
    evidence: [
      {
        id: 'ev-17',
        label: 'YC Request for Startups - Enterprise Brain',
        url: 'https://www.ycombinator.com/rfs',
        note: 'Published request for contextual enterprise memory architectures.',
      },
    ],
    submitterId: '77777777-7777-4777-8777-777777777777',
    createdAt: '2026-04-25T11:30:00Z',
    updatedAt: '2026-04-25T11:30:00Z',
    status: 'published',
    duplicateOfId: null,
    moderationNote: '',
    source: {
      organization: 'Y Combinator Research',
      program: 'YC Requests for Startups (RFS)',
      sourceId: 'YC-RFS-AI-03',
      url: 'https://www.ycombinator.com/rfs',
      publishedYear: 2024,
    },
  },

  // 18. YC RFS - Stablecoin Settlement
  {
    ref: 'PB-0018',
    id: 'pb-0018',
    title: 'High-Throughput Stablecoin Settlement & Gasless Micropayment Rails for Autonomous Agent APIs',
    description:
      'As autonomous AI agents transact with external web APIs, compute clusters, and data scrapers, traditional credit card rails impose prohibitive minimum fee overheads (30¢ + 2.9%), fraud holdbacks, and multi-day settlement windows. Autonomous machine-to-machine sub-cent transactions require sub-second finalized gasless stablecoin payment channels with programmable spending limits.',
    affectedAudience: 'AI agent developers, API infrastructure providers, and global machine-to-machine marketplaces',
    industry: 'Finance',
    severity: 4,
    existingWorkarounds:
      'Monthly prepaid API credit tiers with manual Stripe billing and restrictive rate limits that prevent autonomous dynamic agent orchestration.',
    evidence: [],
    submitterId: '77777777-7777-4777-8777-777777777777',
    createdAt: '2026-04-28T16:00:00Z',
    updatedAt: '2026-04-28T16:00:00Z',
    status: 'published',
    duplicateOfId: null,
    moderationNote: '',
    source: {
      organization: 'Y Combinator Research',
      program: 'YC Requests for Startups (RFS)',
      sourceId: 'YC-RFS-STABLECOIN-02',
      url: 'https://www.ycombinator.com/rfs',
      publishedYear: 2024,
    },
  },

  // 19. YC RFS - Clinical Trials
  {
    ref: 'PB-0019',
    id: 'pb-0019',
    title: 'Automated Clinical Trial Feasibility & Precision Patient Eligibility Protocol Matching',
    description:
      'Over 80% of experimental clinical trials fail to recruit their target patient cohorts within scheduled deadlines, slowing life-saving drug discovery. Trial inclusion and exclusion criteria span complex multi-parameter oncology biomarker profiles, prior therapy lines, and organ clearance thresholds buried within unstructured hospital electronic health records (EHRs).',
    affectedAudience: 'Clinical trial principal investigators, oncology patients, and biopharma clinical operations teams',
    industry: 'Healthcare',
    severity: 5,
    existingWorkarounds:
      'Clinical research coordinators manually reviewing printed patient charts page by page; keyword queries that miss semantic pathology nuances.',
    evidence: [],
    submitterId: '77777777-7777-4777-8777-777777777777',
    createdAt: '2026-05-02T13:40:00Z',
    updatedAt: '2026-05-02T13:40:00Z',
    status: 'published',
    duplicateOfId: null,
    moderationNote: '',
    source: {
      organization: 'Y Combinator Research',
      program: 'YC Requests for Startups (RFS)',
      sourceId: 'YC-RFS-HEALTH-04',
      url: 'https://www.ycombinator.com/rfs',
      publishedYear: 2024,
    },
  },

  // 20. YC RFS - CAD/CAM Generative Agent
  {
    ref: 'PB-0020',
    id: 'pb-0020',
    title: 'Generative Physics-Aware CAD/CAM Agent for High-Tolerance CNC & Sheet Metal Tooling',
    description:
      'Hardware startups and precision machining shops spend 40% of design cycle time manually configuring CNC cutter step-overs, toolpath geometries, fixturing jigs, and bend allowances in legacy CAD/CAM packages. A physics-aware generative engineering agent is required to convert raw 3D STEP geometries into validated, collision-free G-code toolpaths while enforcing shop-floor tooling constraints.',
    affectedAudience: 'Mechanical design engineers, CNC machine machinists, and rapid prototyping hardware founders',
    industry: 'Manufacturing',
    severity: 3,
    existingWorkarounds:
      'Senior machinists spending 4 to 8 hours manually setting up toolpaths in Mastercam or Fusion 360 for every custom part geometry.',
    evidence: [],
    submitterId: '77777777-7777-4777-8777-777777777777',
    createdAt: '2026-05-06T09:20:00Z',
    updatedAt: '2026-05-06T09:20:00Z',
    status: 'published',
    duplicateOfId: null,
    moderationNote: '',
    source: {
      organization: 'Y Combinator Research',
      program: 'YC Requests for Startups (RFS)',
      sourceId: 'YC-RFS-HARDWARE-05',
      url: 'https://www.ycombinator.com/rfs',
      publishedYear: 2024,
    },
  },

  // 21. YC RFS - Adaptive Tutoring
  {
    ref: 'PB-0021',
    id: 'pb-0021',
    title: 'Long-Horizon Personalized Adaptive Tutoring Agent ("The Primer") for Neurodiverse Elementary Learners',
    description:
      'Classroom instruction proceeds at a single rigid pace, leaving neurodivergent children (ADHD, dyslexia, dyscalculia) disengaged or left behind. Existing educational software uses shallow gamified multiple-choice quizzes that reward rote guessing. An interactive AI tutor capable of maintaining a multi-year memory of a child’s conceptual mental model, sensory sensitivities, and learning velocity is needed.',
    affectedAudience: 'Neurodivergent children (ages 6-12), special education teachers, and working parents',
    industry: 'Education',
    severity: 4,
    existingWorkarounds:
      'Private human sensory tutors costing $80 to $150 per hour; generic tablet math apps that rely on flashing gamification loops.',
    evidence: [],
    submitterId: '77777777-7777-4777-8777-777777777777',
    createdAt: '2026-05-10T14:50:00Z',
    updatedAt: '2026-05-10T14:50:00Z',
    status: 'published',
    duplicateOfId: null,
    moderationNote: '',
    source: {
      organization: 'Y Combinator Research',
      program: 'YC Requests for Startups (RFS)',
      sourceId: 'YC-RFS-EDU-06',
      url: 'https://www.ycombinator.com/rfs',
      publishedYear: 2024,
    },
  },

  // 22. a16z - Counter-UAS
  {
    ref: 'PB-0022',
    id: 'pb-0022',
    title: 'Multi-Sensor Counter-UAS Radar & Acoustic Fusion for Low-Altitude Drone Detection',
    description:
      'Critical infrastructure sites (substations, water reservoirs, maritime ports, airfields) face severe security threats from commercial off-the-shelf drones flying below conventional radar line-of-sight. Optical cameras struggle in rain and fog, while RF scanners are blind to autonomous pre-programmed drones operating without active remote-controller uplink signals.',
    affectedAudience: 'Critical infrastructure operators, port security authorities, and domestic defense installations',
    industry: 'Other',
    severity: 5,
    existingWorkarounds:
      'RF sniffers that fail against dark drones flying via onboard inertial navigation; manual acoustic perimeter patrols.',
    evidence: [
      {
        id: 'ev-22',
        label: 'a16z American Dynamism Research',
        url: 'https://a16z.com',
        note: 'Published thesis on counter-drone sensor fusion and airspace sovereignty.',
      },
    ],
    submitterId: '88888888-8888-4888-8888-888888888888',
    createdAt: '2026-05-14T11:00:00Z',
    updatedAt: '2026-05-14T11:00:00Z',
    status: 'published',
    duplicateOfId: null,
    moderationNote: '',
    source: {
      organization: 'Andreessen Horowitz (a16z)',
      program: 'American Dynamism & Defense Tech',
      sourceId: 'A16Z-AD-2024-01',
      url: 'https://a16z.com',
      publishedYear: 2024,
    },
  },

  // 23. a16z - Systems of Action
  {
    ref: 'PB-0023',
    id: 'pb-0023',
    title: 'Autonomous Generative Agent Orchestration to Replace Legacy ERP Systems of Record',
    description:
      'Enterprises spend billions licensing rigid ERP systems (SAP, Oracle) that act merely as passive databases of record. Every cross-functional workflow—such as purchase order exception matching, vendor discrepancy disputes, and freight bill auditing—requires human knowledge workers to act as manual middleware copying numbers across legacy enterprise tables.',
    affectedAudience: 'Enterprise procurement heads, supply chain finance controllers, and back-office administrative teams',
    industry: 'Finance',
    severity: 3,
    existingWorkarounds:
      'Robotic Process Automation (RPA) scripts that break whenever UI screens change; armies of offshore business process outsourcing (BPO) staff.',
    evidence: [],
    submitterId: '88888888-8888-4888-8888-888888888888',
    createdAt: '2026-05-18T16:30:00Z',
    updatedAt: '2026-05-18T16:30:00Z',
    status: 'published',
    duplicateOfId: null,
    moderationNote: '',
    source: {
      organization: 'Andreessen Horowitz (a16z)',
      program: 'Enterprise AI & Systems of Action',
      sourceId: 'A16Z-ENT-2024-03',
      url: 'https://a16z.com',
      publishedYear: 2024,
    },
  },

  // 24. a16z - Prior Authorization
  {
    ref: 'PB-0024',
    id: 'pb-0024',
    title: 'Real-Time Medical Necessity Adjudication & Automated Health Insurance Prior-Authorization',
    description:
      'Physicians and clinical clinics spend over 14 hours per doctor per week submitting faxed medical records to health insurance payers for pre-treatment prior authorization. Over 25% of submitted requests are wrongfully rejected on administrative pretexts, delaying urgent oncological infusions, spinal surgeries, and advanced diagnostic imaging by up to 3 weeks.',
    affectedAudience: 'Treating physicians, medical practice billing managers, and patients awaiting critical therapies',
    industry: 'Healthcare',
    severity: 5,
    existingWorkarounds:
      'Clinic nurses spending hours on hold with commercial insurance call centers; manual peer-to-peer physician appeals.',
    evidence: [],
    submitterId: '88888888-8888-4888-8888-888888888888',
    createdAt: '2026-05-22T10:15:00Z',
    updatedAt: '2026-05-22T10:15:00Z',
    status: 'published',
    duplicateOfId: null,
    moderationNote: '',
    source: {
      organization: 'Andreessen Horowitz (a16z)',
      program: 'Bio + Health Big Ideas',
      sourceId: 'A16Z-BIO-2024-02',
      url: 'https://a16z.com',
      publishedYear: 2024,
    },
  },

  // 25. a16z - SMR / Geothermal Microgrid
  {
    ref: 'PB-0025',
    id: 'pb-0025',
    title: 'Behind-the-Meter Small Modular Nuclear & Geothermal Microgrid Dispatch for Multi-GW AI Clusters',
    description:
      'Next-generation AI data center clusters require 1 to 5 gigawatts of continuous baseload power, but public electric utility grid interconnections have wait queues exceeding 6 to 9 years across North America and Europe. Hyperscalers need co-located, behind-the-meter small modular reactor (SMR) and enhanced geothermal generation systems paired with sub-cycle frequency stabilization to absorb extreme GPU model training load swings.',
    affectedAudience: 'Data center infrastructure architects, clean energy power producers, and AI hyperscale operators',
    industry: 'Energy',
    severity: 4,
    existingWorkarounds:
      'Renting temporary diesel and natural gas turbine generator banks; throttling model training runs during peak regional grid demand periods.',
    evidence: [],
    submitterId: '88888888-8888-4888-8888-888888888888',
    createdAt: '2026-05-26T14:40:00Z',
    updatedAt: '2026-05-26T14:40:00Z',
    status: 'published',
    duplicateOfId: null,
    moderationNote: '',
    source: {
      organization: 'Andreessen Horowitz (a16z)',
      program: 'Energy & Compute Infrastructure Big Ideas',
      sourceId: 'A16Z-NRG-2024-04',
      url: 'https://a16z.com',
      publishedYear: 2024,
    },
  },

  // 26. a16z - Semiconductor Reshoring
  {
    ref: 'PB-0026',
    id: 'pb-0026',
    title: 'Real-Time Sub-Tier Semiconductor Supply Chain Vulnerability Mapping & Component Substitution',
    description:
      'Critical defense avionics and industrial medical device manufacturers remain vulnerable to sudden factory stoppages caused by obsolete, single-sourced tier-3 microcontrollers and passive components. When a single fab or test facility in East Asia faces shutdown, procurement teams spend months manually searching for pin-compatible electrical alternates that meet military and automotive thermal certifications.',
    affectedAudience: 'Hardware systems architects, component qualification engineers, and high-reliability defense manufacturers',
    industry: 'Manufacturing',
    severity: 4,
    existingWorkarounds:
      'Paying 10x-50x spot broker price gouging for grey-market inventory; redesigning and re-certifying entire multi-layer PCB boards over 18 months.',
    evidence: [],
    submitterId: '88888888-8888-4888-8888-888888888888',
    createdAt: '2026-05-30T17:10:00Z',
    updatedAt: '2026-05-30T17:10:00Z',
    status: 'published',
    duplicateOfId: null,
    moderationNote: '',
    source: {
      organization: 'Andreessen Horowitz (a16z)',
      program: 'Supply Chain Reshoring & American Dynamism',
      sourceId: 'A16Z-MFG-2024-05',
      url: 'https://a16z.com',
      publishedYear: 2024,
    },
  },
]

export const SEED_VALIDATIONS: Validation[] = [
  // PB-0001
  {
    problemId: 'pb-0001',
    userId: 'demo-member-a',
    kind: 'direct',
    severity: 4,
    note: 'Our cooperative lost 14 tags in brush fencing last monsoon alone, creating insurance claim chaos.',
    createdAt: '2026-02-12T10:00:00Z',
    updatedAt: '2026-02-12T10:00:00Z',
  },
  {
    problemId: 'pb-0001',
    userId: 'demo-member-b',
    kind: 'observed',
    severity: 3,
    note: 'Observed repeatedly during field visits with dairy union extension officers.',
    createdAt: '2026-02-14T11:00:00Z',
    updatedAt: '2026-02-14T11:00:00Z',
  },
  // PB-0003
  {
    problemId: 'pb-0003',
    userId: 'demo-member-a',
    kind: 'observed',
    severity: 5,
    note: 'Witnessed during medical camp in Wayanad after transformer failure during floods.',
    createdAt: '2026-02-24T09:30:00Z',
    updatedAt: '2026-02-24T09:30:00Z',
  },
  {
    problemId: 'pb-0003',
    userId: 'demo-moderator',
    kind: 'direct',
    severity: 5,
    note: 'Directly experienced as former PHC medical officer. Spoilage risk during grid outages is severe.',
    createdAt: '2026-02-26T14:20:00Z',
    updatedAt: '2026-02-26T14:20:00Z',
  },
  // PB-0002
  {
    problemId: 'pb-0002',
    userId: 'demo-member-a',
    kind: 'direct',
    severity: 4,
    note: 'Damaged vehicle suspension twice on unlit arterial road that was unrepaired for 4 months.',
    createdAt: '2026-02-20T17:00:00Z',
    updatedAt: '2026-02-20T17:00:00Z',
  },
  {
    problemId: 'pb-0002',
    userId: 'demo-member-b',
    kind: 'interest',
    severity: null,
    note: 'Important urban governance infrastructure challenge.',
    createdAt: '2026-02-21T18:00:00Z',
    updatedAt: '2026-02-21T18:00:00Z',
  },
  // PB-0016 (YC Mixed Workforces)
  {
    problemId: 'pb-0016',
    userId: 'demo-member-a',
    kind: 'direct',
    severity: 4,
    note: 'We ran 12 MiR AMRs alongside 40 human pickers; dispatch collisions and deadlock wait times cost us 18% daily throughput.',
    createdAt: '2026-04-24T12:00:00Z',
    updatedAt: '2026-04-24T12:00:00Z',
  },
  // PB-0024 (a16z Prior Auth)
  {
    problemId: 'pb-0024',
    userId: 'demo-moderator',
    kind: 'direct',
    severity: 5,
    note: 'Our oncology clinic employs 3 full-time nurses doing nothing but faxing records to payers and sitting on hold.',
    createdAt: '2026-05-24T09:15:00Z',
    updatedAt: '2026-05-24T09:15:00Z',
  },
]

export const SEED_COMMENTS: Comment[] = [
  {
    id: 'comm-1',
    problemId: 'pb-0001',
    authorId: 'demo-member-a',
    body: 'Muzzle biometrics works similarly to fingerprint ridges and remains stable after 18 months of age according to ICAR studies. Lighting and camera angle are the main technical hurdles in cattle sheds.',
    createdAt: '2026-02-13T09:15:00Z',
    status: 'visible',
  },
  {
    id: 'comm-2',
    problemId: 'pb-0003',
    authorId: 'demo-moderator',
    body: 'The key is passive long-range IoT logging (e.g., LoRaWAN) that can run for 3 years on a coin cell even when the mains power cuts out completely.',
    createdAt: '2026-02-27T10:00:00Z',
    status: 'visible',
  },
  {
    id: 'comm-3',
    problemId: 'pb-0016',
    authorId: 'demo-member-b',
    body: 'The real bottleneck is the communication protocol between ROS2 fleets and legacy SAP warehouse modules. Standard webhooks cause 2-second latency spikes.',
    createdAt: '2026-04-25T14:30:00Z',
    status: 'visible',
  },
]

export const SEED_STATE: ProblemBoxState = {
  version: 2,
  problems: SEED_PROBLEMS,
  submitters: SEED_SUBMITTERS,
  validations: SEED_VALIDATIONS,
  comments: SEED_COMMENTS,
  reports: [],
  buildInterest: [
    { problemId: 'pb-0001', userId: 'demo-member-b', createdAt: '2026-02-15T12:00:00Z' },
    { problemId: 'pb-0003', userId: 'demo-member-a', createdAt: '2026-02-28T14:00:00Z' },
    { problemId: 'pb-0016', userId: 'demo-member-a', createdAt: '2026-04-25T16:00:00Z' },
    { problemId: 'pb-0024', userId: 'demo-member-b', createdAt: '2026-05-25T11:00:00Z' },
  ],
}
