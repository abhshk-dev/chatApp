export const isURL = (url) => {
  try {
    return Boolean(new URL(url));
  } catch (e) {
    return false;
  }
};

export const isImageURL = (url) => {
  return /\.(jpg|gif|png)$/.test(url);
};

export function guessContentType(type) {
  if (isImageURL(type)) return "image";
  if (isURL(type)) return "link";
  return "text";
}
