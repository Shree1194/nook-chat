export const PUBLIC_USER_FIELDS = "_id fullName profilePic";
export const MAX_MESSAGE_LENGTH = 2000;

const OBJECT_ID_PATTERN = /^[a-fA-F0-9]{24}$/;

// Strict 24-hex check. mongoose.isValidObjectId() also accepts any 12-character
// string, which is not an ID we ever issue.
export function isObjectIdString(value) {
  return typeof value === "string" && OBJECT_ID_PATTERN.test(value);
}

/**
 * Returns the cleaned text ("" when absent) or throws a { status, message } object.
 * Rejects non-string values so request bodies such as { text: { $ne: "" } } never reach Mongoose.
 */
export function normalizeMessageText(value) {
  if (value === undefined || value === null) return "";
  if (typeof value !== "string") throw { status: 400, message: "Message text must be a string" };
  const text = value.trim();
  if (text.length > MAX_MESSAGE_LENGTH) {
    throw { status: 400, message: `Message text must be at most ${MAX_MESSAGE_LENGTH} characters` };
  }
  return text;
}
