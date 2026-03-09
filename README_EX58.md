# Exercise 58 - Fashion Management System

## 📋 Project Overview

A complete Fashion Website Management System with:
- **Backend**: NodeJS + ExpressJS + MongoDB (Port: 4000)
- **Admin Frontend**: Angular (Port: 4200)
- **Database**: MongoDB (FashionData)

---

## 🏗️ Architecture

### 1. Database: MongoDB

**Database Name**: `FashionData`

**Collection**: `Fashion`

**Schema**:
```javascript
{
  _id: ObjectId (auto-generated),
  title: String,
  details: String (HTML content),
  thumbnail: String (image URL),
  style: String (Street Style | Trend | Runway),
  createdAt: Date
}
```

**Sample Data**: 15 fashion items across 3 styles
- Street Style: 4 items
- Trend: 4 items
- Runway: 5 items

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB installed and running
- Angular CLI

### Step 1: Start MongoDB

```powershell
# Start MongoDB service (Windows)
net start MongoDB

# Or start MongoDB manually
mongod
```

### Step 2: Install Backend Dependencies

```powershell
cd server-fashion
npm install
```

**Dependencies**:
- express
- mongoose
- cors
- body-parser
- morgan
- nodemon (dev)

### Step 3: Start Backend Server

```powershell
cd server-fashion
npm start

# Or for development with auto-restart:
npm run dev
```

The server will:
- Start on `http://localhost:4000`
- Connect to MongoDB (`mongodb://127.0.0.1:27017/FashionData`)
- Automatically insert sample data if collection is empty

### Step 4: Install Frontend Dependencies (Already done)

```powershell
cd my-exer
npm install quill ngx-quill --legacy-peer-deps
```

### Step 5: Start Angular Application

```powershell
cd my-exer
ng serve

# Or if port 4200 is busy:
ng serve --port 4201
```

The Angular app will start on `http://localhost:4200`

---

## 📂 Project Structure

### Backend (server-fashion/)

```
server-fashion/
├── models/
│   └── Fashion.js          # Mongoose schema
├── routes/
│   └── fashionRoutes.js    # API routes
├── controllers/
│   └── fashionController.js # Business logic
├── server.js               # Main entry point
└── package.json
```

### Frontend (my-exer/src/app/)

```
my-exer/src/app/
├── ex58-fashion-admin/     # Fashion list & management
│   ├── ex58-fashion-admin.ts
│   ├── ex58-fashion-admin.html
│   └── ex58-fashion-admin.css
├── ex58-fashion-form/      # Add/Edit fashion form
│   ├── ex58-fashion-form.ts
│   ├── ex58-fashion-form.html
│   └── ex58-fashion-form.css
├── myservices/
│   └── fashion-apiservice.ts   # API service
└── myclass/
    └── Fashion.ts          # Fashion model
```

---

## 🔌 REST API Endpoints

### Base URL: `http://localhost:4000/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/fashions` | Get all fashions (sorted by date DESC) |
| GET | `/fashions/style/:style` | Filter fashions by style |
| GET | `/fashions/:id` | Get fashion by ID |
| POST | `/fashions` | Create new fashion |
| PUT | `/fashions/:id` | Update fashion |
| DELETE | `/fashions/:id` | Delete fashion |

### Example Requests

**Get all fashions:**
```
GET http://localhost:4000/api/fashions
```

**Filter by style:**
```
GET http://localhost:4000/api/fashions/style/Street Style
GET http://localhost:4000/api/fashions/style/Trend
GET http://localhost:4000/api/fashions/style/Runway
```

**Create new fashion:**
```json
POST http://localhost:4000/api/fashions
Content-Type: application/json

{
  "title": "Summer Collection 2026",
  "details": "<p>Beautiful summer fashion...</p>",
  "thumbnail": "https://example.com/image.jpg",
  "style": "Trend"
}
```

**Update fashion:**
```json
PUT http://localhost:4000/api/fashions/65f1234567890abcdef12345
Content-Type: application/json

{
  "title": "Updated Title",
  "details": "<p>Updated details...</p>"
}
```

**Delete fashion:**
```
DELETE http://localhost:4000/api/fashions/65f1234567890abcdef12345
```

---

## 💻 Admin Features

### Access Admin Panel

1. Login to the application
2. Navigate to: **Ex 58** from the menu
3. URL: `http://localhost:4200/ex58`

### Features

#### 1. Fashion List View
- View all fashions in a table format
- Columns: Thumbnail, Title, Style, Created Date, Actions
- Filter by style (All, Street Style, Trend, Runway)
- Actions: View, Edit, Delete

#### 2. Add New Fashion
- Click "➕ Add New Fashion" button
- Fill in the form:
  - **Title** (required)
  - **Thumbnail URL** (required) - shows live preview
  - **Style** (required) - dropdown selection
  - **Details** (required) - WYSIWYG HTML editor
- Submit to create

#### 3. Edit Fashion
- Click "✏️ Edit" button on any fashion
- Modify fields in the form
- Submit to update

#### 4. View Fashion Details
- Click "👁️ View" button
- Read-only view of all fashion information
- HTML details are rendered properly

#### 5. Delete Fashion
- Click "🗑️ Delete" button
- Confirmation popup: "Are you sure you want to delete...?"
- Confirm to delete

---

## 🎨 WYSIWYG Editor Features

The Details field uses **Quill Editor** with rich formatting:

- **Text Formatting**: Bold, Italic, Underline, Strike
- **Headers**: H1, H2, H3, H4, H5, H6
- **Lists**: Ordered and bullet lists
- **Alignment**: Left, Center, Right
- **Colors**: Text and background colors
- **Links**: Insert hyperlinks
- **Images**: Embed images
- **Code Blocks**: For code snippets
- **Quotes**: Blockquotes

---

## 🎯 Key Functionalities

### Style Categories

1. **Street Style** - Urban fashion, casual wear
2. **Trend** - Current fashion trends, seasonal styles
3. **Runway** - High fashion, designer collections

### Data Validation

- All fields are required
- Title must not be empty
- Thumbnail must be a valid URL
- Style must be one of the three options
- Details must contain HTML content

### User Experience

- **Live thumbnail preview** when entering URL
- **Confirmation dialogs** before deletion
- **Success/Error messages** with auto-dismiss
- **Responsive design** for mobile and desktop
- **Rich text editing** with WYSIWYG editor

---

## 🔧 Configuration

### Backend Configuration

Edit `server-fashion/server.js`:

```javascript
const PORT = 4000; // Change port
const MONGODB_URI = 'mongodb://127.0.0.1:27017/FashionData'; // Change DB
```

### Frontend Configuration

Edit `my-exer/src/app/myservices/fashion-apiservice.ts`:

```typescript
private apiUrl = 'http://localhost:4000/api'; // Change API URL
```

### CORS Configuration

Backend allows requests from:
- `http://localhost:4001`
- `http://localhost:4002`
- `http://localhost:4200`

Add more origins in `server.js`:

```javascript
app.use(cors({
    origin: ['http://localhost:4200', 'http://localhost:4201'],
    credentials: true
}));
```

---

## 📊 Sample Data

The system automatically inserts 15 sample fashion items when the database is empty:

### Street Style (4 items)
- Street Style Paris 2026
- Urban Tokyo Fashion
- New York Street Minimalism
- Berlin Underground Style

### Trend (4 items)
- Sustainable Fashion Revolution
- Digital Fashion & NFTs
- 90s Revival: Grunge Returns
- Gender-Fluid Fashion

### Runway (5 items)
- Paris Fashion Week Highlights
- Milan Runway: Italian Elegance
- New York Fashion Week Drama
- London Avant-Garde Collections
- Copenhagen Fashion Summit

Each item includes:
- Descriptive title
- Rich HTML details with formatting
- High-quality image thumbnail
- Creation date

---

## 🐛 Troubleshooting

### MongoDB Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution**: Start MongoDB service
```powershell
net start MongoDB
```

### Port Already in Use

```
Error: Port 4000 is already in use
```

**Solution**: Change port in `server.js` or kill the process

### CORS Error

```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solution**: Check CORS configuration in `server.js`

### Quill Editor Not Loading

**Solution**: Verify imports in `styles.css`:
```css
@import 'quill/dist/quill.snow.css';
```

---

## 📝 Testing the Application

### 1. Test Backend API

```powershell
# Using curl
curl http://localhost:4000/api/fashions

# Using PowerShell
Invoke-WebRequest -Uri "http://localhost:4000/api/fashions" -Method GET
```

### 2. Test Admin Panel

1. Login to Angular app
2. Navigate to Ex 58
3. Verify fashion list loads
4. Test filtering by style
5. Add new fashion item
6. Edit existing fashion
7. Delete fashion (confirm popup)

---

## 🎓 Learning Objectives

This exercise demonstrates:

✅ RESTful API design with Express
✅ MongoDB integration with Mongoose
✅ CRUD operations (Create, Read, Update, Delete)
✅ Angular HTTP client and services
✅ Component communication and routing
✅ Form handling with NgModel
✅ WYSIWYG HTML editor integration
✅ Responsive UI design
✅ Error handling and validation
✅ User experience best practices

---

## 📦 Dependencies

### Backend
```json
{
  "express": "^4.18.2",
  "mongoose": "^7.6.3",
  "cors": "^2.8.5",
  "body-parser": "^1.20.2",
  "morgan": "^1.10.0",
  "nodemon": "^3.0.1"
}
```

### Frontend
```json
{
  "quill": "latest",
  "ngx-quill": "latest"
}
```

---

## 👨‍💻 Author

Created for On_Class - K23411E
Exercise 58 - Fashion Management System

---

## 📄 License

This project is for educational purposes.

---

## 🎉 Success!

You now have a complete Fashion Management System with:
- ✅ Backend API running on port 4000
- ✅ MongoDB database with sample data
- ✅ Angular admin panel with CRUD operations
- ✅ WYSIWYG editor for rich content
- ✅ Professional UI/UX design

**Happy Coding! 🚀**
