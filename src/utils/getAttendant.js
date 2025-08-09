export const getAttendantName = () => {
  try {
    const rawAttendant = localStorage.getItem("attendant");
    if (!rawAttendant) return "Attendant";
    const parsed = JSON.parse(rawAttendant);
    return parsed?.username || "Attendant";
  } catch {
    localStorage.removeItem("attendant"); // Remove corrupted data
    return "Attendant";
  }
};
