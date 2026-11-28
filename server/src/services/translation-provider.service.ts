import * as deepl from "deepl-node";
import getUniqueTranslations from "../utils/get-unique-translations.js";

let deepLClient: deepl.DeepLClient | undefined;
let configuredAuthKey: string | undefined;

const getDeepLClient = (): deepl.DeepLClient => {
  const authKey = process.env.DEEPL_AUTH_KEY;

  if (!authKey) {
    throw new Error("DEEPL_AUTH_KEY is not configured");
  }

  if (!deepLClient || configuredAuthKey !== authKey) {
    deepLClient = new deepl.DeepLClient(authKey);
    configuredAuthKey = authKey;
  }

  return deepLClient;
};

const cleanTranslation = (translation: string): string =>
  translation
    .normalize("NFC")
    .trim()
    .replace(/[.,!?;:\u2026]+$/gu, "")
    .trim()
    .replace(/\s+/gu, " ");

export const getTranslationsBatch = async (
  texts: string[],
): Promise<string[][]> => {
  if (texts.length === 0) {
    return [];
  }

  try {
    const results = await getDeepLClient().translateText(texts, "de", "en");

    return results.map((result) => {
      const cleanedTranslation = cleanTranslation(result.text);
      return cleanedTranslation
        ? getUniqueTranslations([], [cleanedTranslation])
        : [];
    });
  } catch (error: unknown) {
    console.error("DeepL translation request failed:", error);
    return texts.map(() => []);
  }
};

const getTranslations = async (text: string): Promise<string[]> => {
  const [translations] = await getTranslationsBatch([text]);
  return translations ?? [];
};

export default getTranslations;
