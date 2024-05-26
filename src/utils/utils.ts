export const timerToSMS = (time: number | undefined): string => {
  if (time === undefined) {
    return "0.00";
  }
  const seconds = Math.floor(time / 1000);
  const milliseconds = Math.floor((time % 1000) / 10);
  return `${seconds}.${milliseconds < 10 ? "0" : ""}${milliseconds}`;
};
