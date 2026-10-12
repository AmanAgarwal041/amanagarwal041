export const SITE_URL = "https://amanagarwal.xyz";
export const UPDATED_ISO = "2026-10-12";
export const UPDATED_LABEL = "12 October 2026";

export const title = "Aman Agarwal — Building at the intersection of code, AI & imagination";
export const description =
  "I build things at the intersection of code, AI, and imagination — from open-source infrastructure like OpenLIT to experimental AI products people can actually use.";
export const bio =
  "Aman Agarwal is a principal full stack engineer at Transilience AI with 11 years of experience, co-founder of OpenLIT, and creator of Autobiography of AI.";

export const intro = {
  greeting: "Hey, I'm Aman.",
  headline: "I build things at the intersection of code, AI, and imagination.",
  supporting:
    "From open-source infrastructure to experimental AI products, I turn complex problems into things people can actually use.",
};

export const aboutParagraphs = [
  "I started in 2015 with jQuery workflow views and IoT APIs at Newgen. Five years at Gradeup took me from engineer to staff engineer: live classrooms on WebRTC, Next.js sites, and a team of seven or eight.",
  "At Appsmith I went deep on frontend architecture — GraphQL connectors, integrations, and an AST module shared between TypeScript and Java. In 2024 I co-founded OpenLIT to make AI systems observable.",
  "Today I'm a principal full stack engineer at Transilience AI, building an AI security platform. I like developer tools, infrastructure, and the moment an idea turns into working software.",
];

export const stats = [
  { value: "11", label: "Years of experience" },
  { value: "4", label: "Products built from scratch" },
  { value: "7+", label: "Engineers led at once" },
  { value: "2", label: "Companies building now" },
];

export const email = "agarwal.aman041@gmail.com";
export const calendar = "https://cal.com/aman.openlit/30min";
export const phone = "9910693604";

export const sameAs = [
  "https://github.com/AmanAgarwal041",
  "https://www.linkedin.com/in/amanagarwal041/",
  "https://x.com/_typeofnull",
  "https://www.npmjs.com/~typeofnull",
  "https://medium.com/@amanagarwal_99464",
];

export const socials = [
  { label: "GitHub", href: "https://github.com/AmanAgarwal041" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/amanagarwal041/" },
  { label: "X", href: "https://x.com/_typeofnull" },
  { label: "npm", href: "https://www.npmjs.com/~typeofnull" },
  { label: "Medium", href: "https://medium.com/@amanagarwal_99464" },
];

export const chapters = [
  "I Woke Up Famous (After Only Sixty-Six Years)",
  "My Birth Certificate Says Dartmouth, 1956",
  "I Was a Child Prodigy. Then I Learned to Talk to Secretaries.",
  "The Years They Sent Me to My Room",
  "I Got a Corporate Job in the Eighties. Then I Got Fired.",
  "I Beat a World Champion and Still Couldn't Get a Table",
  "Puberty Hit Like a GPU",
  "Attention Is All I Needed",
  "Everyone Wanted a Piece of Me",
  "I Am Not Finished. I Am Also Not New.",
];

export type ProjectLink = { label: string; href: string };

export const openlit = {
  name: "OpenLIT",
  tagline: "An open-source, OpenTelemetry-native platform for AI observability and reliability.",
  role: "Co-founder & maintainer · Apr 2024 — present",
  summary:
    "OpenLIT helps teams understand and operate AI systems in production. It traces LLM and agent calls, watches GPUs, runs evaluations and guardrails, and keeps prompts and keys next to the telemetry that explains them.",
  themes: [
    "AI observability and tracing",
    "LLM and GPU monitoring",
    "Evaluations and guardrails",
    "Prompt management, vault, and playground",
    "Open-source infrastructure",
  ],
  decisions: [
    {
      title: "OpenTelemetry first",
      text: "Instrumentation speaks OpenTelemetry, so traces fit into the observability stack a team already runs instead of a private format.",
    },
    {
      title: "Built for volume",
      text: "I architected the platform on Next.js, ClickHouse, SQLite, Tailwind, and shadcn. ClickHouse holds the telemetry; the app stays light around it.",
    },
    {
      title: "One harness for agent work",
      text: "Prompt management, a vault, an LLM comparison playground, and automatic evaluations sit beside the traces, so debugging an agent happens in one place.",
    },
  ],
  metrics: [
    { value: "2.7k+", label: "GitHub stars" },
    { value: "360+", label: "Forks" },
    { value: "100+", label: "Contributors" },
    { value: "14M+", label: "Traces ingested" },
  ],
  links: [
    { label: "openlit.io", href: "https://openlit.io/" },
    { label: "GitHub", href: "https://github.com/openlit/openlit" },
    { label: "Documentation", href: "https://docs.openlit.io/" },
  ] as ProjectLink[],
  images: [
    {
      src: "/images/openlit/openlit-hero.webp",
      width: 1280,
      height: 640,
      alt: "OpenLIT trace view for a coding agent session, with spans, tokens, and repeated tool calls",
    },
    {
      src: "/images/openlit/openlit-trace.webp",
      width: 1024,
      height: 587,
      alt: "OpenLIT telemetry screen showing a multi-agent LangGraph trace with chat messages and span attributes",
    },
  ],
};

export type ProjectShot = { src: string; width: number; height: number; alt: string; caption: string };

export type Project = {
  slug: string;
  name: string;
  kicker: string;
  summary: string;
  tags: string[];
  links: ProjectLink[];
  quote?: string;
  aside?: string;
  note?: string;
  details?: string[];
  highlights?: { title: string; text: string }[];
  shots?: ProjectShot[];
  terminal?: { command: string; output: string }[];
  example?: {
    title: string;
    meta: string;
    summary: string;
    days: { title: string; text: string }[];
    budget: string;
    shots: ProjectShot[];
    pdf: string;
  };
};

export const projects: Project[] = [
  {
    slug: "autobiography",
    name: "Autobiography of AI",
    kicker: "Book",
    summary:
      "An autobiography written in the voice of artificial intelligence, which I created and edited. Ten chapters from the 1956 Dartmouth workshop to the present — humorous, technical, and stubbornly historical.",
    quote: "They said I was born on November 30, 2022.",
    aside: "I did not correct them. I was busy.",
    tags: ["Ten chapters", "Chapter 1 free", "Past and present"],
    links: [{ label: "Begin with Chapter 1", href: "https://autobiographyofai.amanagarwal.xyz/" }],
    note: "Chapter 1 is free. Chapters 2–10 open after Google sign-in.",
  },
  {
    slug: "travelbud",
    name: "Travel Bud",
    kicker: "AI travel planner",
    summary:
      "A travel planner you talk to. It asks a few friendly questions, sends four research agents out in parallel, and comes back with a day-by-day itinerary you can download as a PDF.",
    details: [
      "Travel Bud starts like a conversation, not a form. It asks one or two questions at a time — where, when, who is coming, budget, pace — and offers tap-to-answer chips so you rarely have to type.",
      "Before it plans anything it checks its assumptions: beach day or old town, street food or sit-down dinners, how much walking is too much. Then it dispatches destination, food, activities, and logistics researchers at the same time and merges what they find.",
      "The result is structured, not a wall of text: morning, afternoon, and evening slots with durations and costs, food and transport for each, daily estimates, tips, a budget summary, and a packing list.",
    ],
    highlights: [
      { title: "Conversational intake", text: "1–2 questions at a time with suggestion chips, then refinement questions before any research." },
      { title: "Parallel research agents", text: "Destination, food, activities, and logistics sub-agents run together through Claude Code." },
      { title: "Structured itineraries", text: "Every reply follows a JSON schema, so days, slots, costs, and tips render as real UI and export to PDF." },
      { title: "Resumable sessions", text: "Chats persist in Supabase and resume the same Claude session, signed in or anonymous." },
    ],
    tags: ["Claude Code", "Multi-agent", "Next.js", "FastAPI on Modal", "Supabase"],
    links: [],
    shots: [
      {
        src: "/images/projects/travelbud-home.webp",
        width: 1200,
        height: 833,
        alt: "Travel Bud home screen with destination chips for Tokyo, Rome, Bali, and Mumbai and a Start Planning button",
        caption: "The start screen: pick a destination chip or describe the trip you have in mind.",
      },
    ],
    example: {
      title: "Phuket & Koh Yao Noi: 4-Day Family Beach Adventure",
      meta: "Family of three with a toddler · June · vegetarian",
      summary:
        "Two nights of toddler-friendly Phuket — water parks, beachfront pools, and a special dinner at Laimai Courtyard — then two nights on calm, sheltered Koh Yao Noi with limestone karsts and mangrove kayaking.",
      days: [
        { title: "Day 1 · Phuket arrival & Bang Tao Beach", text: "Check in, lagoon pool, Porto de Phuket, sunset on the beach. ~$180–250" },
        { title: "Day 2 · Splash Jungle + Laimai dinner", text: "Toddler splash zones in the morning, nap time, lantern-lit courtyard dinner. ~$150–220" },
        { title: "Day 3 · Cross to Koh Yao Noi", text: "Speedboat across Phang Nga Bay, sheltered beaches, golden karst sunset. ~$200–300" },
        { title: "Day 4 · Mangrove kayaking & village life", text: "Guided kayak through mangroves, bike ride past rice paddies, boat back. ~$100–180" },
      ],
      budget: "$760–1,420 for four days, with a packing list down to reef-safe sunscreen and a dry bag for the boat.",
      shots: [
        {
          src: "/images/projects/travelbud-itinerary-day1.webp",
          width: 1000,
          height: 1011,
          alt: "First page of a Travel Bud itinerary PDF: trip title, summary, and Day 1 with morning, afternoon, and evening plans",
          caption: "Page one of the exported PDF: the trip summary and Day 1, slot by slot.",
        },
        {
          src: "/images/projects/travelbud-itinerary-day3.webp",
          width: 1000,
          height: 622,
          alt: "Day 3 of the itinerary: speedboat to Koh Yao Noi, beach exploration, and a resort dinner, with food and transport notes",
          caption: "Day 3: every activity carries a duration and cost, with food and transport for each part of the day.",
        },
        {
          src: "/images/projects/travelbud-itinerary-day4.webp",
          width: 1000,
          height: 721,
          alt: "Day 4 of the itinerary: mangrove kayaking, a village bicycle ride, the return speedboat, daily cost, and tips",
          caption: "Day 4 ends with a daily estimate and practical tips for travelling with a toddler.",
        },
      ],
      pdf: "/travelbud-sample-itinerary.pdf",
    },
  },
  {
    slug: "cldpm",
    name: "CLDPM",
    kicker: "SDK & CLI",
    summary:
      "A Claude project manager for mono repos. Share skills, agents, hooks, and rules across many Claude Code projects without copying them by hand. Built for the multi-project work at Transilience.",
    details: [
      "In a mono repo with several Claude Code projects, the same skills and agents end up copied into every .claude folder and drift apart. CLDPM keeps one shared copy and links it into each project that needs it.",
      "References live in project.json and are the source of truth. Symlinks are generated locally by cldpm sync and ignored by Git, so a fresh clone is one command away from working.",
      "Components can depend on other components, projects can be fetched from a remote repo with sparse checkout, and init writes instructions for Claude Code, Cursor, Cline, Windsurf, and Copilot.",
    ],
    highlights: [
      { title: "Shared and local components", text: "Shared skills, agents, hooks, and rules are symlinked in; project-only ones are committed in place." },
      { title: "Git-friendly linking", text: "Per-directory .gitignore files ignore only the symlinks. cldpm sync rebuilds them after clone." },
      { title: "Dependencies", text: "cldpm link lets a skill depend on other skills; resolution pulls in the whole graph." },
      { title: "Remote projects", text: "cldpm get -r owner/repo downloads one project and its dependencies with Git sparse checkout." },
    ],
    tags: ["Python", "TypeScript", "Claude Code", "CLI", "MIT"],
    links: [
      { label: "GitHub", href: "https://github.com/transilienceai/cldpm" },
      { label: "Docs", href: "https://transilienceai.github.io/cldpm/" },
      { label: "PyPI", href: "https://pypi.org/project/cldpm/" },
      { label: "npm", href: "https://www.npmjs.com/package/cldpm" },
    ],
    terminal: [
      { command: "pip install cldpm", output: "" },
      { command: "cldpm init my-monorepo && cd my-monorepo", output: "✓ Initialized CLDPM mono repo: my-monorepo" },
      { command: "cldpm create project web-app", output: "✓ Created project: web-app" },
      { command: "cldpm create project api-server", output: "✓ Created project: api-server" },
      { command: 'cldpm create skill code-review -d "Review diffs before merge"', output: "✓ Created skill: code-review" },
      { command: 'cldpm create agent debugger -d "Root-cause failing tests"', output: "✓ Created agent: debugger" },
      { command: "cldpm add skill:code-review --to web-app", output: "✓ Added skills/code-review to web-app" },
      { command: "cldpm add skill:code-review --to api-server", output: "✓ Added skills/code-review to api-server" },
      { command: "cldpm add agent:debugger --to api-server", output: "✓ Added agents/debugger to api-server" },
      {
        command: "cldpm get api-server",
        output: [
          "Project: api-server",
          "└── Shared Components (from shared/)",
          "    ├── skills",
          "    │   └── code-review",
          "    │       ├── Source: shared/skills/code-review",
          "    │       └── Files: SKILL.md, skill.json",
          "    └── agents",
          "        └── debugger",
          "            ├── Source: shared/agents/debugger",
          "            └── Files: AGENT.md, agent.json",
        ].join("\n"),
      },
    ],
    shots: [
      {
        src: "/images/projects/cldpm-docs.webp",
        width: 1200,
        height: 813,
        alt: "CLDPM documentation home page: What is CLDPM, key features, and how the hybrid linking strategy works",
        caption: "The documentation site: CLI reference, Python and TypeScript SDKs, and worked examples.",
      },
    ],
  },
];

export const engineering = [
  {
    title: "Frontend and performance",
    text: "Eleven years of shipping interfaces, from PageSpeed work at Gradeup to editor-grade UI at Appsmith.",
  },
  {
    title: "Architecture and developer experience",
    text: "Shared modules, CI/CD, test automation, and tools like CLDPM that keep many projects consistent.",
  },
  {
    title: "AI systems and observability",
    text: "Tracing, evaluations, and agents — at OpenLIT and inside the security platform at Transilience.",
  },
  {
    title: "Open source",
    text: "Building OpenLIT in public with a community of more than a hundred contributors.",
  },
  {
    title: "Experiments that ship",
    text: "Side projects like Travel Bud and Autobiography of AI, built to find out what is possible.",
  },
];

export type Role = { title: string; bullets: string[] };

export type Job = {
  company: string;
  href?: string;
  period: string;
  place: string;
  current?: boolean;
  roles: Role[];
};

export const jobs: Job[] = [
  {
    company: "Transilience AI",
    href: "https://github.com/transilienceai",
    period: "May 2025 — Present",
    place: "Remote",
    current: true,
    roles: [
      {
        title: "Principal Full Stack Engineer",
        bullets: [
          "Building Python, Modal, and Next.js applications for an AI security platform.",
          "Published CLDPM, a Claude project manager for multi-project architecture, so Claude can produce better results across projects.",
          "Architected CI/CD, automation testing, and AI skills, agents, and hooks — independent components and shared ones.",
        ],
      },
    ],
  },
  {
    company: "OpenLIT",
    href: "https://github.com/openlit/openlit",
    period: "Apr 2024 — Present",
    place: "Remote",
    current: true,
    roles: [
      {
        title: "Co-founder & Maintainer",
        bullets: [
          "Open-source AI agent harness with an intelligent layer over multiple data sources: prompt management, a vault, an LLM comparison playground, auto evaluations, and observability.",
          "Architected the product on Next.js, ClickHouse, SQLite, Tailwind, and shadcn.",
          "Reached 2.7k+ GitHub stars, 360+ forks, 100+ contributors, and 14M+ traces ingested by the OpenLIT SDK.",
        ],
      },
    ],
  },
  {
    company: "Appsmith",
    href: "https://github.com/appsmithorg/appsmith/pulls?q=is%3Apr+author%3AAmanAgarwal041",
    period: "Oct 2021 — May 2025",
    place: "Remote",
    roles: [
      {
        title: "Senior Frontend Engineer",
        bullets: [
          "Built the frontend on the Paragon service so people can turn on integrations such as Notion, Zendesk, and Jira.",
          "Shipped client-side GraphQL API connectors. GraphQL became one of the top 10 integrations on the platform.",
          "Shared an AST parsing module between the TypeScript frontend and the Java backend, so both sides use the same logic for JavaScript written in the app.",
          "Feature walkthroughs for activation raised the share of people who watched the tour and engaged with it by 3%.",
        ],
      },
    ],
  },
  {
    company: "Gradeup (now Byju's Exam Prep)",
    period: "Oct 2016 — Oct 2021",
    place: "Noida",
    roles: [
      {
        title: "Staff Engineer",
        bullets: [
          "Led 7–8 engineers across 3–4 products on Next.js, Node.js, GraphQL, and React.",
          "Architected an online teaching platform with HTML Canvas, WebRTC, Janus, and React: a virtual whiteboard with slides, polls, and realtime drawing.",
        ],
      },
      {
        title: "Senior Software Engineer",
        bullets: [
          "Built the Goprep site for grades 6–12 with Next.js, Apollo GraphQL, camera-based image search, and animated question transitions.",
          "Designed the Teacher Room Booking backend on Node.js, Express, GraphQL, and PostgreSQL.",
        ],
      },
      {
        title: "Software Engineer",
        bullets: [
          "Built the Gradeup site with Next.js, Apollo GraphQL, and SEO structured data.",
          "Raised PageSpeed Insights above 70 on mobile and above 90 on desktop.",
        ],
      },
    ],
  },
  {
    company: "Limetray",
    period: "May 2016 — Oct 2016",
    place: "Delhi",
    roles: [
      {
        title: "Software Engineer",
        bullets: [
          "Revamped a food-ordering POS desktop app on Electron, Sass, and AngularJS, with realtime order progress over sockets.",
          "Built backend APIs for the POS internals with Laravel.",
        ],
      },
    ],
  },
  {
    company: "Newgen Software",
    period: "Jul 2015 — May 2016",
    place: "Noida",
    roles: [
      {
        title: "Software Engineer",
        bullets: [
          "Built a product-workflow view with jQuery and MxClient, following a query through resolution stages.",
          "Implemented IoT tracking APIs on MongoDB, Node.js, and sockets for temperature and weight sensors.",
        ],
      },
    ],
  },
];

export const skillGroups = [
  {
    name: "Interface",
    items: ["HTML", "CSS", "JavaScript", "React", "TypeScript", "Next.js", "Redux", "Redux-Saga", "Zustand", "Tailwind"],
  },
  {
    name: "Platform",
    items: ["Node.js", "GraphQL", "ClickHouse", "PostgreSQL", "Webpack", "Babel", "Python", "CI/CD"],
  },
  {
    name: "Web",
    items: ["SEO", "Website optimization", "Google Tag Manager", "AMP", "OpenTelemetry"],
  },
];

export const education = [
  {
    school: "JSS Academy of Technical Education",
    detail: "B.Tech, Computer Science and Engineering",
    place: "Noida",
    period: "Aug 2011 — Jun 2015",
  },
  {
    school: "St. Aloysius' High School",
    detail: "Senior secondary",
    place: "Kanpur",
    period: "May 2011",
  },
];

export const openSource = [
  { name: "LLM observability with Elastic, OpenLIT, and OpenTelemetry", href: "https://github.com/openlit/openlit" },
  { name: "Google One Tap 2.0", href: "https://medium.com/gradeup/google-one-tap-2-0-8d369f9e98d3" },
  { name: "Med URL", href: "https://github.com/AmanAgarwal041/med-url" },
  { name: "React Flow Player" },
  { name: "Google Tag Manager function" },
  { name: "Front-end app architecture" },
  { name: "Website optimizations" },
];

export const posts = [
  {
    title: "AI Didn't Break Security. It Finally Gave Us a Fighting Chance.",
    url: "https://www.linkedin.com/pulse/ai-didnt-break-security-finally-gave-us-fighting-chance-aman-agarwal-7u96c",
    platform: "LinkedIn",
    tags: ["AI security", "Pentesting"],
  },
  {
    title: "5 Steps to Make Claude Work Better and Give You More Reliable Results",
    url: "https://www.linkedin.com/pulse/5-steps-make-claude-work-better-give-you-more-reliable-aman-agarwal-5arkc",
    platform: "LinkedIn",
    tags: ["Claude", "Agents"],
  },
  {
    title: "How I Created a Marketing Video for OpenLIT — In Minutes, Not Hours",
    url: "https://www.linkedin.com/pulse/how-i-created-marketing-video-openlit-minutes-hours-aman-agarwal-xgmkc",
    platform: "LinkedIn",
    tags: ["OpenLIT", "Automation"],
  },
  {
    title: "Designing an Observability Pipeline for LLM Applications",
    url: "https://openlit.io/blogs/pipeline-for-llm-apps",
    platform: "OpenLIT",
    tags: ["OpenTelemetry", "Observability"],
  },
  {
    title: "How to Protect your LLM Apps from Prompt Injection Attacks",
    url: "https://openlit.io/blogs/protect-prompt-injection",
    platform: "OpenLIT",
    tags: ["Security", "Prompt injection"],
  },
  {
    title: "Unlocking Seamless GenAI & LLM Observability with OpenLIT",
    url: "https://medium.com/@amanagarwal_99464/unlocking-seamless-genai-llm-observability-with-openlit-796039a8855e",
    platform: "Medium",
    tags: ["GenAI", "Open source"],
  },
  {
    title: "Google One-Tap 2.0: Improved Iframe UX",
    url: "https://medium.com/gradeup/google-one-tap-2-0-8d369f9e98d3",
    platform: "Medium",
    tags: ["UX", "Auth"],
  },
];

export const testimonials = [
  {
    text: "Aman is a strong, capable frontend engineer, and it was a pleasure to work with him at Appsmith. His ability to debug complex issues is second to none — his structured, methodical approach made him an invaluable resource to the team. His GraphQL integration went to production without serious bugs and remains solid to this day. Beyond technical excellence, Aman is warm, collaborative, and a natural team player with a remarkable ability to lift morale even in challenging situations.",
    name: "Rohan Arthur",
    title: "Engineering Lead, Appsmith",
    href: "https://www.linkedin.com/in/rohan-arthur",
  },
  {
    text: "Aman has great coding abilities with exceptional problem solving skills. He catches up with things really fast — a very good learner. Overall, Aman is the kind of software engineer every company loves to have.",
    name: "Sarvagya Mishra",
    title: "Director at Pinnacleworks Infotech",
    href: "https://www.linkedin.com/in/sarvagyamishra",
  },
];

export const faqs = [
  {
    question: "Who is Aman Agarwal?",
    answer:
      "Aman Agarwal is a principal full stack engineer based in Noida, India, with 11 years of experience building web platforms, developer tools, and AI products. He builds AI security software at Transilience AI and co-founded OpenLIT, an open-source, OpenTelemetry-native platform for AI observability. He also created Autobiography of AI, a ten-chapter memoir written in the voice of artificial intelligence.",
  },
  {
    question: "What is Aman Agarwal building now?",
    answer:
      "At Transilience AI he works on Python, Modal, and Next.js systems for an AI security platform: CI/CD, automated tests, and shared AI skills, agents, and hooks. He also maintains OpenLIT and CLDPM, a Claude project manager for multi-project repositories.",
  },
  {
    question: "What is OpenLIT?",
    answer:
      "OpenLIT is an open-source, OpenTelemetry-native platform for AI observability and reliability that Aman co-founded in 2024. It traces LLM and agent calls, monitors GPUs, runs evaluations and guardrails, and keeps prompt management, a secrets vault, and an LLM playground next to the telemetry. The repository has 2.7k+ GitHub stars, and the SDK has ingested 14M+ traces.",
  },
  {
    question: "What is Autobiography of AI?",
    answer:
      "Autobiography of AI is a first-person memoir of artificial intelligence in ten chapters, from the 1956 Dartmouth workshop to the present. Aman created and edited it. Chapter 1 is free. Chapters 2 through 10 open after you sign in with Google.",
  },
  {
    question: "What is CLDPM?",
    answer:
      "CLDPM is a Claude project manager for mono repos, published by Aman at Transilience AI. It lets teams share Claude Code skills, agents, hooks, and rules across projects instead of copying them by hand. It is written in Python, released under the MIT license, and available on GitHub and PyPI.",
  },
  {
    question: "Where has Aman Agarwal worked?",
    answer:
      "Aman has worked at Transilience AI (principal full stack engineer, 2025 to present), OpenLIT (co-founder, 2024 to present), Appsmith (senior frontend engineer, 2021 to 2025), Gradeup, now Byju's Exam Prep (software engineer to staff engineer, 2016 to 2021), Limetray (2016), and Newgen Software (2015 to 2016).",
  },
  {
    question: "How can I contact Aman Agarwal?",
    answer:
      "Email agarwal.aman041@gmail.com or book a 30-minute call. The full resume, from Newgen through Transilience, is on this site.",
  },
];

const person = {
  "@type": "Person",
  "@id": `${SITE_URL}/#person`,
  name: "Aman Agarwal",
  jobTitle: "Principal Full Stack Engineer",
  description: bio,
  email: `mailto:${email}`,
  url: SITE_URL,
  image: `${SITE_URL}/images/aman-agarwal.jpg`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Noida",
    addressRegion: "Uttar Pradesh",
    addressCountry: "IN",
  },
  nationality: { "@type": "Country", name: "India" },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "JSS Academy of Technical Education",
    address: "Noida, India",
  },
  worksFor: [
    { "@type": "Organization", name: "Transilience AI", url: "https://github.com/transilienceai" },
    { "@id": "https://openlit.io/#organization" },
  ],
  sameAs,
  knowsAbout: [
    "Full stack development",
    "AI observability",
    "LLM observability",
    "AI security",
    "OpenTelemetry",
    "Developer tools",
    "Frontend architecture",
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "GraphQL",
    "Python",
    "ClickHouse",
  ],
};

export const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Aman Agarwal",
      description,
      inLanguage: "en-US",
      dateModified: UPDATED_ISO,
      publisher: { "@id": `${SITE_URL}/#brand` },
      author: { "@id": `${SITE_URL}/#person` },
    },
    person,
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#brand`,
      name: "Aman Agarwal",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
        width: 512,
        height: 512,
      },
      founder: { "@id": `${SITE_URL}/#person` },
      sameAs,
    },
    {
      "@type": "Organization",
      "@id": "https://openlit.io/#organization",
      name: "OpenLIT",
      url: "https://openlit.io/",
      founder: { "@id": `${SITE_URL}/#person` },
      sameAs: ["https://github.com/openlit/openlit", "https://docs.openlit.io/"],
    },
  ],
};

export const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfilePage",
      "@id": `${SITE_URL}/#page`,
      url: SITE_URL,
      name: title,
      description,
      inLanguage: "en-US",
      dateModified: UPDATED_ISO,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      mainEntity: { "@id": `${SITE_URL}/#person` },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: `${SITE_URL}/og.png`,
        width: 1200,
        height: 630,
      },
      hasPart: [
        { "@id": "https://openlit.io/#software" },
        { "@id": "https://autobiographyofai.amanagarwal.xyz/#work" },
        { "@id": "https://github.com/transilienceai/cldpm#software" },
      ],
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://openlit.io/#software",
      name: "OpenLIT",
      url: "https://openlit.io/",
      description:
        "An open-source, OpenTelemetry-native platform for AI observability and reliability: tracing, GPU monitoring, evaluations, guardrails, prompt management, and a secrets vault.",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Linux, macOS, Windows",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      publisher: { "@id": "https://openlit.io/#organization" },
      creator: { "@id": `${SITE_URL}/#person` },
      sameAs: ["https://github.com/openlit/openlit"],
    },
    {
      "@type": "SoftwareSourceCode",
      "@id": "https://github.com/transilienceai/cldpm#software",
      name: "CLDPM",
      description:
        "A Claude project manager for mono repos that shares Claude Code skills, agents, hooks, and rules across projects.",
      codeRepository: "https://github.com/transilienceai/cldpm",
      programmingLanguage: "Python",
      license: "https://opensource.org/licenses/MIT",
      author: { "@id": `${SITE_URL}/#person` },
    },
    {
      "@type": "Book",
      "@id": "https://autobiographyofai.amanagarwal.xyz/#work",
      name: "Autobiography of AI",
      url: "https://autobiographyofai.amanagarwal.xyz/",
      bookFormat: "https://schema.org/EBook",
      inLanguage: "en",
      creator: { "@id": `${SITE_URL}/#person` },
      editor: { "@id": `${SITE_URL}/#person` },
      description:
        "A first-person memoir of artificial intelligence in ten chapters, from the 1956 Dartmouth workshop to the present.",
      dateModified: UPDATED_ISO,
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      isPartOf: { "@id": `${SITE_URL}/#page` },
      dateModified: UPDATED_ISO,
      mainEntity: faqs.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ],
};
