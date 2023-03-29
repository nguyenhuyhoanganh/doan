const formatTime = (dateString) => {
  const dateObj = new Date(dateString);

  const day = dateObj.getDate().toString().padStart(2, "0");
  const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
  const year = dateObj.getFullYear().toString();
  const hours = dateObj.getHours().toString().padStart(2, "0");
  const minutes = dateObj.getMinutes().toString().padStart(2, "0");

  const formattedDate = `${hours}:${minutes} ${day}/${month}/${year}`;
  return formattedDate; 
};
export default formatTime

