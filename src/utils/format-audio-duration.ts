const formatAudioRecordDuration = (ms: number): string => {
    // Calculate total seconds
    const totalSeconds = Math.floor(ms / 1000);

    // Calculate hours, minutes, and seconds
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // Format with leading zeros if necessary
    const formattedHours = hours > 0 ? `${hours}:` : ""; // Only include hours if > 0
    const formattedMinutes = `${hours > 0 ? String(minutes).padStart(2, "0") : minutes}`;
    const formattedSeconds = String(seconds).padStart(2, "0");

    // Combine and return the formatted time
    return `${formattedHours}${formattedMinutes}:${formattedSeconds}`;
};
export {
    formatAudioRecordDuration
}