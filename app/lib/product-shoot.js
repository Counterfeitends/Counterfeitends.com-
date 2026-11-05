function photos(numbers, alt) {
  return numbers.map((number) => ({
    src: `/products/red-waxed-denim/shoot/IMG_${number}.webp`,
    alt: `${alt} — photo ${number}`,
    width: 1170,
    height: number === 2291 || number === 2292 ? 894 : 1576,
  }));
}

export const productPhotoGroups = [
  {
    label: "Standing and editorial poses",
    photos: photos(
      [2321, 2355, 2317, 2319, 2303, 2312, 2353, 2374, 2375, 2376, 2377, 2388, 2389, 2393, 2397, 2320],
      "Red waxed denim jacket in an expressive outdoor editorial pose",
    ),
  },
  {
    label: "On and inside the car",
    photos: photos(
      [2291, 2292, 2294, 2295, 2296, 2297, 2316, 2336, 2344, 2346, 2347, 2356, 2357, 2360, 2361, 2362, 2363, 2365, 2366, 2370],
      "Red waxed denim jacket styled on and inside a car",
    ),
  },
  {
    label: "Jacket front, back, and construction",
    photos: photos(
      [2379, 2387, 2378, 2380, 2383, 2384, 2386, 2390, 2391],
      "Front, back, and detail view of the red waxed denim jacket",
    ),
  },
];
