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
    { id: 1, name: "Điện thoại (iPhone)" },
    { id: 2, name: "Máy tính (MacBook)" },
    { id: 3, name: "Máy tính bảng (iPad)" }
];

let products = [
    { 
        id: 1, 
        name: "iPhone 16 Pro Max 256GB", 
        price: 34990000, 
        categoryId: 1, 
        imageUrl: "https://via.placeholder.com/280",
        description: "Siêu phẩm flagship mới nhất từ Apple sở hữu màn hình lớn hơn, camera zoom quang học 5x cực đỉnh và thời lượng pin vượt trội."
    },
    { 
        id: 2, 
        name: "MacBook Pro M4 14-inch", 
        price: 49990000, 
        categoryId: 2, 
        imageUrl: "https://via.placeholder.com/280",
        description: "Sức mạnh đồ họa đỉnh cao từ chip Apple M4 thế hệ mới, màn hình Liquid Retina XDR siêu sáng phù hợp cho mọi tác vụ chuyên nghiệp."
    },
    { 
        id: 3, 
        name: "iPad Air 6 M2 11-inch", 
        price: 16990000, 
        categoryId: 3, 
        imageUrl: "https://via.placeholder.com/280",
        description: "Mỏng nhẹ, mạnh mẽ vượt trội với chip Apple M2. Hỗ trợ đắc lực cho công việc văn phòng, vẽ sáng tạo và giải trí chất lượng cao."
    }
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
    const { name, price, categoryId, description, imageUrl } = req.body;
    if (!name || !price || !categoryId) {
        return res.status(400).json({ message: "Vui lòng nhập đủ name, price và categoryId!" });
    }
    const newProduct = {
        id: products.length + 1,
        name,
        price: Number(price),
        categoryId: Number(categoryId),
        imageUrl: imageUrl || "https://via.placeholder.com/280",
        description: description || "Sản phẩm chính hãng chất lượng cao đến từ ShopHub."
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

app.listen(PORT, () => console.log(`Server đang chạy tại port: ${PORT}`));