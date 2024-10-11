export const getImageNameFromUrl = (url: string): string => {
  return url.split("/")[6].split(".")[0];
};
