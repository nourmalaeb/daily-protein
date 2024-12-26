import { Item } from '../types';

export const itemsParser = (items: Item[]) => {
  const breakfastItems = items.filter(i => i.meal === 'breakfast');
  const lunchItems = items.filter(i => i.meal === 'lunch');
  const dinnerItems = items.filter(i => i.meal === 'dinner');
  const snacksItems = items.filter(i => i.meal === 'snacks');

  const stats = {
    breakfast: breakfastItems.reduce((a, cv) => a + cv.protein_grams, 0),
    lunch: lunchItems.reduce((a, cv) => a + cv.protein_grams, 0),
    dinner: dinnerItems.reduce((a, cv) => a + cv.protein_grams, 0),
    snacks: snacksItems.reduce((a, cv) => a + cv.protein_grams, 0),
  };

  return {
    breakfastItems,
    lunchItems,
    dinnerItems,
    snacksItems,
    stats,
  };
};

export const formToJSON = (elem: FormData) => {
  const output: {
    [key: string]: string[];
  } = {};
  elem.forEach((value, key) => {
    // Check if property already exist
    if (Object.prototype.hasOwnProperty.call(output, key)) {
      let current = output[key];
      if (!current) return;
      if (!Array.isArray(current)) {
        // If it's not an array, convert it to an array.
        current = output[key] = [current];
      }
      current.push(value.toString()); // Add the new value to the array.
    } else {
      output[key] = [value.toString()];
    }
  });
  return output;
};

export const distanceBetween = (
  pointA: { x: number; y: number },
  pointB: { x: number; y: number }
) => {
  return Math.sqrt(
    (pointA.x - pointB.x) * (pointA.x - pointB.x) +
      (pointA.y - pointB.y) * (pointA.y - pointB.y)
  );
};
