export function debugCounter(args, label = 'Debug Counter',) {
  console.count(`Running ${label}`);
  if(args?.length) console.log(`Item Count: ${args?.length}`)
  console.log(...args)
}