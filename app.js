const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const Db = require('./config/mongoose-connection');
const isAuthenticated = require('./controllers/auth');
const productmodel = require('./models/products')
const ownermodel = require('./models/owner')
const usermodel = require('./models/user')
const jwt = require('jsonwebtoken');
// Routes
const loginRouter = require('./router/loginRouter');
const profileRouter = require('./router/profileRouter')
const ownerRouter = require('./router/ownerRouter');
const productRouter = require('./router/productRouter');
const userRouter = require('./router/userRouter');
const registerRouter = require('./router/registerRouter');
const shopRouter = require('./router/shopRouter')
const cartRouter = require('./router/cartRouter')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.set('view engine', 'ejs');

// Routes with authentication check where needed
app.use('/owners', isAuthenticated, ownerRouter);
app.use('/users', isAuthenticated, userRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/profile', isAuthenticated,profileRouter);
app.use('/shop',shopRouter);
app.use('/cart', isAuthenticated,cartRouter);
// app.use('/profile', isAuthenticated ,profileRouter);

app.get('/',async (req, res) => {
    try {
        let token = req.cookies.token
        let products = await productmodel.find(); 
        res.render("home", { products,token});
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Logout route
app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`App listening on Port ${port}`);
});
