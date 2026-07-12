const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    const now = new Date().toISOString();
    console.log(`[${now}] ${req.method} ${req.url}`);
    next();
});

let categories = [
    { id: 1, name: "Quần áo" },
    { id: 2, name: "Giày dép" }
];

let products = [
    { id: 1, name: "Áo thun ShopHub Unisex", price: 150000, categoryId: 1, image: "https://via.placeholder.com/150" },
    { id: 2, name: "Quần Jean Baggy", price: 290000, categoryId: 1, image: "https://via.placeholder.com/150" },
    { id: 3, name: "Giày Sneaker Trắng v2", price: 450000, categoryId: 2, image: "https://via.placeholder.com/150" }
];

app.get('/api/categories', (req, res) => res.json(categories));

app.get('/api/categories/:id', (req, res) => {
    const category = categories.find(c => c.id === parseInt(req.params.id));
    if (!category) return res.status(404).json({ message: "Không tìm thấy danh mục!" });
    res.json(category);
});

app.post('/api/categories', (req, res) => {
    if (!req.body.name) return res.status(400).json({ message: "Tên không được trống!" });
    const newCat = { id: categories.length + 1, name: req.body.name };
    categories.push(newCat);
    res.status(201).json(newCat);
});

app.get('/api/products', (req, res) => {
    res.json(products);
});

app.get('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).json({ message: "Sản phẩm không tồn tại!" });
    res.json(product);
});

app.post('/api/products', (req, res) => {
    const { name, price, categoryId } = req.body;
    if (!name || !price || !categoryId) {
        return res.status(400).json({ message: "Vui lòng nhập đủ name, price và categoryId!" });
    }
    const newProduct = {
        id: products.length + 1,
        name,
        price: Number(price),
        categoryId: Number(categoryId),
        image: "https://via.placeholder.com/150"
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

app.delete('/api/products/:id', (req, res) => {
    const pIndex = products.findIndex(p => p.id === parseInt(req.params.id));
    if (pIndex === -1) return res.status(404).json({ message: "Không tìm thấy sản phẩm để xóa!" });
    
    const deleted = products.splice(pIndex, 1);
    res.json({ message: "Xóa sản phẩm thành công!", data: deleted[0] });
});

app.use((req, res) => res.status(404).json({ error: "Đường dẫn không tồn tại!" }));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Lỗi Server nội bộ!" });
});

app.listen(PORT, () => console.log(`Server dang chay tai port: ${PORT}`));