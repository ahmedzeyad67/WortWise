import mammoth from "mammoth";
import AppError from "./app-error.js";

const getFileExtension = (fileName: string): string => {
  const extensionIndex = fileName.lastIndexOf(".");

  return extensionIndex === -1
    ? ""
    : fileName.slice(extensionIndex).toLowerCase();
};

const extractTxt = (buffer: Buffer): string => {
  let text: string;

  try {
    text = new TextDecoder("utf-8", { fatal: true }).decode(buffer);
  } catch {
    throw new AppError("TXT files must contain valid UTF-8 text", 400);
  }

  if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/u.test(text)) {
    throw new AppError("The uploaded TXT file contains binary data", 400);
  }

  return text;
};

const extractDocx = async (buffer: Buffer): Promise<string> => {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch {
    throw new AppError("The uploaded file is not a valid DOCX document", 400);
  }
};

const extractText = async (file: Express.Multer.File): Promise<string> => {
  const extension = getFileExtension(file.originalname);

  let text: string;

  if (extension === ".txt") {
    text = extractTxt(file.buffer);
  } else if (extension === ".docx") {
    text = await extractDocx(file.buffer);
  } else {
    throw new AppError("Only .txt and .docx files are supported", 400);
  }

  if (!text.trim()) {
    throw new AppError("The uploaded file contains no extractable text", 400);
  }

  return text;
};

export default extractText;
