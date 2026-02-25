export default function makeFallbackArray(length: number = 1): number[] {
  return [...new Array(length).keys()];
}
