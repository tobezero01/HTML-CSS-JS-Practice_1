// Lấy các phần tử DOM cần thiết
const wordEl = document.getElementById('word'); // Hiển thị từ cần đoán
const wrongLettersEl = document.getElementById('wrong-letters'); // Hiển thị các chữ cái đoán sai
const playAgainBtn = document.getElementById('play-button'); // Nút chơi lại
const popup = document.getElementById('popup-container'); // Popup hiển thị khi thắng/thua
const notification = document.getElementById('notification-container'); // Thông báo đã đoán chữ cái
const finalMessage = document.getElementById('final-message'); // Thông báo kết quả (thắng/thua)
const finalMessageRevealWord = document.getElementById('final-message-reveal-word'); // Hiển thị từ đúng khi thua
const figureParts = document.querySelectorAll('.figure-part'); // Các phần tử của hình treo cổ

// Mảng chứa các từ cần đoán
const words = [
	'application', 'programming', 'interface', 'wizard',
	'integration', 'abstract', 'enum', 'controller'
];

// Chọn một từ ngẫu nhiên từ mảng
let selectedWord = words[Math.floor(Math.random() * words.length)];

// Trạng thái chơi (playable) và các mảng lưu chữ cái đúng/sai
let playable = true;
const correctLetters = []; // Các chữ cái đoán đúng
const wrongLetters = [];   // Các chữ cái đoán sai

// Hàm hiển thị từ cần đoán, với các chữ cái đúng được lộ diện
function displayWord() {
	wordEl.innerHTML = `
    ${selectedWord
			.split('') // Tách từ thành mảng ký tự
			.map(letter => `
          <span class="letter">
            ${correctLetters.includes(letter) ? letter : ''} <!-- Hiển thị chữ nếu đoán đúng -->
          </span>
        `)
			.join('')} <!-- Gộp các ký tự thành chuỗi -->
  `;

	const innerWord = wordEl.innerText.replace(/[ \n]/g, ''); // Loại bỏ khoảng trắng và xuống dòng
	if (innerWord === selectedWord) {
		// Nếu đoán đúng toàn bộ từ
		finalMessage.innerText = 'Congratulations! You won! 😃';
		finalMessageRevealWord.innerText = '';
		popup.style.display = 'flex'; // Hiển thị popup chúc mừng
		playable = false; // Dừng game
	}
}

// Xử lý sự kiện nhấn phím
window.addEventListener('keydown', e => {
	if (playable) {
		if (e.keyCode >= 65 && e.keyCode <= 90) { // Kiểm tra phím là chữ cái
			const letter = e.key.toLowerCase(); // Chuyển sang chữ thường

			if (selectedWord.includes(letter)) {
				// Nếu từ chứa chữ cái được đoán
				if (!correctLetters.includes(letter)) {
					correctLetters.push(letter); // Thêm vào danh sách chữ đúng
					displayWord(); // Cập nhật hiển thị từ
				} else {
					showNotification(); // Hiển thị thông báo chữ đã đoán
				}
			} else {
				// Nếu từ không chứa chữ cái được đoán
				if (!wrongLetters.includes(letter)) {
					wrongLetters.push(letter); // Thêm vào danh sách chữ sai
					updateWrongLettersEl(); // Cập nhật hiển thị chữ sai
				} else {
					showNotification(); // Hiển thị thông báo chữ đã đoán
				}
			}
		}
	}
});

// Sự kiện click nút chơi lại
playAgainBtn.addEventListener('click', () => {
	playable = true; // Đặt lại trạng thái có thể chơi

	// Làm trống mảng chữ cái đúng/sai
	correctLetters.splice(0);
	wrongLetters.splice(0);

	// Chọn từ mới ngẫu nhiên
	selectedWord = words[Math.floor(Math.random() * words.length)];

	// Hiển thị từ mới và cập nhật trạng thái
	displayWord();
	updateWrongLettersEl();
	popup.style.display = 'none'; // Ẩn popup
});

// Cập nhật hiển thị chữ sai
function updateWrongLettersEl() {
	wrongLettersEl.innerHTML = `
    ${wrongLetters.length > 0 ? '<p>Wrong</p>' : ''} <!-- Hiển thị nếu có chữ sai -->
    ${wrongLetters.map(letter => `<span>${letter}</span>`).join(' ')} <!-- Liệt kê chữ sai -->
  `;

	// Hiển thị các phần của hình treo cổ tương ứng với số lần sai
	figureParts.forEach((part, index) => {
		const errors = wrongLetters.length;
		if (index < errors) {
			part.style.display = 'block'; // Hiển thị phần của hình
		} else {
			part.style.display = 'none'; // Ẩn phần của hình
		}
	});

	// Kiểm tra thua game
	if (wrongLetters.length === figureParts.length) {
		finalMessage.innerText = 'Unfortunately you lost. 😕'; // Thông báo thua
		finalMessageRevealWord.innerText = `...the word was: ${selectedWord}`; // Hiển thị từ đúng
		popup.style.display = 'flex'; // Hiển thị popup
		playable = false; // Dừng game
	}
}

// Hiển thị thông báo chữ đã đoán
function showNotification() {
	notification.classList.add('show'); // Hiển thị thông báo
	setTimeout(() => {
		notification.classList.remove('show'); // Ẩn thông báo sau 2 giây
	}, 2000);
}

// Hiển thị từ đầu tiên khi tải trang
displayWord();
