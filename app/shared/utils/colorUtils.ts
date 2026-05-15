const parseHex = (hex: string): { r: number; g: number; b: number } => {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
};

export const hexA = (hex: string, alpha: number): string => {
  const { r, g, b } = parseHex(hex);

  return `rgba(${r},${g},${b},${alpha})`;
};

const mix = (a: string, b: string, weight: number): string => {
  const pa = parseHex(a);
  const pb = parseHex(b);
  const r = Math.round(pa.r + (pb.r - pa.r) * weight);
  const g = Math.round(pa.g + (pb.g - pa.g) * weight);
  const bl = Math.round(pa.b + (pb.b - pa.b) * weight);

  return `rgb(${r},${g},${bl})`;
};

export const lighten = (hex: string, amount: number): string => {
  return mix(hex, '#FFFFFF', amount);
};

export const darken = (hex: string, amount: number): string => {
  return mix(hex, '#000000', amount);
};
