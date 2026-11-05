"use client";

import { useActionState } from "react";
import { generateIdeaFromCv, type IdeaState } from "./idea-actions";
import type { BusinessIdea } from "@/lib/ai/idea-schema";

const initialState: IdeaState = { status: "idle" };

export function CvIdeaForm() {
  const [state, formAction, pending] = useActionState(
    generateIdeaFromCv,
    initialState,
  );

  return (
    <div className="flex flex-col gap-6">
      <form action={formAction} className="flex flex-col gap-4 rounded border p-4">
        <label className="flex flex-col gap-2">
          <span className="font-medium">Your CV (PDF, max 4 MB)</span>
          <input
            type="file"
            name="cv"
            accept="application/pdf"
            required
            className="text-sm"
          />
        </label>
        <label className="flex items-start gap-2 text-sm text-gray-700">
          <input type="checkbox" name="consent" required className="mt-1" />
          <span>
            I agree that the text of my CV is sent to an AI model (Azure OpenAI,
            EU region) to generate a business idea. The file is not stored.
          </span>
        </label>
        <button
          disabled={pending}
          className="self-start rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {pending ? "Reading your CV…" : "Generate business idea"}
        </button>
      </form>

      {state.status === "error" && (
        <p role="alert" className="rounded border border-red-300 bg-red-50 p-3 text-red-800">
          {state.message}
        </p>
      )}

      {state.status === "done" && (
        <IdeaCard
          idea={state.idea}
          source={state.source}
          fileName={state.fileName}
          cvChars={state.cvChars}
        />
      )}
    </div>
  );
}

function IdeaCard({
  idea,
  source,
  fileName,
  cvChars,
}: {
  idea: BusinessIdea;
  source: "azure" | "mock";
  fileName: string;
  cvChars: number;
}) {
  return (
    <article className="flex flex-col gap-4 rounded border p-5">
      <p className="text-xs uppercase tracking-wide text-gray-500">
        {source === "azure"
          ? "AI-generated suggestion. Check the facts before you act on it."
          : "Example idea. No AI model is connected yet, so this is fixed sample data."}
      </p>
      <header>
        <h2 className="text-xl font-semibold">{idea.title}</h2>
        <p className="text-gray-700">{idea.oneLiner}</p>
      </header>
      <Section title="Problem">{idea.problem}</Section>
      <Section title="Solution">{idea.solution}</Section>
      <Section title="Customers">{idea.targetCustomers}</Section>
      <Section title="Business model">{idea.businessModel}</Section>
      <List title="Why you" items={idea.whyYou} />
      <List title="What you are missing" items={idea.skillGaps} />
      <List title="First steps (30 days)" items={idea.firstSteps} ordered />
      <p className="text-xs text-gray-500">
        Read {cvChars.toLocaleString("en")} characters from {fileName}.
      </p>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="font-medium">{title}</h3>
      <p className="text-gray-700">{children}</p>
    </section>
  );
}

function List({
  title,
  items,
  ordered = false,
}: {
  title: string;
  items: string[];
  ordered?: boolean;
}) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <section>
      <h3 className="font-medium">{title}</h3>
      <Tag className={`${ordered ? "list-decimal" : "list-disc"} pl-5 text-gray-700`}>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </Tag>
    </section>
  );
}
