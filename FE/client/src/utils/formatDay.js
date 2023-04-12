const formatDate = (str) => {
  const dateString = str;
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Định dạng tháng thành 2 chữ số
  const year = date.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;
  return formattedDate;
};

export default formatDate