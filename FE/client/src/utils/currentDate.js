const getCurrentDate = () => {
  var currentDate = new Date();

  // Lấy giờ, phút, giây, ngày, tháng, năm từ đối tượng ngày hiện tại
  var hours = currentDate.getHours();
  var minutes = currentDate.getMinutes();
  var seconds = currentDate.getSeconds();
  var day = currentDate.getDate();
  var month = currentDate.getMonth() + 1;
  var year = currentDate.getFullYear();

  // Định dạng lại chuỗi ngày tháng năm giờ phút giây
  var formattedDate =
    ("0" + hours).slice(-2) +
    ":" +
    ("0" + minutes).slice(-2) +
    ":" +
    ("0" + seconds).slice(-2) +
    " " +
    ("0" + day).slice(-2) +
    ":" +
    ("0" + month).slice(-2) +
    ":" +
    year;

  return formattedDate;
}; // Tạo một đối tượng ngày hiện tại

export default getCurrentDate;