export type AdmissionBand = "Safe" | "Target" | "Ambitious" | "Insufficient data";
export type AssessmentExam = "JEE Main" | "MHT-CET" | "CAT";

export type SourceRecord = {
  label: string;
  publisher: string;
  url: string;
  accessedOn: string;
  dataYear?: string;
};

export type CutoffReference = {
  exam: AssessmentExam;
  year: number;
  round: string;
  category: string;
  quota: string;
  closingRank: number;
  source: SourceRecord;
  caveat?: string;
};

export type Program = {
  id: string;
  name: string;
  stream: "Engineering" | "Management" | "Commerce" | "Arts";
  exam: string;
  duration: string;
  feeLabel: string;
  intake?: number;
  intakeYear?: string;
  source: SourceRecord;
  cutoff?: CutoffReference;
  closingRank: number | null;
};

export type College = {
  id: string;
  name: string;
  city: string;
  state: string;
  type: string;
  initials: string;
  description: string;
  tags: string[];
  dataStatus: string;
  source: SourceRecord;
  officialUrl: string;
  updatedAt: string;
  programs: Program[];
};

const accessedOn = "2026-09-12";

/**
 * Small source-linked launch dataset. Cutoffs are only used by the assessment
 * when exam, category, quota, round and year match the stored reference.
 */
export const colleges: College[] = [
  {
    id: "coep",
    name: "COEP Technological University",
    city: "Pune",
    state: "Maharashtra",
    type: "Public technical university",
    initials: "CO",
    description: "Public university with engineering programs and a published undergraduate intake page.",
    tags: ["Engineering", "Pune", "Public"],
    dataStatus: "Official historic program source",
    source: {
      label: "COEP first-year B.Tech intake",
      publisher: "COEP Technological University",
      url: "https://www.coeptech.ac.in/first-year-b-tech/",
      accessedOn,
      dataYear: "2024-25",
    },
    officialUrl: "https://www.coeptech.ac.in/",
    updatedAt: "Official page · 2024-25 admissions",
    programs: [
      {
        id: "coep-cse",
        name: "B.Tech Computer Engineering",
        stream: "Engineering",
        exam: "MHT-CET / JEE Main",
        duration: "4 years",
        feeLabel: "Not published in this record",
        intake: 150,
        intakeYear: "2024-25",
        source: {
          label: "COEP first-year B.Tech intake",
          publisher: "COEP Technological University",
          url: "https://www.coeptech.ac.in/first-year-b-tech/",
          accessedOn,
          dataYear: "2024-25",
        },
        closingRank: null,
      },
    ],
  },
  {
    id: "vjti",
    name: "Veermata Jijabai Technological Institute",
    city: "Mumbai",
    state: "Maharashtra",
    type: "Autonomous public institute",
    initials: "VJ",
    description: "Mumbai institute with official undergraduate program and sanctioned intake information.",
    tags: ["Engineering", "Mumbai", "Public"],
    dataStatus: "Official program source",
    source: {
      label: "VJTI undergraduate admission",
      publisher: "VJTI Mumbai",
      url: "https://vjti.ac.in/undergraduate-admission/",
      accessedOn,
      dataYear: "2026-27",
    },
    officialUrl: "https://vjti.ac.in/",
    updatedAt: "Official page · 2026-27 intake",
    programs: [
      {
        id: "vjti-cse",
        name: "B.Tech Computer Engineering",
        stream: "Engineering",
        exam: "MHT-CET",
        duration: "4 years",
        feeLabel: "Not published in this record",
        intake: 60,
        intakeYear: "2026-27",
        source: {
          label: "VJTI undergraduate admission",
          publisher: "VJTI Mumbai",
          url: "https://vjti.ac.in/undergraduate-admission/",
          accessedOn,
          dataYear: "2026-27",
        },
        closingRank: null,
      },
    ],
  },
  {
    id: "pict",
    name: "Pune Institute of Computer Technology",
    city: "Pune",
    state: "Maharashtra",
    type: "Private unaided institute",
    initials: "PI",
    description: "Autonomous engineering institute with official program and historic intake information.",
    tags: ["Engineering", "Pune", "Private"],
    dataStatus: "Official historic source",
    source: {
      label: "PICT undergraduate admission",
      publisher: "PICT Pune",
      url: "https://pict.edu/undergraduate/",
      accessedOn,
      dataYear: "2021-22",
    },
    officialUrl: "https://pict.edu/",
    updatedAt: "Official page · historic intake",
    programs: [
      {
        id: "pict-cse",
        name: "B.E. Information Technology",
        stream: "Engineering",
        exam: "MHT-CET / JEE Main",
        duration: "4 years",
        feeLabel: "Not published in this record",
        intake: 180,
        intakeYear: "2021-22",
        source: {
          label: "PICT undergraduate admission",
          publisher: "PICT Pune",
          url: "https://pict.edu/undergraduate/",
          accessedOn,
          dataYear: "2021-22",
        },
        closingRank: null,
      },
    ],
  },
  {
    id: "vnit",
    name: "Visvesvaraya National Institute of Technology",
    city: "Nagpur",
    state: "Maharashtra",
    type: "National institute",
    initials: "VN",
    description: "National institute whose academic page lists B.Tech Computer Science and Engineering and JEE-based centralized admission.",
    tags: ["Engineering", "Nagpur", "National institute"],
    dataStatus: "Official program source",
    source: {
      label: "VNIT academic programs",
      publisher: "VNIT Nagpur",
      url: "https://vnit.ac.in/undergraduate-programe/",
      accessedOn,
      dataYear: "Current page",
    },
    officialUrl: "https://vnit.ac.in/",
    updatedAt: "Official program page · cutoff row not yet imported",
    programs: [
      {
        id: "vnit-cse",
        name: "B.Tech Computer Science and Engineering",
        stream: "Engineering",
        exam: "JEE Main / JoSAA",
        duration: "4 years",
        feeLabel: "Not published in this record",
        source: {
          label: "VNIT academic programs",
          publisher: "VNIT Nagpur",
          url: "https://vnit.ac.in/undergraduate-programe/",
          accessedOn,
          dataYear: "Current page",
        },
        closingRank: null,
      },
    ],
  },
  {
    id: "iim-nagpur",
    name: "Indian Institute of Management Nagpur",
    city: "Nagpur",
    state: "Maharashtra",
    type: "Public management institute",
    initials: "IN",
    description: "IIM Nagpur's official page describes its two-year full-time residential MBA program.",
    tags: ["Management", "Nagpur", "Public"],
    dataStatus: "Official program source",
    source: {
      label: "About MBA",
      publisher: "IIM Nagpur",
      url: "https://www.iimnagpur.ac.in/programmes/mba/about-mba/",
      accessedOn,
    },
    officialUrl: "https://www.iimnagpur.ac.in/",
    updatedAt: "Official MBA page",
    programs: [
      {
        id: "iim-nagpur-mba",
        name: "MBA / PGP",
        stream: "Management",
        exam: "CAT",
        duration: "2 years",
        feeLabel: "Not published in this record",
        source: {
          label: "MBA admissions policy",
          publisher: "IIM Nagpur",
          url: "https://www.iimnagpur.ac.in/admissions/mba/admissions-policy/",
          accessedOn,
          dataYear: "2026-28",
        },
        closingRank: null,
      },
    ],
  },
  {
    id: "fcrce",
    name: "Fr. Conceicao Rodrigues College of Engineering",
    city: "Mumbai",
    state: "Maharashtra",
    type: "Autonomous private institute",
    initials: "FC",
    description: "Autonomous engineering institute with a published CAP admission process.",
    tags: ["Engineering", "Mumbai", "Private"],
    dataStatus: "Official admission source",
    source: {
      label: "Admission information",
      publisher: "Fr. Conceicao Rodrigues College of Engineering",
      url: "https://fragnel.edu.in/index.php?id=672&option=com_content&view=article",
      accessedOn,
    },
    officialUrl: "https://fragnel.edu.in/",
    updatedAt: "Official admission page",
    programs: [
      {
        id: "fcrce-cse",
        name: "B.E. Computer Engineering",
        stream: "Engineering",
        exam: "MHT-CET / JEE Main",
        duration: "4 years",
        feeLabel: "Not published in this record",
        intake: 120,
        intakeYear: "Official subdomain listing",
        source: {
          label: "Courses offered",
          publisher: "Fr. Conceicao Rodrigues College of Engineering",
          url: "https://samay.fragnel.edu.in/",
          accessedOn,
        },
        closingRank: null,
      },
    ],
  },
];

export const streamOptions = ["All streams", "Engineering", "Management", "Commerce", "Arts"] as const;
export const stateOptions = ["All states", "Maharashtra", "Delhi", "Karnataka"] as const;

export function getProgram(programId: string) {
  for (const college of colleges) {
    const program = college.programs.find((item) => item.id === programId);
    if (program) return { college, program };
  }
  return undefined;
}
