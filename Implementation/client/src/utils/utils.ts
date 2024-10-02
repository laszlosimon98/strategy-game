export const getImageNameFromUrl = (url: string): string => {
  return url.split("/")[7].split(".")[0];
};
