const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const fashionRoutes = require('./routes/fashionRoutes');

const app = express();
const PORT = 4000;

// Middleware
app.use(cors({
    origin: ['http://localhost:4001', 'http://localhost:4002', 'http://localhost:4200'],
    credentials: true
}));
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
const MONGODB_URI = 'mongodb://127.0.0.1:27017/FashionData';

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB successfully');
        console.log('Database: FashionData');
        insertSampleData();
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });

// Insert sample data if collection is empty
async function insertSampleData() {
    try {
        const Fashion = require('./models/Fashion');
        const count = await Fashion.countDocuments();
        
        if (count === 0) {
            console.log('Inserting sample fashion data...');
            
            const sampleFashions = [
                // Street Style
                {
                    title: "Street Style Paris 2026",
                    details: "<p>This season's street fashion in Paris showcases bold colors and oversized silhouettes. <strong>Key trends include</strong>:</p><ul><li>Oversized blazers with statement shoulders</li><li>Neon accessories and vibrant bags</li><li>Chunky sneakers paired with elegant dresses</li><li>Layered textures mixing casual and formal</li></ul><p>The Parisian streets are alive with fashion-forward individuals breaking traditional style rules.</p>",
                    thumbnail: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800",
                    style: "Street Style",
                    createdAt: new Date('2026-03-01')
                },
                {
                    title: "Urban Tokyo Fashion",
                    details: "<p>Tokyo's street style continues to push boundaries with <em>avant-garde</em> aesthetics:</p><ul><li>Harajuku-inspired colorful layers</li><li>Techwear meets traditional kimono elements</li><li>Sustainable and upcycled fashion pieces</li><li>Gender-neutral silhouettes</li></ul><p>Tokyo remains the epicenter of experimental street fashion.</p>",
                    thumbnail: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800",
                    style: "Street Style",
                    createdAt: new Date('2026-02-28')
                },
                {
                    title: "New York Street Minimalism",
                    details: "<p>New York's street style embraces <strong>minimalist chic</strong> with a modern twist:</p><ul><li>Monochrome color palettes</li><li>Clean lines and structured tailoring</li><li>Comfortable yet sophisticated athleisure</li><li>Statement coats and outerwear</li></ul><p>Less is more in the bustling streets of NYC.</p>",
                    thumbnail: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800",
                    style: "Street Style",
                    createdAt: new Date('2026-02-25')
                },
                {
                    title: "Berlin Underground Style",
                    details: "<p>Berlin's edgy street fashion reflects its underground culture:</p><ul><li>All-black everything with leather accents</li><li>Industrial and punk influences</li><li>Vintage thrift finds mixed with designer pieces</li><li>Bold accessories and hardware details</li></ul>",
                    thumbnail: "https://images.unsplash.com/photo-1558769132-cb1aea48f434?w=800",
                    style: "Street Style",
                    createdAt: new Date('2026-02-20')
                },
                
                // Trend
                {
                    title: "Sustainable Fashion Revolution",
                    details: "<p><strong>Eco-conscious fashion</strong> is dominating 2026 trends:</p><ul><li>Organic and recycled materials</li><li>Slow fashion movement gaining momentum</li><li>Vintage and second-hand luxury</li><li>Local artisan collaborations</li><li>Carbon-neutral production methods</li></ul><p>Consumers are demanding transparency and sustainability from fashion brands.</p>",
                    thumbnail: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
                    style: "Trend",
                    createdAt: new Date('2026-03-05')
                },
                {
                    title: "Digital Fashion & NFTs",
                    details: "<p>The intersection of <em>technology and fashion</em> is creating new possibilities:</p><ul><li>Virtual clothing for avatars and metaverse</li><li>NFT fashion collectibles</li><li>AR try-on experiences</li><li>Smart fabrics with integrated technology</li><li>3D-printed accessories</li></ul><p>Fashion is entering the digital realm like never before.</p>",
                    thumbnail: "https://images.unsplash.com/photo-1558769132-cb1aea48f434?w=800",
                    style: "Trend",
                    createdAt: new Date('2026-03-03')
                },
                {
                    title: "90s Revival: Grunge Returns",
                    details: "<p>The <strong>90s grunge aesthetic</strong> is making a major comeback:</p><ul><li>Flannel shirts and distressed denim</li><li>Combat boots and chunky platforms</li><li>Slip dresses over t-shirts</li><li>Dark lipstick and minimal makeup</li><li>Vintage band tees</li></ul><p>Nostalgia meets modern interpretation in this trend.</p>",
                    thumbnail: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800",
                    style: "Trend",
                    createdAt: new Date('2026-02-27')
                },
                {
                    title: "Gender-Fluid Fashion",
                    details: "<p>Breaking traditional boundaries with <em>inclusive design</em>:</p><ul><li>Unisex silhouettes and cuts</li><li>Neutral color palettes</li><li>Oversized and fluid fits</li><li>No gender labels in collections</li></ul><p>Fashion is becoming more inclusive and diverse.</p>",
                    thumbnail: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800",
                    style: "Trend",
                    createdAt: new Date('2026-02-22')
                },
                
                // Runway
                {
                    title: "Paris Fashion Week Highlights",
                    details: "<p><strong>Paris Fashion Week 2026</strong> showcased incredible artistry:</p><ul><li>Dramatic silhouettes and sculptural designs</li><li>Luxurious fabrics: silk, velvet, and brocade</li><li>Bold color blocking and prints</li><li>Architectural construction techniques</li><li>Haute couture craftsmanship</li></ul><p>Designers pushed creative boundaries with stunning runway presentations.</p>",
                    thumbnail: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800",
                    style: "Runway",
                    createdAt: new Date('2026-03-08')
                },
                {
                    title: "Milan Runway: Italian Elegance",
                    details: "<p>Milan Fashion Week celebrates <em>timeless Italian sophistication</em>:</p><ul><li>Tailored suits with impeccable fit</li><li>Rich textures and premium materials</li><li>Classic elegance with modern touches</li><li>Refined color palettes</li><li>Attention to every detail</li></ul><p>Italian fashion houses continue to set the standard for luxury.</p>",
                    thumbnail: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800",
                    style: "Runway",
                    createdAt: new Date('2026-03-06')
                },
                {
                    title: "New York Fashion Week Drama",
                    details: "<p><strong>NYFW 2026</strong> brought theatrical presentations:</p><ul><li>Bold statement pieces and avant-garde designs</li><li>Innovative fabric technology</li><li>Diverse model casting and representation</li><li>Sustainable luxury collections</li><li>Celebrity collaborations</li></ul><p>American designers are redefining modern luxury fashion.</p>",
                    thumbnail: "https://images.unsplash.com/photo-1558769132-cb1aea48f434?w=800",
                    style: "Runway",
                    createdAt: new Date('2026-03-04')
                },
                {
                    title: "London Avant-Garde Collections",
                    details: "<p>London Fashion Week embraces <em>experimental design</em>:</p><ul><li>Unconventional materials and techniques</li><li>British heritage meets punk rebellion</li><li>Emerging designer showcases</li><li>Sustainable innovation</li><li>Bold and fearless creativity</li></ul>",
                    thumbnail: "https://images.unsplash.com/photo-1467043153537-a4fba2cd39ef?w=800",
                    style: "Runway",
                    createdAt: new Date('2026-03-02')
                },
                {
                    title: "Copenhagen Fashion Summit",
                    details: "<p>Copenhagen leads in <strong>sustainable runway fashion</strong>:</p><ul><li>Zero-waste pattern cutting</li><li>Biodegradable materials</li><li>Circular fashion models</li><li>Transparency in supply chain</li><li>Scandinavian minimalist aesthetics</li></ul>",
                    thumbnail: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800",
                    style: "Runway",
                    createdAt: new Date('2026-02-26')
                }
            ];
            
            await Fashion.insertMany(sampleFashions);
            console.log('Sample fashion data inserted successfully!');
            console.log(`Total fashions: ${sampleFashions.length}`);
        } else {
            console.log(`Fashion collection already has ${count} documents`);
        }
    } catch (error) {
        console.error('Error inserting sample data:', error);
    }
}

// Routes
app.use('/api', fashionRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Fashion API Server',
        version: '1.0.0',
        port: PORT,
        endpoints: {
            'GET /api/fashions': 'Get all fashions',
            'GET /api/fashions/style/:style': 'Filter by style',
            'GET /api/fashions/:id': 'Get fashion by ID',
            'POST /api/fashions': 'Create new fashion',
            'PUT /api/fashions/:id': 'Update fashion',
            'DELETE /api/fashions/:id': 'Delete fashion'
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n========================================`);
    console.log(`🚀 Fashion API Server is running`);
    console.log(`📍 Port: ${PORT}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`📊 Database: FashionData`);
    console.log(`========================================\n`);
});
