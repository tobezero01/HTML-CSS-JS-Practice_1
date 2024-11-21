// Lấy phần tử có class 'container' từ DOM
const container = document.querySelector('.container');
// Lấy tất cả các ghế chưa bị chiếm (có class 'seat' nhưng không có class 'occupied')
const seats = document.querySelectorAll('.row .seat:not(.occupied)');
// Lấy phần tử HTML hiển thị số lượng ghế đã chọn
const count = document.getElementById('count');
// Lấy phần tử HTML hiển thị tổng giá tiền
const total = document.getElementById('total');
// Lấy phần tử <select> để chọn phim
const movieSelect = document.getElementById('movie');

// Gọi hàm để lấy dữ liệu từ LocalStorage và cập nhật giao diện
populateUI();

// Lấy giá vé của bộ phim hiện tại (dùng dấu + để chuyển từ chuỗi sang số)
let ticketPrice = +movieSelect.value;

// Hàm lưu thông tin phim đã chọn (chỉ số và giá vé) vào LocalStorage
function setMovieData(movieIndex, moviePrice) {
  localStorage.setItem('selectedMovieIndex', movieIndex);
  localStorage.setItem('selectedMoviePrice', moviePrice);
}

// Hàm cập nhật số lượng ghế đã chọn và tổng tiền
function updateSelectedCount() {
  // Lấy tất cả các ghế đã chọn (có class 'selected')
  const selectedSeats = document.querySelectorAll('.row .seat.selected');

  // Tạo mảng chứa chỉ số các ghế đã chọn
  const seatsIndex = [...selectedSeats].map(seat => [...seats].indexOf(seat));

  // Lưu danh sách ghế đã chọn vào LocalStorage
  localStorage.setItem('selectedSeats', JSON.stringify(seatsIndex));

  // Đếm số ghế đã chọn
  const selectedSeatsCount = selectedSeats.length;

  // Cập nhật số ghế đã chọn trong giao diện
  count.innerText = selectedSeatsCount;
  // Cập nhật tổng giá tiền trong giao diện
  total.innerText = selectedSeatsCount * ticketPrice;

  // Lưu thông tin phim đã chọn vào LocalStorage
  setMovieData(movieSelect.selectedIndex, movieSelect.value);
}

// Hàm lấy dữ liệu từ LocalStorage và cập nhật giao diện
function populateUI() {
  // Lấy danh sách ghế đã chọn từ LocalStorage
  const selectedSeats = JSON.parse(localStorage.getItem('selectedSeats'));

  // Nếu có dữ liệu ghế đã chọn, cập nhật giao diện
  if (selectedSeats !== null && selectedSeats.length > 0) {
    seats.forEach((seat, index) => {
      if (selectedSeats.indexOf(index) > -1) {
        seat.classList.add('selected');
      }
    });
  }

  // Lấy chỉ số phim đã chọn từ LocalStorage
  const selectedMovieIndex = localStorage.getItem('selectedMovieIndex');

  // Nếu có dữ liệu phim đã chọn, cập nhật chỉ số phim trong <select>
  if (selectedMovieIndex !== null) {
    movieSelect.selectedIndex = selectedMovieIndex;
  }
}

// Sự kiện khi chọn một bộ phim khác
movieSelect.addEventListener('change', e => {
  // Cập nhật giá vé theo phim đã chọn
  ticketPrice = +e.target.value;
  // Lưu thông tin phim đã chọn
  setMovieData(e.target.selectedIndex, e.target.value);
  // Cập nhật số ghế và tổng tiền
  updateSelectedCount();
});

// Sự kiện khi nhấp vào ghế
container.addEventListener('click', e => {
  // Kiểm tra nếu click vào một ghế (có class 'seat' nhưng không bị chiếm)
  if (
    e.target.classList.contains('seat') &&
    !e.target.classList.contains('occupied')
  ) {
    // Thêm hoặc xóa class 'selected' khi ghế được click
    e.target.classList.toggle('selected');

    // Cập nhật số ghế và tổng tiền
    updateSelectedCount();
  }
});

// Gọi hàm để thiết lập số ghế và tổng tiền khi tải trang
updateSelectedCount();
