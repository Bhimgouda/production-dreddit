export const calculateRemainingTime = () => {
  // Get the current date and time in UTC
  const now = new Date();

  // Create a new Date object for 12:00 AM UTC
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  tomorrow.setUTCHours(0, 0, 0, 0);

  // Calculate the difference between now and 12:00 AM UTC
  const diff = tomorrow.getTime() - now.getTime();

  // Convert the difference to hours, minutes, and seconds
  const hours = Math.floor(diff / (60 * 60 * 1000));
  const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((diff % (60 * 1000)) / 1000);

  // Format the remaining time as a string in the "23:00:00" format
  const remainingTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;

  return remainingTime;
};
