import * as deepl from "deepl-node";
import getUniqueTranslations from "../utils/get-unique-translations.js";

interface MyMemoryMatch {
  quality?: number;
  translation?: string;
}

interface MyMemoryResponse {
  matches?: MyMemoryMatch[];
  responseStatus?: number;
}

const deepLTranslate = async (text: string): Promise<string> => {
  const authKey = process.env.DEEPL_AUTH_KEY;

  if (!authKey) {
    throw new Error("DEEPL_AUTH_KEY is not configured");
  }

  const client = new deepl.DeepLClient(authKey);
  const result = await client.translateText(text, "de", "en");

  return result.text;
};

const myMemoryTranslate = async (text: string): Promise<MyMemoryResponse> => {
  const params = new URLSearchParams({
    q: text,
    langpair: "de|en",
  });
  const email = process.env.MYMEMORY_EMAIL;

  if (email) {
    params.set("de", email);
  }

  const response = await fetch(
    `https://api.mymemory.translated.net/get?${params}`,
    { signal: AbortSignal.timeout(10_000) },
  );

  if (!response.ok) {
    throw new Error(`MyMemory API error: ${response.status}`);
  }

  const result = (await response.json()) as MyMemoryResponse;

  if (result.responseStatus !== undefined && result.responseStatus !== 200) {
    throw new Error(`MyMemory API error: ${result.responseStatus}`);
  }

  return result;
};

const getTranslations = async (text: string): Promise<string[]> => {
  const [deepLResult, myMemoryResult] = await Promise.allSettled([
    deepLTranslate(text),
    myMemoryTranslate(text),
  ]);

  const translations: string[] = [];

  if (deepLResult.status === "fulfilled") {
    translations.push(deepLResult.value);
  }

  if (myMemoryResult.status === "fulfilled") {
    (myMemoryResult.value.matches ?? []).forEach((match) => {
      if (match.quality !== undefined && match.quality >= 50 && match.translation) {
        translations.push(match.translation);
      }
    });
  }

  const cleanedTranslations: string[] = [];

  translations.forEach((translation) => {
    const cleanedTranslation = translation
      .normalize("NFC")
      .trim()
      .replace(/[.,!?;:\u2026]+$/gu, "")
      .trim()
      .replace(/\s+/gu, " ");
    if (cleanedTranslation) {
      cleanedTranslations.push(cleanedTranslation);
    }
  });

  return getUniqueTranslations([], cleanedTranslations);
};

export default getTranslations;
