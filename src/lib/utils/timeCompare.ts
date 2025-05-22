
export function isOnBefore(num: number) {
  return isOn(num) || isBefore(num)
}

export function isOnAfter(num: number) {
  return isOn(num) || isAfter(num)
}

export function isOn(num: number) {
  return num === 0;
}

export function isBefore(num: number) {
  return num === -1;
}

export function isAfter(num: number) {
  return num === 1;
}