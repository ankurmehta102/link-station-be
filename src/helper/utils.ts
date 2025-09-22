export const getNextDisplayOrder = <T extends { displayOrder: number }>(
  array: T[],
): number => {
  if (!array.length) return 1;
  return Math.max(...array.map((element) => element.displayOrder)) + 1;
};
