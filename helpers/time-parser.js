export const pad = (n, width, z = 0) => {
  n = n + "";
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};

export const parseSecondsToTime = seconds => {
    if (seconds < 60) return { time: seconds, unit: "שניות" };
    if (seconds < 60 * 60)
      return {
        time: Math.floor(seconds / 60) + ":" + pad(seconds % 60, 2),
        unit: "דקות"
      };
    if (seconds < 60 * 60 * 99)
      return {
        time:
          Math.floor(seconds / (60 * 60)) +
          ":" +
          pad(Math.floor((seconds % (60 * 60)) / 60), 2),
        unit: "שעות"
      };
    return { time: Math.floor(seconds / (60 * 60)), unit: "שעות" };
  };