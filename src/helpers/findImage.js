import { statics } from "../data/staticAssets";
import { dynamicAssets } from "../data/dynamic";
export const staticImageById = (id) => {
  const item = statics.find((item) => item.id === id);
  return item && item[Object.keys(item).find((k) => k !== "id")];
};
export const dynamicImageById = (id) => {
  const item = dynamicAssets.find((item) => item.id === id);
  return item && item[Object.keys(item).find((k) => k !== "id")];
};

