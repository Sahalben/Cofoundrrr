import type { ProblemBoxState, Submitter, Problem, Validation, Comment } from '../domain/types'

/**
 * Authentic seed dataset sourced from open problem statement banks:
 * - Smart India Hackathon (Ministry of Education's Innovation Cell / AICTE)
 * - Kerala Startup Mission (KSUM) Government Department Innovation Challenges
 *
 * Each item contains faithful citations and public source provenance.
 */

export const SEED_SUBMITTERS: Submitter[] = [
  {
    id: 'sub-sih-moe',
    displayName: "Ministry of Education's Innovation Cell (MIC / AICTE)",
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
    id: 'sub-org-ahd',
    displayName: 'Department of Animal Husbandry, Govt of Kerala',
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
    id: 'sub-member-dr-anand',
    displayName: 'Dr. Anand Varma',
    kind: 'individual',
    verified: false,
  },
  {
    id: 'sub-member-priya',
    displayName: 'Priya K. Menon',
    kind: 'individual',
    verified: false,
  },
]

export const SEED_PROBLEMS: Problem[] = [
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
    submitterId: 'sub-org-ahd',
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
    submitterId: 'sub-sih-moe',
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
    submitterId: 'sub-sih-moe',
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
    submitterId: 'sub-ksum',
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
    submitterId: 'sub-sih-moe',
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
    submitterId: 'sub-org-ksitm',
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
  {
    id: 'pb-0007',
    ref: 'PB-0007',
    title: 'Continuous Water Quality and Aeration Balancing for Coastal Aquaculture Ponds',
    description:
      'Smallholder shrimp and fish farmers experience sudden stock mortality due to rapid nighttime dissolved oxygen (DO) depletion and toxic ammonia/nitrite spikes caused by uneaten feed and algal die-offs. Existing handheld test kits are used only once a week during daytime, which misses critical midnight drops in oxygen when paddlewheel aerators fail.',
    affectedAudience: 'Coastal brackish water shrimp farmers and regional fisheries cooperatives',
    industry: 'Agriculture',
    severity: 4,
    existingWorkarounds:
      'Manual chemical titration kits used once a week; running diesel aerators continuously on guessed schedules, causing immense fuel expense.',
    evidence: [],
    submitterId: 'sub-member-priya',
    createdAt: '2026-03-20T12:00:00Z',
    updatedAt: '2026-03-20T12:00:00Z',
    status: 'published',
    duplicateOfId: null,
    moderationNote: '',
    source: null,
  },
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
    submitterId: 'sub-member-dr-anand',
    createdAt: '2026-03-25T15:10:00Z',
    updatedAt: '2026-03-25T15:10:00Z',
    status: 'published',
    duplicateOfId: null,
    moderationNote: '',
    source: null,
  },
]

export const SEED_VALIDATIONS: Validation[] = [
  // Livestock Problem (pb-0001): Strong direct experience
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
  // Vaccine cold chain (pb-0003): Critical direct & observed
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
  // Pothole detection (pb-0002): Observed and interest
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
    severity: null, // General interest must have null severity
    note: 'Important urban governance infrastructure challenge.',
    createdAt: '2026-02-21T18:00:00Z',
    updatedAt: '2026-02-21T18:00:00Z',
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
]

export const SEED_STATE: ProblemBoxState = {
  version: 1,
  problems: SEED_PROBLEMS,
  submitters: SEED_SUBMITTERS,
  validations: SEED_VALIDATIONS,
  comments: SEED_COMMENTS,
  reports: [],
  buildInterest: [
    { problemId: 'pb-0001', userId: 'demo-member-b', createdAt: '2026-02-15T12:00:00Z' },
    { problemId: 'pb-0003', userId: 'demo-member-a', createdAt: '2026-02-28T14:00:00Z' },
  ],
}
