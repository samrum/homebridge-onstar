export function pause(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
