// Lấy các phần tử HTML cần thiết từ DOM để tương tác
const search = document.getElementById('search'), // Ô nhập liệu tìm kiếm món ăn
  submit = document.getElementById('submit'), // Nút submit để tìm kiếm
  random = document.getElementById('random'), // Nút lấy món ngẫu nhiên
  mealsEl = document.getElementById('meals'), // Khu vực hiển thị danh sách món ăn
  resultHeading = document.getElementById('result-heading'), // Phần tiêu đề kết quả tìm kiếm
  single_mealEl = document.getElementById('single-meal'); // Phần hiển thị thông tin chi tiết món ăn

// Hàm tìm kiếm món ăn và lấy dữ liệu từ API
function searchMeal(e) {
  e.preventDefault(); // Ngăn không cho form tải lại trang khi submit

  // Xóa nội dung chi tiết món ăn đang hiển thị
  single_mealEl.innerHTML = '';

  // Lấy giá trị từ ô tìm kiếm
  const term = search.value;

  // Kiểm tra xem ô tìm kiếm có rỗng không
  if (term.trim()) {
    // Gửi yêu cầu đến API để tìm kiếm món ăn theo tên
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then(res => res.json()) // Chuyển đổi kết quả trả về thành JSON
      .then(data => {
        console.log(data); // Log kết quả trả về để kiểm tra

        // Hiển thị tiêu đề kết quả tìm kiếm
        resultHeading.innerHTML = `<h2>Search results for '${term}':</h2>`;

        // Kiểm tra nếu không có kết quả
        if (data.meals === null) {
          resultHeading.innerHTML = `<p>There are no search results. Try again!<p>`;
        } else {
          // Hiển thị danh sách món ăn trong DOM
          mealsEl.innerHTML = data.meals
            .map(
              meal => `
            <div class="meal">
              <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
              <div class="meal-info" data-mealID="${meal.idMeal}">
                <h3>${meal.strMeal}</h3>
              </div>
            </div>
          `
            )
            .join(''); // Kết hợp các món ăn thành một chuỗi HTML
        }
      });

    // Xóa nội dung ô tìm kiếm sau khi gửi
    search.value = '';
  } else {
    alert('Please enter a search term'); // Thông báo nếu ô tìm kiếm rỗng
  }
}

// Hàm lấy thông tin món ăn theo ID
function getMealById(mealID) {
  // Gửi yêu cầu đến API với ID món ăn
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then(res => res.json()) // Chuyển đổi kết quả trả về thành JSON
    .then(data => {
      const meal = data.meals[0]; // Lấy dữ liệu món ăn đầu tiên
      addMealToDOM(meal); // Hiển thị món ăn chi tiết trên DOM
    });
}

// Hàm lấy món ăn ngẫu nhiên từ API
function getRandomMeal() {
  // Xóa nội dung danh sách món ăn và tiêu đề kết quả
  mealsEl.innerHTML = '';
  resultHeading.innerHTML = '';

  // Gửi yêu cầu đến API để lấy món ăn ngẫu nhiên
  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then(res => res.json()) // Chuyển đổi kết quả trả về thành JSON
    .then(data => {
      const meal = data.meals[0]; // Lấy món ăn đầu tiên từ kết quả
      addMealToDOM(meal); // Hiển thị món ăn chi tiết trên DOM
    });
}

// Hàm hiển thị chi tiết món ăn lên DOM
function addMealToDOM(meal) {
  const ingredients = []; // Mảng lưu các nguyên liệu và định lượng

  // Duyệt qua các nguyên liệu và định lượng từ API
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      // Thêm nguyên liệu kèm định lượng vào mảng
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break; // Dừng nếu không còn nguyên liệu nào
    }
  }

  // Thêm thông tin chi tiết món ăn vào DOM
  single_mealEl.innerHTML = `
    <div class="single-meal">
      <h1>${meal.strMeal}</h1>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <div class="single-meal-info">
        ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''} <!-- Hiển thị loại món -->
        ${meal.strArea ? `<p>${meal.strArea}</p>` : ''} <!-- Hiển thị khu vực món -->
      </div>
      <div class="main">
        <p>${meal.strInstructions}</p> <!-- Hướng dẫn nấu món -->
        <h2>Ingredients</h2>
        <ul>
          ${ingredients.map(ing => `<li>${ing}</li>`).join('')} <!-- Danh sách nguyên liệu -->
        </ul>
      </div>
    </div>
  `;
}

// Lắng nghe sự kiện submit trên form tìm kiếm
submit.addEventListener('submit', searchMeal);

// Lắng nghe sự kiện click trên nút random để lấy món ăn ngẫu nhiên
random.addEventListener('click', getRandomMeal);

// Lắng nghe sự kiện click trên danh sách món ăn để lấy chi tiết món ăn theo ID
mealsEl.addEventListener('click', e => {
  const mealInfo = e.composedPath().find(item => {
    if (item.classList) {
      return item.classList.contains('meal-info'); // Kiểm tra nếu phần tử có class "meal-info"
    } else {
      return false;
    }
  });

  if (mealInfo) {
    const mealID = mealInfo.getAttribute('data-mealid'); // Lấy ID món ăn từ thuộc tính
    getMealById(mealID); // Gọi hàm để hiển thị chi tiết món ăn
  }
});
