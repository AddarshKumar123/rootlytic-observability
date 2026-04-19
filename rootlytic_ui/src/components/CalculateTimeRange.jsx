export function calculateTimeRange(type) {
  const now = new Date();
  let start;

  switch (type) {
    case "15m":
      start = new Date(now.getTime() - 15 * 60 * 1000);
      break;
    case "30m":
      start = new Date(now.getTime() - 30 * 60 * 1000);
      break;
    case "1h":
      start = new Date(now.getTime() - 60 * 60 * 1000);
      break;
    case "today":
      start = new Date();
      start.setHours(0, 0, 0, 0);
      break;
    case "yesterday":
      start = new Date();
      start.setDate(start.getDate() - 1);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setHours(23, 59, 59, 999);
      return { start, end, label: "Yesterday" };
    default:
      return null;
  }

  return { start:start.toISOString(), end: now.toISOString(), label: type };
}