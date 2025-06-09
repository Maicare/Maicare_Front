export const hslToHex = (h: number, s: number, l: number): string => {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const col = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * col)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

export const pastelHexFromId = (id: number | string): string =>
  hslToHex(((parseInt(id as string, 10) || 1) * 137) % 360, 60, 80);

export const ensureHex = (
  color: string | null | undefined,
  fallbackId: number | string
): string => {
  if (color && color.startsWith("#") && color.length === 7) return color;

  if (color && color.startsWith("hsl")) {
    const [h, s, l] = color.match(/\d+/g)!.map(Number);
    return hslToHex(h, s, l);
  }

  return pastelHexFromId(fallbackId);
};
