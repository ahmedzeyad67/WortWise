const normalizeTextForComparison = (text: string): string => {
  return text.normalize("NFC").trim().toLowerCase();
};

export default normalizeTextForComparison;
