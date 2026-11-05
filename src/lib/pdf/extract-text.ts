import { extractText, getDocumentProxy } from "unpdf";

/** Max characters sent to the model. Keeps cost low and prompts small. */
const MAX_CHARS = 12_000;

/**
 * Extracts plain text from a PDF file on the server.
 *
 * Limitation: a scanned CV (only images, no text layer) returns almost no
 * text. That would need OCR, which is out of scope for now.
 */
export async function extractCvText(file: File): Promise<string> {
  const buffer = new Uint8Array(await file.arrayBuffer());
  const pdf = await getDocumentProxy(buffer);
  const { text } = await extractText(pdf, { mergePages: true });

  // Collapse extra whitespace and cut very long CVs.
  return text.replace(/\s+/g, " ").trim().slice(0, MAX_CHARS);
}
