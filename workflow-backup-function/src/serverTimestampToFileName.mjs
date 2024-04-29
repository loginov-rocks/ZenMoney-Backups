export const serverTimestampToFileName = (serverTimestamp) => (
  new Date(serverTimestamp * 1000).toISOString().replace(/[T:.]/g, '-')
);
