// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

// Your web app's Firebase configuration
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
const db = getFirestore(app);

// Hàm hiển thị các loại sản phẩm từ "product-types"
async function displayProductTypes() {
  const querySnapshot = await getDocs(collection(db, "product-types"));
  const productTable = document.querySelector('.product-table');

  productTable.innerHTML = '<h2>Danh mục</h2>';  // Tiêu đề bảng

  const productRow = document.createElement('div');
  productRow.className = 'product-row';

  querySnapshot.forEach((doc) => {
    const productType = doc.data();
    const productCell = document.createElement('div');
    productCell.className = 'product-cell';

    productCell.innerHTML = `
      <img src="${productType.imageUrl}" alt="${productType.name}">
      <p>${productType.name}</p>
    `;

    productRow.appendChild(productCell);
  });

  productTable.appendChild(productRow);
}

// Hàm hiển thị sản phẩm từ "product"
async function displayProducts(searchTerm = '') {
  const productsRef = collection(db, "product");
  let q = productsRef;

  if (searchTerm) {
    q = query(productsRef, where('name', '>=', searchTerm), where('name', '<=', searchTerm + '\uf8ff'));
  }

  const querySnapshot = await getDocs(q);
  const productTable = document.getElementById('product-hot');

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
  displayProductTypes();

  // Xóa dữ liệu form sau khi thêm
  document.getElementById('product-form').reset();
});

// Lắng nghe sự kiện nhập vào thanh tìm kiếm
document.getElementById('search-input').addEventListener('input', (e) => {
  const searchTerm = e.target.value.trim();
  displayProducts(searchTerm);
});

// Hiển thị các loại sản phẩm và sản phẩm khi tải trang
displayProductTypes();
displayProducts();
