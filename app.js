
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAhs3M24W62T09sviVORtNoYWmMLo6Fo54",
    authDomain: "shop-9a5be.firebaseapp.com",
    projectId: "shop-9a5be",
    storageBucket: "shop-9a5be.appspot.com",
    messagingSenderId: "817465241049",
    appId: "1:817465241049:web:ef976d9ccf1e21431d3dc8",
    measurementId: "G-DLVYXMMBLC"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

const db = getFirestore(app);

// Hàm thêm dữ liệu vào Firestore
async function addProduct(product) {
  try {
    const docRef = await addDoc(collection(db, "products"), product);
    console.log("Product added with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding product: ", e);
  }
}

// Hàm lấy và hiển thị dữ liệu từ Firestore
async function displayProducts() {
  const querySnapshot = await getDocs(collection(db, "products"));
  const productTable = document.querySelector('.product-table');

  productTable.innerHTML = '';  // Xóa sản phẩm cũ

  querySnapshot.forEach((doc) => {
    const product = doc.data();
    const productCell = document.createElement('div');
    productCell.className = 'product-cell';

    productCell.innerHTML = `
      <img src="${product.imageUrl}" alt="${product.name}">
      <p>${product.name}</p>
      <p>${product.price} VND</p>
    `;

    productTable.appendChild(productCell);
  });
}

// Lắng nghe sự kiện submit từ form và thêm sản phẩm vào Firestore
document.getElementById('product-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Lấy dữ liệu từ form
  const name = document.getElementById('name').value;
  const price = document.getElementById('price').value;
  const manufacturer = document.getElementById('manufacturer').value;
  const imageUrl = document.getElementById('imageUrl').value;
  const quantitySold = document.getElementById('quantitySold').value;

  // Tạo đối tượng sản phẩm
  const newProduct = {
    name,
    price: parseInt(price),
    manufacturer,
    imageUrl,
    quantitySold: parseInt(quantitySold)
  };

  // Thêm sản phẩm vào Firestore
  await addProduct(newProduct);

  // Hiển thị sản phẩm
  displayProducts();

  // Xóa dữ liệu form sau khi thêm
  document.getElementById('product-form').reset();
});

// Hiển thị sản phẩm khi tải trang
displayProducts();
