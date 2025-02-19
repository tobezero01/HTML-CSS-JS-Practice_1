// Lấy phần tử HTML có id 'main' để hiển thị danh sách người dùng và tài sản
const main = document.getElementById('main');
// Lấy nút thêm người dùng
const addUserBtn = document.getElementById('add-user');
// Lấy nút để nhân đôi số tiền
const doubleBtn = document.getElementById('double');
// Lấy nút để lọc ra những triệu phú
const showMillionairesBtn = document.getElementById('show-millionaires');
// Lấy nút để sắp xếp người dùng theo số tiền giảm dần
const sortBtn = document.getElementById('sort');
// Lấy nút để tính tổng tài sản của tất cả người dùng
const calculateWealthBtn = document.getElementById('calculate-wealth');

// Mảng lưu trữ dữ liệu người dùng
let data = [];

// Gọi hàm lấy người dùng ngẫu nhiên 4 lần để khởi tạo dữ liệu ban đầu
getRandomUser();
getRandomUser();
getRandomUser();
getRandomUser();

// Thêm các sự kiện click cho các nút chức năng
addUserBtn.addEventListener('click', getRandomUser); // Thêm người dùng mới
doubleBtn.addEventListener('click', doubleMoney); // Nhân đôi tiền
sortBtn.addEventListener('click', sortByRichest); // Sắp xếp theo người giàu nhất
showMillionairesBtn.addEventListener('click', showMillionaires); // Hiển thị triệu phú
calculateWealthBtn.addEventListener('click', calculateWealth); // Tính tổng tài sản

// Hàm lấy thông tin người dùng ngẫu nhiên từ API và thêm vào danh sách
async function getRandomUser() {
  // Gọi API ngẫu nhiên từ Random User
  const res = await fetch(`https://randomuser.me/api`);
  const data = await res.json();

  // Lấy thông tin người dùng đầu tiên từ kết quả API
  const user = data.results[0];

  // Tạo đối tượng người dùng mới với tên và tài sản ngẫu nhiên
  const newUser = {
    name: `${user.name.first} ${user.name.last}`, // Ghép họ và tên
    money: Math.floor(Math.random() * 100000) // Tài sản ngẫu nhiên từ 0 đến 100,000
  };

  // Thêm người dùng vào danh sách
  addData(newUser);
}

// Hàm thêm đối tượng người dùng mới vào mảng data
function addData(obj) {
  data.push(obj); // Đẩy người dùng vào mảng
  updateDOM(); // Cập nhật giao diện
}

// Hàm cập nhật giao diện hiển thị danh sách người dùng và tài sản
function updateDOM(providedData = data) {
  main.innerHTML = '<h2><strong>Person</strong> Wealth</h2>'; // Đặt tiêu đề bảng

  // Lặp qua danh sách người dùng và tạo phần tử HTML để hiển thị
  providedData.forEach((item) => {
    const element = document.createElement('div'); // Tạo thẻ div
    element.classList.add('person'); // Thêm class 'person'
    element.innerHTML = `<strong>${item.name}</strong> ${formatMoney(item.money)}`; // Hiển thị tên và tài sản đã format
    main.appendChild(element); // Thêm vào DOM
  });
}

// Hàm định dạng số thành tiền tệ
function formatMoney(number) {
  return '$' + number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'); // Định dạng thành dạng $1,000.00
}

// Hàm nhân đôi tiền của tất cả người dùng
function doubleMoney() {
  data = data.map(user => {
    return { ...user, money: user.money * 2 }; // Tạo bản sao user với số tiền nhân đôi
  });

  updateDOM(); // Cập nhật giao diện
}

// Hàm sắp xếp người dùng theo tài sản giảm dần
function sortByRichest() {
  data.sort((a, b) => b.money - a.money); // Sắp xếp theo thứ tự giảm dần của tiền
  updateDOM(); // Cập nhật giao diện
}

// Hàm lọc ra những người dùng có tài sản trên 1 triệu
function showMillionaires() {
  data = data.filter(user => user.money > 1000000); // Lọc chỉ giữ lại triệu phú
  updateDOM(); // Cập nhật giao diện
}

// Hàm tính tổng tài sản của tất cả người dùng
function calculateWealth() {
  const wealth = data.reduce((acc, user) => (acc += user.money), 0); // Tính tổng tiền của tất cả người dùng

  // Tạo thẻ div hiển thị tổng tài sản
  const wealthEl = document.createElement('div');
  wealthEl.innerHTML = `<h3>Total Wealth: <strong>${formatMoney(wealth)}</strong></h3>`;
  main.appendChild(wealthEl); // Thêm vào DOM
}
