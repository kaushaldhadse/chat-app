const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const User = require('./models/User'); // Path to your User model

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// MongoDB URI
const mongoURI = 'mongodb+srv://kaushaldhadse26:h2yslueH9UBMKJ9j@cluster0.afatl9c.mongodb.net/your-database?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: '5a2cb877472b99634510ed409e370a978ce667eb267b9c238b46a2769637f83379e7bbcfe118dee22392180d3ebddfadf5f0fe959ec4fc87eb270a238e214880',
    resave: false,
    saveUninitialized: true
}));

// Serve static files
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    if (req.session.user) {
        res.sendFile(__dirname + '/public/index.html'); // Chat page
    } else {
        res.redirect('/login'); // Redirect to login if not authenticated
    }
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/public/signup.html');
});

// Authentication routes
app.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.status(201).send('User created');
    } catch (error) {
        res.status(400).send('Error creating user');
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (user && await bcrypt.compare(password, user.password)) {
            req.session.user = user;
            res.status(200).send('Logged in');
        } else {
            res.status(400).send('Invalid credentials');
        }
    } catch (error) {
        res.status(400).send('Error logging in');
    }
});

// WebSocket connection
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
