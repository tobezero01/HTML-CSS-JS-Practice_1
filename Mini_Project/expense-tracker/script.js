// Lấy các phần tử DOM để thao tác với giao diện
const balance = document.getElementById('balance'); // Phần tử hiển thị số dư tổng cộng
const money_plus = document.getElementById('money-plus'); // Phần tử hiển thị tổng thu nhập
const money_minus = document.getElementById('money-minus'); // Phần tử hiển thị tổng chi phí
const list = document.getElementById('list'); // Danh sách các giao dịch
const form = document.getElementById('form'); // Form để thêm giao dịch mới
const text = document.getElementById('text'); // Trường nhập nội dung giao dịch
const amount = document.getElementById('amount'); // Trường nhập số tiền giao dịch

// Lấy danh sách giao dịch từ localStorage (nếu có) và chuyển thành mảng JavaScript
const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));

// Khởi tạo mảng giao dịch, nếu localStorage có dữ liệu thì lấy, ngược lại là mảng rỗng
let transactions =
  localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// Hàm thêm giao dịch mới
function addTransaction(e) {
  e.preventDefault(); // Ngăn chặn hành động mặc định của form (reload trang)

  // Kiểm tra xem trường nhập liệu có trống không
  if (text.value.trim() === '' || amount.value.trim() === '') {
    alert('Please add a text and amount'); // Hiển thị thông báo nếu thiếu thông tin
  } else {
    // Tạo một giao dịch mới với ID ngẫu nhiên, nội dung và số tiền
    const transaction = {
      id: generateID(), // Sinh ID ngẫu nhiên
      text: text.value, // Nội dung giao dịch
      amount: +amount.value // Số tiền giao dịch (chuyển thành số)
    };

    transactions.push(transaction); // Thêm giao dịch vào mảng giao dịch

    addTransactionDOM(transaction); // Hiển thị giao dịch mới trong giao diện

    updateValues(); // Cập nhật số dư, thu nhập và chi phí

    updateLocalStorage(); // Cập nhật localStorage

    // Xóa nội dung trong các trường nhập liệu
    text.value = '';
    amount.value = '';
  }
}

// Hàm sinh ID ngẫu nhiên cho giao dịch
function generateID() {
  return Math.floor(Math.random() * 100000000); // Trả về một số ngẫu nhiên
}

// Hàm hiển thị giao dịch trong danh sách (DOM)
function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? '-' : '+'; // Xác định dấu (+ hoặc -) dựa trên số tiền

  const item = document.createElement('li'); // Tạo phần tử <li> mới

  // Thêm lớp CSS tương ứng (minus hoặc plus) dựa trên giá trị giao dịch
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  // Tạo nội dung cho <li> bao gồm nội dung, số tiền và nút xóa
  item.innerHTML = `
    ${transaction.text} <span>${sign}${Math.abs(
    transaction.amount
  )}</span> <button class="delete-btn" onclick="removeTransaction(${transaction.id
    })">x</button>
  `;

  list.appendChild(item); // Thêm phần tử <li> vào danh sách giao dịch
}

// Hàm cập nhật số dư, thu nhập và chi phí
function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount); // Lấy danh sách số tiền từ các giao dịch

  // Tính tổng số dư
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

  // Tính tổng thu nhập (chỉ các số dương)
  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);

  // Tính tổng chi phí (chỉ các số âm, đổi dấu để hiển thị dương)
  const expense = (
    amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) *
    -1
  ).toFixed(2);

  // Hiển thị các giá trị vừa tính vào giao diện
  balance.innerText = `$${total}`;
  money_plus.innerText = `$${income}`;
  money_minus.innerText = `$${expense}`;
}

// Hàm xóa giao dịch theo ID
function removeTransaction(id) {
  // Lọc bỏ giao dịch có ID trùng với ID được chỉ định
  transactions = transactions.filter(transaction => transaction.id !== id);

  updateLocalStorage(); // Cập nhật lại localStorage sau khi xóa

  init(); // Khởi động lại giao diện
}

// Hàm cập nhật localStorage
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions)); // Lưu mảng giao dịch vào localStorage
}

// Hàm khởi tạo ứng dụng
function init() {
  list.innerHTML = ''; // Xóa danh sách giao dịch trên giao diện

  transactions.forEach(addTransactionDOM); // Hiển thị lại tất cả giao dịch
  updateValues(); // Cập nhật số dư, thu nhập và chi phí
}

// Gọi hàm khởi tạo
init();

// Thêm sự kiện submit form để thêm giao dịch mới
form.addEventListener('submit', addTransaction);
