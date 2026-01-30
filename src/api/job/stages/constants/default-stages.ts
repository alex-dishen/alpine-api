import { JobStageCategory } from 'src/db/types/db.types';

const STAGE_COLORS = {
  [JobStageCategory.INITIAL]: '#6B7280',
  [JobStageCategory.INTERVIEW]: '#3B82F6',
  [JobStageCategory.POSITIVE]: '#10B981',
  [JobStageCategory.NEGATIVE]: '#EF4444',
};

export const DEFAULT_STAGES = [
  // INITIAL
  { name: 'First apply', color: STAGE_COLORS[JobStageCategory.INITIAL], category: JobStageCategory.INITIAL },
  { name: 'Messaged recruiter', color: STAGE_COLORS[JobStageCategory.INITIAL], category: JobStageCategory.INITIAL },
  { name: 'Reached out to me', color: STAGE_COLORS[JobStageCategory.INITIAL], category: JobStageCategory.INITIAL },
  { name: 'Messaged developer', color: STAGE_COLORS[JobStageCategory.INITIAL], category: JobStageCategory.INITIAL },
  { name: 'Second apply', color: STAGE_COLORS[JobStageCategory.INITIAL], category: JobStageCategory.INITIAL },
  { name: 'Redirected to pipeline', color: STAGE_COLORS[JobStageCategory.INITIAL], category: JobStageCategory.INITIAL },
  // INTERVIEW
  { name: 'Test', color: STAGE_COLORS[JobStageCategory.INTERVIEW], category: JobStageCategory.INTERVIEW },
  { name: 'HR Interview', color: STAGE_COLORS[JobStageCategory.INTERVIEW], category: JobStageCategory.INTERVIEW },
  { name: 'Second HR Interview', color: STAGE_COLORS[JobStageCategory.INTERVIEW], category: JobStageCategory.INTERVIEW },
  { name: 'Code Screening', color: STAGE_COLORS[JobStageCategory.INTERVIEW], category: JobStageCategory.INTERVIEW },
  { name: 'Tech Interview', color: STAGE_COLORS[JobStageCategory.INTERVIEW], category: JobStageCategory.INTERVIEW },
  { name: 'Cultural fit Interview', color: STAGE_COLORS[JobStageCategory.INTERVIEW], category: JobStageCategory.INTERVIEW },
  { name: 'C-level Interview', color: STAGE_COLORS[JobStageCategory.INTERVIEW], category: JobStageCategory.INTERVIEW },
  // POSITIVE
  { name: 'Offered', color: STAGE_COLORS[JobStageCategory.POSITIVE], category: JobStageCategory.POSITIVE },
  { name: 'Signed', color: STAGE_COLORS[JobStageCategory.POSITIVE], category: JobStageCategory.POSITIVE },
  // NEGATIVE
  { name: 'No reply', color: STAGE_COLORS[JobStageCategory.NEGATIVE], category: JobStageCategory.NEGATIVE },
  { name: 'Not hiring', color: STAGE_COLORS[JobStageCategory.NEGATIVE], category: JobStageCategory.NEGATIVE },
  { name: 'Rejected', color: STAGE_COLORS[JobStageCategory.NEGATIVE], category: JobStageCategory.NEGATIVE },
  { name: 'I left', color: STAGE_COLORS[JobStageCategory.NEGATIVE], category: JobStageCategory.NEGATIVE },
  { name: 'I refused', color: STAGE_COLORS[JobStageCategory.NEGATIVE], category: JobStageCategory.NEGATIVE },
];
