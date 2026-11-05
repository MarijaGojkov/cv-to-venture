import { z } from "zod";

/**
 * The fixed shape every business idea must have.
 *
 * The same schema is used twice:
 * 1. It is sent to the model as a JSON schema (structured output),
 *    so the model has to answer in exactly this shape.
 * 2. Zod validates the answer before the app uses it. We never trust
 *    the model's output blindly.
 */
export const BusinessIdeaSchema = z.object({
  title: z.string().describe("Short, catchy name of the business idea"),
  oneLiner: z.string().describe("The idea in one sentence"),
  problem: z.string().describe("Which problem it solves and for whom"),
  solution: z.string().describe("What the product or service is"),
  targetCustomers: z.string().describe("Who pays for it"),
  businessModel: z.string().describe("How it makes money"),
  whyYou: z
    .array(z.string())
    .describe("Concrete parts of the CV that make this person a good founder"),
  skillGaps: z
    .array(z.string())
    .describe("What the founder is missing (skills, co-founder, network)"),
  firstSteps: z
    .array(z.string())
    .describe("3 to 5 concrete first steps for the next 30 days"),
});

export type BusinessIdea = z.infer<typeof BusinessIdeaSchema>;
