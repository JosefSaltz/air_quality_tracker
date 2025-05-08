
export function isOnBefore(num: number) {
  return isOn(num) || isBefore(num)
}

export function isOnAfter(num: number) {
  return isOn(num) || isAfter(num)
}


function isOn(num: number) {
  return num === 0;
}

function isBefore(num: number) {
  return num === -1;
}

function isAfter(num: number) {
  return num === 1;
}