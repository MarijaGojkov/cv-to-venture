"use server";

import { createClient } from "@/lib/supabase/server";
import { extractCvText } from "@/lib/pdf/extract-text";
import { generateIdea, type IdeaResult } from "@/lib/ai/generate-idea";

const MAX_FILE_BYTES = 4 * 1024 * 1024; // 4 MB

export type IdeaState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | ({ status: "done"; fileName: string; cvChars: number } & IdeaResult);

/**
 * Server Action: CV (PDF) in, business idea (JSON) out.
 * Runs only on the server, so the AI key never reaches the browser.
 */
export async function generateIdeaFromCv(
  _prev: IdeaState,
  formData: FormData,
): Promise<IdeaState> {
  // 1. Only logged-in users. A hidden form is not a security boundary.
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) {
    return { status: "error", message: "Please log in again." };
  }

  // 2. Consent before the CV is processed by AI (GDPR).
  if (formData.get("consent") !== "on") {
    return {
      status: "error",
      message: "Please confirm that your CV may be processed by AI.",
    };
  }

  // 3. Validate the file. Treat everything from the browser as untrusted.
  const file = formData.get("cv");
  if (!(file instanceof File) || file.size === 0) {
    return { status: "error", message: "Choose a PDF file first." };
  }
  if (file.type !== "application/pdf") {
    return { status: "error", message: "The file must be a PDF." };
  }
  if (file.size > MAX_FILE_BYTES) {
    return { status: "error", message: "The PDF is larger than 4 MB." };
  }

  try {
    // 4. PDF -> text.
    const cvText = await extractCvText(file);
    if (cvText.length < 200) {
      return {
        status: "error",
        message:
          "Could not read enough text from this PDF. Is it a scanned image? Try a PDF exported from Word or Google Docs.",
      };
    }

    // 5. Text -> AI -> validated JSON.
    const result = await generateIdea(cvText);
    return {
      status: "done",
      fileName: file.name,
      cvChars: cvText.length,
      ...result,
    };
  } catch (error) {
    console.error("generateIdeaFromCv failed", error);
    return {
      status: "error",
      message: "Something went wrong while generating the idea. Please try again.",
    };
  }
}
