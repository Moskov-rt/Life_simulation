/** Small shared primitives used by the two fame-career prototypes.
 * Career-specific action math and eligibility rules stay at their call sites.
 */
export interface FameTierDefinition {
  title: string;
  salary: number;
}

export const clampFameCareerMetric = (value: number): number => Math.max(0, Math.min(100, value));

export const updateFameCareerConsistency = (current: number, activity: number, decay: number): number =>
  clampFameCareerMetric(current + (activity > 0 ? Math.min(8, activity) : -decay));

export const evaluateFameCareerTier = (
  score: number,
  definitions: readonly FameTierDefinition[],
  qualifies: (tier: number, score: number) => boolean
): number => {
  for (let tier = definitions.length; tier >= 1; tier -= 1) {
    if (qualifies(tier, score)) return tier;
  }
  return 1;
};

export const fameCareerTierTitle = (tier: number, definitions: readonly FameTierDefinition[]): string =>
  definitions[Math.max(1, Math.min(definitions.length, tier)) - 1].title;

export const fameCareerTierSalary = (tier: number, definitions: readonly FameTierDefinition[]): number =>
  definitions[Math.max(1, Math.min(definitions.length, tier)) - 1].salary;
