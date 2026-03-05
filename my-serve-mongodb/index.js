const express = require('express');
const app = express();
const port = 3002;
const bcrypt = require('bcrypt');
const cors=require("cors");
const bodyParser=require("body-parser");
const morgan=require("morgan");

// Middleware - phải đặt TRƯỚC tất cả routes
app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
}));
app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// MongoDB Connection
const { MongoClient, ObjectId } = require('mongodb');
const client = new MongoClient("mongodb://127.0.0.1:27017");

let database;
let fashionCollection;
let userCollection;
let productCollection;

async function initDatabase() {
    try {
        await client.connect();
        database = client.db("FashionData");
        fashionCollection = database.collection("Fashion");
        userCollection = database.collection("User");
        productCollection = database.collection("Product");
        console.log("Database connected successfully");
        
        // Thêm dữ liệu mẫu cho Product nếu collection trống
        const count = await productCollection.countDocuments();
        if (count === 0) {
            await insertSampleProducts();
        }
    } catch (error) {
        console.error("Database connection error:", error);
    }
}

// Hàm thêm dữ liệu mẫu
async function insertSampleProducts() {
    const sampleProducts = [
        {
            name: "iPhone 15 Pro Max",
            price: 29990000,
            image: "https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-blue-thumbnew-600x600.jpg",
            description: "iPhone 15 Pro Max 256GB - Titan xanh, chip A17 Pro, camera 48MP",
            category: "Smartphone",
            stock: 50,
            createdAt: new Date()
        },
        {
            name: "Samsung Galaxy S24 Ultra",
            price: 27990000,
            image: "https://cdn.tgdd.vn/Products/Images/42/319665/samsung-galaxy-s24-ultra-grey-thumbnew-600x600.jpg",
            description: "Samsung Galaxy S24 Ultra 12GB/256GB - Titan Gray, S Pen tích hợp",
            category: "Smartphone",
            stock: 45,
            createdAt: new Date()
        },
        {
            name: "MacBook Pro M3",
            price: 42990000,
            image: "https://cdn.tgdd.vn/Products/Images/44/309016/macbook-pro-14-m3-pro-2023-black-thumbnew-600x600.jpg",
            description: "MacBook Pro 14 inch M3 Pro - Space Black, 18GB RAM, 512GB SSD",
            category: "Laptop",
            stock: 30,
            createdAt: new Date()
        },
        {
            name: "iPad Air M2",
            price: 16990000,
            image: "https://cdn.tgdd.vn/Products/Images/522/329143/ipad-air-11-inch-m2-wifi-blue-thumb-600x600.jpg",
            description: "iPad Air 11 inch M2 WiFi 128GB - Xanh, màn hình Liquid Retina",
            category: "Tablet",
            stock: 40,
            createdAt: new Date()
        },
        {
            name: "Apple Watch Series 9",
            price: 10990000,
            image: "https://cdn.tgdd.vn/Products/Images/7077/309312/apple-watch-s9-gps-45mm-vien-nhom-day-cao-su-thumb-600x600.jpg",
            description: "Apple Watch Series 9 GPS 45mm - Dây cao su, màn hình Always-On",
            category: "Smartwatch",
            stock: 60,
            createdAt: new Date()
        },
        {
            name: "AirPods Pro Gen 2",
            price: 5990000,
            image: "https://cdn.tgdd.vn/Products/Images/54/289780/tai-nghe-bluetooth-airpods-pro-gen-2-usb-c-charge-apple-thumb-600x600.jpg",
            description: "AirPods Pro Gen 2 USB-C - Chống ồn chủ động, spatial audio",
            category: "Headphone",
            stock: 80,
            createdAt: new Date()
        },
        {
            name: "Sony WH-1000XM5",
            price: 8990000,
            image: "https://cdn.tgdd.vn/Products/Images/54/313570/tai-nghe-bluetooth-sony-wh-1000xm5-den-thumb-600x600.jpg",
            description: "Sony WH-1000XM5 - Tai nghe chống ồn cao cấp, pin 30 giờ",
            category: "Headphone",
            stock: 35,
            createdAt: new Date()
        },
        {
            name: "Dell XPS 13",
            price: 32990000,
            image: "https://cdn.tgdd.vn/Products/Images/44/325236/dell-xps-13-9340-ultra-7-155h-thumb-600x600.jpg",
            description: "Dell XPS 13 Intel Ultra 7 - 16GB RAM, 512GB SSD, màn hình FHD+",
            category: "Laptop",
            stock: 25,
            createdAt: new Date()
        }
    ];
    
    await productCollection.insertMany(sampleProducts);
    console.log("Sample products inserted successfully");
}

initDatabase();

// Start server
app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
})

app.get("/",(req,res)=>{
    res.send("Fashion API Server - MongoDB")
})

// Fashion APIs
app.get("/fashions", async (req,res)=>{
    try {
        const result = await fashionCollection.find({}).toArray();
        res.send(result);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
})

app.get("/fashions/:id", async (req,res)=>{
    try {
        var o_id = new ObjectId(req.params["id"]);
        const result = await fashionCollection.find({_id:o_id}).toArray();
        res.send(result[0]);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
})

// User Authentication APIs
app.get("/users", async (req, res) => {
    try {
        const users = await userCollection.find({}).toArray();
        // Don't send passwords to client
        const usersWithoutPassword = users.map(user => ({
            _id: user._id,
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            createdAt: user.createdAt
        }));
        res.json({ 
            success: true, 
            count: users.length,
            users: usersWithoutPassword 
        });
    } catch (error) {
        console.error("Get users error:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

app.post("/register", async (req, res) => {
    try {
        console.log("Register - Body:", req.body);
        const username = req.body.username;
        const password = req.body.password;
        const email = req.body.email;
        const fullName = req.body.fullName;
        
        if (!username || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "Username and password are required" 
            });
        }
        
        // Check existing user
        const existingUser = await userCollection.findOne({ username: username });
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: "Username already exists" 
            });
        }
        
        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // Insert new user
        const newUser = {
            username: username,
            password: hashedPassword,
            email: email || '',
            fullName: fullName || '',
            createdAt: new Date()
        };
        
        const result = await userCollection.insertOne(newUser);
        res.json({ 
            success: true, 
            message: "User registered successfully", 
            userId: result.insertedId 
        });
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

app.post("/login", async (req, res) => {
    try {
        console.log("Login - Body:", req.body);
        const username = req.body.username;
        const password = req.body.password;
        
        if (!username || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "Username and password are required" 
            });
        }
        
        // Find user
        const user = await userCollection.findOne({ username: username });
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid username or password" 
            });
        }
        
        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid username or password" 
            });
        }
        
        // Login successful
        res.json({ 
            success: true, 
            message: "Login successful", 
            user: { 
                id: user._id, 
                username: user.username 
            } 
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

var cookieParser = require('cookie-parser');
app.use(cookieParser());

app.get("/create-cookie",cors(),(req,res)=>{
res.cookie("username","tranthibichnga")
res.cookie("password","123456")
account={"username":"tranthibichnga",
"password":"123456"}
res.cookie("account",account)
res.send("cookies are created")
})


app.get("/clear-cookie",cors(),(req,res)=>{
res.clearCookie("account")
res.send("[account] Cookie is removed")
})
app.get("/read-cookie",cors(),(req,res)=>{
//cookie is stored in client, so we use req
username=req.cookies.username
password=req.cookies.password
account=req.cookies.account
infor="username = "+username+"<br/>"
infor+="password = "+password+"<br/>"
if(account!=null)
{
infor+="account.username = "+account.username+"<br/>"
infor+="account.password = "+account.password+"<br/>"
}
res.send(infor)
})


var session = require('express-session');
app.use(session({
    secret: "Shh, its a secret!",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));


app.get("/contact",cors(),(req,res)=>{
if(req.session.visited!=null)
{
req.session.visited++
res.send("You visited this page "+req.session.visited +" times")
}
else
{
req.session.visited=1
res.send("Welcome to this page for the first time!")
}
})

// ==================== PRODUCT APIs ====================
// Get all products
app.get("/api/products", async (req, res) => {
    try {
        const products = await productCollection.find({}).toArray();
        res.json({
            success: true,
            count: products.length,
            products: products
        });
    } catch (error) {
        console.error("Get products error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get product by ID
app.get("/api/products/:id", async (req, res) => {
    try {
        const productId = new ObjectId(req.params.id);
        const product = await productCollection.findOne({ _id: productId });
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        
        res.json({
            success: true,
            product: product
        });
    } catch (error) {
        console.error("Get product error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ==================== CART APIs (Session) ====================
// Add product to cart
app.post("/api/cart/add", async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        
        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required"
            });
        }
        
        // Get product from database
        const product = await productCollection.findOne({ _id: new ObjectId(productId) });
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        
        // Initialize cart if not exists
        if (!req.session.cart) {
            req.session.cart = [];
        }
        
        // Check if product already in cart
        const existingItemIndex = req.session.cart.findIndex(
            item => item.productId === productId
        );
        
        if (existingItemIndex > -1) {
            // Update quantity
            req.session.cart[existingItemIndex].quantity += (quantity || 1);
        } else {
            // Add new item
            req.session.cart.push({
                productId: productId,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity || 1
            });
        }
        
        res.json({
            success: true,
            message: "Product added to cart",
            cart: req.session.cart,
            cartCount: req.session.cart.length
        });
    } catch (error) {
        console.error("Add to cart error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get cart
app.get("/api/cart", (req, res) => {
    try {
        if (!req.session.cart) {
            req.session.cart = [];
        }
        
        // Calculate total
        const total = req.session.cart.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);
        
        res.json({
            success: true,
            cart: req.session.cart,
            cartCount: req.session.cart.length,
            total: total
        });
    } catch (error) {
        console.error("Get cart error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Update cart item quantity
app.put("/api/cart/update/:productId", (req, res) => {
    try {
        const productId = req.params.productId;
        const { quantity } = req.body;
        
        if (!req.session.cart) {
            return res.status(404).json({
                success: false,
                message: "Cart is empty"
            });
        }
        
        const itemIndex = req.session.cart.findIndex(
            item => item.productId === productId
        );
        
        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart"
            });
        }
        
        if (quantity <= 0) {
            // Remove item if quantity is 0 or negative
            req.session.cart.splice(itemIndex, 1);
        } else {
            req.session.cart[itemIndex].quantity = quantity;
        }
        
        // Calculate total
        const total = req.session.cart.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);
        
        res.json({
            success: true,
            message: "Cart updated",
            cart: req.session.cart,
            cartCount: req.session.cart.length,
            total: total
        });
    } catch (error) {
        console.error("Update cart error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Remove product from cart
app.delete("/api/cart/remove/:productId", (req, res) => {
    try {
        const productId = req.params.productId;
        
        if (!req.session.cart) {
            return res.status(404).json({
                success: false,
                message: "Cart is empty"
            });
        }
        
        req.session.cart = req.session.cart.filter(
            item => item.productId !== productId
        );
        
        // Calculate total
        const total = req.session.cart.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);
        
        res.json({
            success: true,
            message: "Product removed from cart",
            cart: req.session.cart,
            cartCount: req.session.cart.length,
            total: total
        });
    } catch (error) {
        console.error("Remove from cart error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Clear entire cart
app.delete("/api/cart/clear", (req, res) => {
    try {
        req.session.cart = [];
        
        res.json({
            success: true,
            message: "Cart cleared",
            cart: [],
            cartCount: 0,
            total: 0
        });
    } catch (error) {
        console.error("Clear cart error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});
