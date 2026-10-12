export type StationId = "about" | "openlit" | "projects" | "engineering" | "experience" | "contact";

export type PanelId = StationId | `project:${string}`;

export type Station = {
  id: StationId;
  label: string;
  place: string;
  hint: string;
  /** Center of the object on the island, in world units [x, z]. */
  position: [number, number];
  /** Where Aman stands when he walks over, [x, z]. */
  approach: [number, number];
  /** Distance from `approach` that counts as "near". */
  reach: number;
  /** Brick color used for the station's pad, label dot, and trim. */
  color: string;
};

export const stations: Station[] = [
  {
    id: "openlit",
    label: "OpenLIT",
    place: "Control room",
    hint: "The open-source AI observability platform I co-founded",
    position: [0, -8],
    approach: [0, -4.4],
    reach: 1.8,
    color: "#ff8a00",
  },
  {
    id: "about",
    label: "About",
    place: "Workstation",
    hint: "Where the code happens",
    position: [-9, -1],
    approach: [-6.4, -0.4],
    reach: 1.7,
    color: "#3fb4f0",
  },
  {
    id: "projects",
    label: "Projects",
    place: "Portal",
    hint: "Travel Bud, Autobiography of AI, CLDPM",
    position: [8.6, -6.6],
    approach: [6.6, -3.4],
    reach: 1.8,
    color: "#e3000b",
  },
  {
    id: "engineering",
    label: "Engineering",
    place: "AI core",
    hint: "How I build: frontend, systems, AI, open source",
    position: [-8.4, -8.6],
    approach: [-6.2, -6.2],
    reach: 1.7,
    color: "#00a650",
  },
  {
    id: "experience",
    label: "Experience",
    place: "Timeline road",
    hint: "Newgen to Transilience, 2015 to now",
    position: [10, 5],
    approach: [8, 3.4],
    reach: 1.9,
    color: "#ffcd03",
  },
  {
    id: "contact",
    label: "Contact",
    place: "Mailbox",
    hint: "Say hello",
    position: [-7.6, 6.4],
    approach: [-5.8, 5.6],
    reach: 1.6,
    color: "#b05cff",
  },
];

export const stationById = Object.fromEntries(stations.map((station) => [station.id, station])) as Record<
  StationId,
  Station
>;

export const SPAWN: [number, number] = [0, 1.2];

export const minifig = {
  skin: 0xb7876c,
  hair: 0x2a1d16,
};

export const portrait = {
  src: "/images/aman-agarwal.webp",
  small: "/images/aman-agarwal-480.webp",
  jpg: "/images/aman-agarwal.jpg",
  alt: "Portrait of Aman Agarwal outdoors in a white printed t-shirt",
};

export const timeline = [
  { year: "2015", company: "Newgen" },
  { year: "2016", company: "Limetray" },
  { year: "2016", company: "Gradeup" },
  { year: "2021", company: "Appsmith" },
  { year: "2024", company: "OpenLIT" },
  { year: "2025", company: "Transilience" },
];
