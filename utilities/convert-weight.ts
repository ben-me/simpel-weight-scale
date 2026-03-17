export default function convertWeight(inputValue: string) {
  const converteComma = inputValue.replace(",", ".");
  return Number(converteComma.replace(/[^0-9.]/g, ""));
}
