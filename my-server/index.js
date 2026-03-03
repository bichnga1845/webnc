const express = require('express');
const app = express();
const port = 3000;
const morgan = require("morgan");
const fs = require('fs');
const path = require('path');

app.use(morgan("combined"));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

const cors = require("cors");
app.use(cors());

const bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: '50mb' })); // Increase limit for base64 images
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Path to books JSON file
const booksFilePath = path.join(__dirname, 'books-management.json');

// Helper function to read books from file
function readBooksFromFile() {
  try {
    const data = fs.readFileSync(booksFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, create with default data
    const defaultData = { books: [] };
    fs.writeFileSync(booksFilePath, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
}

// Helper function to write books to file
function writeBooksToFile(data) {
  fs.writeFileSync(booksFilePath, JSON.stringify(data, null, 2));
}

// create default api
app.get('/', (req, res) => {
  res.send('Welcome to <font color="red">K234111E </font> API');
});
app.get("/about", (req, res) => {
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Student Information</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          margin: 0;
          padding: 20px;
        }
        .container {
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          padding: 40px;
          max-width: 500px;
          width: 100%;
        }
        h1 {
          color: #667eea;
          text-align: center;
          margin-bottom: 30px;
          font-size: 28px;
          font-weight: 600;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        tr {
          border-bottom: 1px solid #f0f0f0;
        }
        tr:last-child {
          border-bottom: none;
        }
        th {
          text-align: left;
          padding: 15px;
          color: #667eea;
          font-weight: 600;
          width: 40%;
        }
        td {
          padding: 15px;
          color: #333;
          font-size: 16px;
        }
        .student-id {
          font-weight: bold;
          color: #764ba2;
        }
        .student-name {
          font-weight: 500;
        }
        .avatar {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid #667eea;
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>📚 Thông Tin Sinh Viên</h1>
        <table>
          <tr>
            <th>Avatar:</th>
            <td><img src="/images/nga.jpg" alt="Student Avatar" class="avatar" onerror="this.src='https://via.placeholder.com/150'"></td>
          </tr>
          <tr>
            <th>Mã Sinh Viên:</th>
            <td class="student-id">K234111401</td>
          </tr>
          <tr>
            <th>Họ và Tên:</th>
            <td class="student-name">Trần Thị Bích Nga</td>
          </tr>
        </table>
      </div>
    </body>
    </html>
  `;
  res.send(html);
});

// start server
app.listen(port, () => {
  console.log(`K234111E server is running at http://localhost:${port}`);
});


//ex38 - Book Management with File Storage

// GET all books from file
app.get("/books", cors(), (req, res) => {
  try {
    const data = readBooksFromFile();
    res.send(data.books);
  } catch (error) {
    res.status(500).send({ error: 'Error reading books data' });
  }
});

app.get("/books/:id", cors(), (req, res) => {
  try {
    const data = readBooksFromFile();
    const id = req.params["id"];
    let p = data.books.find(x => x.BookId == id);
    if (p) {
      res.send(p);
    } else {
      res.status(404).send({ error: 'Book not found' });
    }
  } catch (error) {
    res.status(500).send({ error: 'Error reading book data' });
  }
});

app.post("/books", cors(), (req, res) => {
  try {
    const data = readBooksFromFile();
    // Check if BookId already exists
    if (data.books.some(b => b.BookId === req.body.BookId)) {
      return res.status(400).send({ error: 'BookId already exists' });
    }
    data.books.push(req.body);
    writeBooksToFile(data);
    res.send(data.books);
  } catch (error) {
    res.status(500).send({ error: 'Error creating book' });
  }
});

app.put("/books/:id", cors(), (req, res) => {
  try {
    const data = readBooksFromFile();
    const id = req.params["id"];
    let index = data.books.findIndex(x => x.BookId == id);
    if (index !== -1) {
      data.books[index] = req.body;
      writeBooksToFile(data);
      res.send(data.books[index]);
    } else {
      res.status(404).send({ error: "Book not found" });
    }
  } catch (error) {
    res.status(500).send({ error: 'Error updating book' });
  }
});

app.delete("/books/:id", cors(), (req, res) => {
  try {
    const data = readBooksFromFile();
    const id = req.params["id"];
    let index = data.books.findIndex(x => x.BookId == id);
    if (index !== -1) {
      data.books.splice(index, 1);
      writeBooksToFile(data);
      res.send({ message: "Book deleted successfully", books: data.books });
    } else {
      res.status(404).send({ error: "Book not found" });
    }
  } catch (error) {
    res.status(500).send({ error: 'Error deleting book' });
  }
});

app.put("/books",cors(),(req,res)=>{
  book=database.find(x=>x.BookId==req.body.BookId)
  if(book!=null)
  {
    book.BookName=req.body.BookName
    book.Price=req.body.Price
    book.Image=req.body.Image
  }
  res.send(database)
});

app.delete("/books/:id",cors(),(req,res)=>{
  id=req.params["id"]
  database = database.filter(x => x.BookId !== id);
  res.send(database)
});
