// Lấy các phần tử DOM
const rulesBtn = document.getElementById('rules-btn'); // Nút hiển thị quy tắc
const closeBtn = document.getElementById('close-btn'); // Nút đóng quy tắc
const rules = document.getElementById('rules'); // Vùng hiển thị quy tắc
const canvas = document.getElementById('canvas'); // Canvas để vẽ game
const ctx = canvas.getContext('2d'); // Ngữ cảnh 2D để vẽ trên canvas

let score = 0; // Điểm số ban đầu

const brickRowCount = 9; // Số lượng hàng gạch
const brickColumnCount = 5; // Số lượng cột gạch
const delay = 500; // Độ trễ để khởi động lại trò chơi sau khi thắng/thua

// Gán sự kiện bàn phím
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

// Xử lý hiển thị quy tắc
rulesBtn.addEventListener('click', () => rules.classList.add('show'));
closeBtn.addEventListener('click', () => rules.classList.remove('show'));

// Thuộc tính quả bóng
const ball = {
  x: canvas.width / 2, // Vị trí X ban đầu
  y: canvas.height / 2, // Vị trí Y ban đầu
  size: 10, // Kích thước quả bóng
  speed: 4, // Tốc độ bóng
  dx: 4, // Hướng di chuyển theo trục X
  dy: -4, // Hướng di chuyển theo trục Y
  visible: true // Quả bóng có hiển thị hay không
};

// Thuộc tính thanh điều khiển (paddle)
const paddle = {
  x: canvas.width / 2 - 40, // Vị trí X ban đầu
  y: canvas.height - 20, // Vị trí Y ban đầu
  w: 100, // Chiều rộng của paddle
  h: 10, // Chiều cao của paddle
  speed: 8, // Tốc độ di chuyển paddle
  dx: 0, // Dịch chuyển hiện tại (ban đầu bằng 0)
  visible: true // Paddle có hiển thị hay không
};

// Thuộc tính gạch
const brickInfo = {
  w: 70, // Chiều rộng mỗi viên gạch
  h: 20, // Chiều cao mỗi viên gạch
  padding: 10, // Khoảng cách giữa các viên gạch
  offsetX: 45, // Khoảng cách từ viền trái canvas đến hàng gạch
  offsetY: 60, // Khoảng cách từ viền trên canvas đến hàng gạch
  visible: true // Gạch có hiển thị hay không
};

// tạo bảng gach
const bricks = [];
for (let i = 0; i < brickRowCount; i++) {
  bricks[i] = []; // Tạo hàng mới
  for (let j = 0; j < brickColumnCount; j++) {
    // Tính toán vị trí từng viên gạch
    const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
    const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetX;

    bricks[i][j] = { x, y, ...brickInfo };
  }
}


// Vẽ quả bóng
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = ball.visible ? '#0095dd' : 'transparent';
  ctx.fill();
  ctx.closePath();
}

// Vẽ paddle
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h); // Vẽ hình chữ nhật
  ctx.fillStyle = paddle.visible ? '#0095dd' : 'transparent'; // Hiển thị paddle
  ctx.fill();
  ctx.closePath();
}

// Vẽ điểm số
function drawScore() {
  ctx.font = '20px Arial'; // Font chữ
  ctx.fillText(`Score: ${score}`, canvas.width - 100, 30); // Vẽ điểm số tại góc trên bên phải
}

// Vẽ các viên gạch
function drawBricks() {
  bricks.forEach(column => {
    column.forEach(brick => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h); // Vẽ hình chữ nhật cho mỗi viên gạch
      ctx.fillStyle = brick.visible ? '#0095dd' : 'transparent'; // Hiển thị hoặc ẩn gạch
      ctx.fill();
      ctx.closePath();
    });
  });
}

// Di chuyển paddle
function movePaddle() {
  paddle.x += paddle.dx;

  if (paddle.x + paddle.w > canvas.width) {
    paddle.x = canvas.width - paddle.w; // Paddle chạm tường phải
  }
  if (paddle.x < 0) {
    paddle.x = 0; // Paddle chạm tường trái
  }
}

// Di chuyển quả bóng
function moveBall() {
  ball.x += ball.dx; // Cập nhật vị trí theo trục X
  ball.y += ball.dy; // Cập nhật vị trí theo trục Y

  // Va chạm với tường dọc
  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1; // Đổi hướng di chuyển
  }

  // Va chạm với tường ngang
  if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
    ball.dy *= -1; // Đổi hướng di chuyển
  }

  // Va chạm paddle
  if (
    ball.x - ball.size > paddle.x &&
    ball.x + ball.size < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y
  ) {
    ball.dy = -ball.speed; // Đổi hướng lên trên
  }

  // Va chạm với gạch
  bricks.forEach(column => {
    column.forEach(brick => {
      if (brick.visible) {
        if (
          ball.x - ball.size > brick.x &&
          ball.x + ball.size < brick.x + brick.w &&
          ball.y + ball.size > brick.y &&
          ball.y - ball.size < brick.y + brick.h
        ) {
          ball.dy *= -1; // Đổi hướng di chuyển
          brick.visible = false; // Ẩn viên gạch
          increaseScore(); // Tăng điểm
        }
      }
    });
  });

  // Nếu bóng chạm đáy
  if (ball.y + ball.size > canvas.height) {
    showAllBricks(); // Reset các viên gạch
    score = 0; // Reset điểm
  }
}

function increaseScore() {
  score++;

  // Nếu phá hết gạch
  if (score % (brickRowCount * brickColumnCount) === 0) {
    ball.visible = false;
    paddle.visible = false;

    // Restart sau 0.5 giây
    setTimeout(function () {
      showAllBricks();
      score = 0;
      paddle.x = canvas.width / 2 - 40;
      ball.x = canvas.width / 2;
      ball.y = canvas.height / 2;
      ball.visible = true;
      paddle.visible = true;
    }, delay);
  }
}

// Hiển thị lại tất cả các viên gạch
function showAllBricks() {
  bricks.forEach(column => {
    column.forEach(brick => (brick.visible = true));
  });
}

// Vẽ tất cả các thành phần trên canvas
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Xóa canvas

  drawBall(); // Vẽ bóng
  drawPaddle(); // Vẽ paddle
  drawScore(); // Vẽ điểm
  drawBricks(); // Vẽ gạch
}

// Cập nhật trạng thái game
function update() {
  movePaddle(); // Di chuyển paddle
  moveBall(); // Di chuyển bóng
  draw(); // Vẽ lại toàn bộ
  requestAnimationFrame(update); // Gọi lại hàm cập nhật
}

update(); // Bắt đầu game

// Xử lý sự kiện nhấn phím
function keyDown(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    paddle.dx = paddle.speed; // Di chuyển paddle sang phải
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    paddle.dx = -paddle.speed; // Di chuyển paddle sang trái
  }
}

// Xử lý sự kiện thả phím
function keyUp(e) {
  if (
    e.key === 'Right' ||
    e.key === 'ArrowRight' ||
    e.key === 'Left' ||
    e.key === 'ArrowLeft'
  ) {
    paddle.dx = 0; // Dừng paddle
  }
}