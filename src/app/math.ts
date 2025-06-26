export function lerp(start: number, end: number, amt: number) {
  return (1 - amt) * start + amt * end;
}

export function remap(
  value: number,
  from1: number,
  to1: number,
  from2: number,
  to2: number
) {
  return ((value - from1) / (to1 - from1)) * (to2 - from2) + from2;
}

export function remapColor(
  value: number,
  fromRange: [number, number],
  toColorStart: [number, number, number],
  toColorEnd: [number, number, number]
) {
  const [from1, to1] = fromRange;
  const r = Math.round(
    remap(value, from1, to1, toColorStart[0], toColorEnd[0])
  );
  const g = Math.round(
    remap(value, from1, to1, toColorStart[1], toColorEnd[1])
  );
  const b = Math.round(
    remap(value, from1, to1, toColorStart[2], toColorEnd[2])
  );
  return `rgb(${r}, ${g}, ${b})`;
}

export function positiveSin(amt: number) {
  return remap(Math.sin(amt), -1, 1, 0, 1);
}

export function positiveCos(amt: number) {
  return remap(Math.sin(amt), -1, 1, 0, 1);
}

export function clamp(min: number, max: number, value: number) {
  return Math.min(Math.max(value, min), max);
}

export function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
