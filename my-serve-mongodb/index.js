const express = require('express');
const app = express();
const port = 3002;
const bcrypt = require('bcrypt');
const cors=require("cors");
const bodyParser=require("body-parser");
const morgan=require("morgan");

// Middleware - phải đặt TRƯỚC tất cả routes
app.use(cors());
app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// MongoDB Connection
const { MongoClient, ObjectId } = require('mongodb');
const client = new MongoClient("mongodb://127.0.0.1:27017");

let database;
let fashionCollection;
let userCollection;

async function initDatabase() {
    try {
        await client.connect();
        database = client.db("FashionData");
        fashionCollection = database.collection("Fashion");
        userCollection = database.collection("User");
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection error:", error);
    }
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
app.use(session({secret: "Shh, its a secret!"}));


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
