import { colleges, type AdmissionBand, type AssessmentExam, type SourceRecord } from "@/data/colleges";

export type AssessmentInput = {
  exam: AssessmentExam;
  rank: number;
  course: string;
  category: string;
  state: string;
};

export type AssessmentMatch = {
  collegeId: string;
  collegeName: string;
  city: string;
  programId: string;
  programName: string;
  closingRank: number | null;
  band: AdmissionBand;
  reason: string;
  dataStatus: string;
  cutoffYear?: number;
  cutoffRound: string;
  cutoffQuota: string;
  source: SourceRecord;
  caveat?: string;
};

function getBand(rank: number, closingRank: number): AdmissionBand {
  if (rank <= closingRank * 0.8) return "Safe";
  if (rank <= closingRank * 1.1) return "Target";
  if (rank <= closingRank * 1.35) return "Ambitious";
  return "Insufficient data";
}

function getReason(rank: number, closingRank: number, band: AdmissionBand) {
  if (band === "Safe") {
    return `Your rank is ahead of the ${closingRank.toLocaleString("en-IN")} historical closing-rank reference.`;
  }
  if (band === "Target") {
    return `Your rank is close to the ${closingRank.toLocaleString("en-IN")} historical closing-rank reference.`;
  }
  if (band === "Ambitious") {
    return "Your rank is beyond the historical reference, but the option can remain aspirational.";
  }
  return "There is not enough comparable evidence for a reliable band.";
}

function routeMatches(programExam: string, exam: AssessmentExam) {
  return programExam.toLowerCase().includes(exam.toLowerCase());
}

export function assessAdmission(input: AssessmentInput): AssessmentMatch[] {
  return colleges
    .flatMap((college) =>
      college.programs
        .filter((program) => {
          const courseMatches =
            input.course === "All courses" ||
            program.name.toLowerCase().includes(input.course.toLowerCase());
          const stateMatches = input.state === "All states" || college.state === input.state;
          return courseMatches && stateMatches && routeMatches(program.exam, input.exam);
        })
        .map((program): AssessmentMatch => {
          const cutoff = program.cutoff;
          const comparableCutoff = cutoff?.exam === input.exam && cutoff.category === input.category ? cutoff : undefined;

          if (!comparableCutoff) {
            return {
              collegeId: college.id,
              collegeName: college.name,
              city: college.city,
              programId: program.id,
              programName: program.name,
              closingRank: null,
              band: "Insufficient data",
              reason: "No official comparable cutoff is published in this MVP dataset for this exam and category.",
              dataStatus: college.dataStatus,
              cutoffRound: "Not reported",
              cutoffQuota: "Not reported",
              source: program.source,
              caveat: "Use the linked institution and official counselling source for current eligibility and cutoffs.",
            };
          }

          const band = getBand(input.rank, comparableCutoff.closingRank);
          return {
            collegeId: college.id,
            collegeName: college.name,
            city: college.city,
            programId: program.id,
            programName: program.name,
            closingRank: comparableCutoff.closingRank,
            band,
            reason: getReason(input.rank, comparableCutoff.closingRank, band),
            dataStatus: college.dataStatus,
            cutoffYear: comparableCutoff.year,
            cutoffRound: comparableCutoff.round,
            cutoffQuota: comparableCutoff.quota,
            source: comparableCutoff.source,
            caveat: comparableCutoff.caveat,
          };
        }),
    )
    .sort((a, b) => (a.closingRank ?? Number.MAX_SAFE_INTEGER) - (b.closingRank ?? Number.MAX_SAFE_INTEGER));
}
