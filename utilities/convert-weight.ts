export default function convertWeight(inputValue: string) {
  return Number(inputValue.replace(/[^0-9.]/g, ""));
}
