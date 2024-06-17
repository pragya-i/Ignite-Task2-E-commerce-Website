const port = 4000;
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const { types } = require("util");
const { type } = require("os");



app.use(express.json());
app.use(cors());

//Database connection
mongoose.connect('mongodb://127.0.0.1:27017/e-commerce', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

//schema for creating a product

const Product = mongoose.model("Product", {
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    new_price: {
        type: Number,
        required: true,
    },
    old_price: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    available: {
        type: Boolean,
        default: true,
    },


})




//creating API for add product in our database
app.post('/addproduct', async (req, res) => {
    let products = await Product.find({});
    let id;
    if (products.length > 0) {
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id + 1
    }
    else {
        id = 1;
    }
    const product = new Product({
        id: id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price
    });
    console.log(product);
    await product.save();
    console.log("saved");
    res.json({
        success: true,
        name: req.body.name,
    })

})

//creating API to remove product in our database
app.post('/removeproduct', async (req, res) => {
    await Product.findOneAndDelete({ id: req.body.id })
    console.log("removed")
    res.json({
        success: true,
        name: req.body.name,
    })
})

//creating API for get all products
app.get('/allproducts', async (req, res) => {
    let product = await Product.find({});
    console.log("All products fetched")
    res.send(product)
})

//creating newcollections endpoint
app.get('/newcollections', async (req, res) => {
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log('newcollections fetched');
    res.send(newcollection);
})

//creating popularinwomen endpoint
app.get('/popularinwomen', async (req, res) => {
    let products = await Product.find({ category: 'women' });
    let popular_in_women = products.slice(0, 4);
    console.log('popular in women fetched');
    res.send(popular_in_women);
})

//creating middleware fetch user
const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token')
    if (!token) {
        res.status(401).send({ errors: "Please authenticate using vaild token" })
    }
    else {
        try {
            const data = jwt.verify(token, 'secret_ecom');
            req.user = data.user;
            next();
        }
        catch (error) {
            res.status(401).send({ errors: 'Please authenticate using a vaild user' })
        }
    }
}

//creating endpoint for addind product to cartdata
app.post('/addtocart', fetchUser,async (req, res) => {
    console.log('Added',req.body.itemId);
   let userData = await Users.findOne({_id:req.user.id});
   userData.cartData[req.body.itemId] += 1;
   await Users.findByIdAndUpdate({_id:req.user.id},{cartData:userData.cartData});
   res.send('Added');
})

//creating endpoint for remove product from cartdata
app.post('/removefromcart',fetchUser,async (req,res)=>{
    console.log('removed',req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId]>0)
   userData.cartData[req.body.itemId] -= 1
   await Users.findByIdAndUpdate({_id:req.user.id},{cartData:userData.cartData});
   res.send('Removed');
})

//creating endpoint to get cartdata
app.post('/getcart',fetchUser,async (req,res)=>{
    console.log("GetCart");
    let userData = await Users.findOne({_id:req.user.id})
    res.json(userData.cartData);
})

//API creation
app.get('/', (req, res) => {
    res.send("express app is running")
})

//image storage engine
const storage = multer.diskStorage({
    destination: "./upload/images",
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({ storage: storage })

//creating upload endpoint for images
app.use('/images', express.static('upload/images'))

app.post('/upload', upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    })
})

//schema creating for users modal

const Users = mongoose.model('Users', {
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    cartData: {
        type: Object,
    },
    date: {
        type: Date,
        default: Date.now,
    }
})

//creating user register API
app.post('/signup', async (req, res) => {
    let check = await Users.findOne({ email: req.body.email });
    if (check) {
        return res.status(400).json({ success: false, errors: "existing user found with same email address" })
    }
    let cart = {}
    for (let i = 0; i < 300; i++) {
        cart[i] = 0;

    }
    const user = new Users({
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
        cartData: cart
    })
    await user.save();
    const data = {
        user: {
            id: user.id
        }
    }

    const token = jwt.sign(data, 'secret_ecom');
    res.json({ success: true, token })
})

//creating login API
app.post('/login', async (req, res) => {
    let user = await Users.findOne({ email: req.body.email });
    if (user) {
        const passCampare = req.body.password === user.password
        if (passCampare) {
            const data = {
                user: {
                    id: user.id
                }
            }
            const token = jwt.sign(data, 'secret_ecom')
            res.json({ success: true, token })
        }
        else {
            res.json({ success: false, errors: "Wrong Password" })
        }
    }
    else {
        res.json({ success: false, errors: "Wrong Email Id" })
    }
})

app.listen(port, (error) => {
    if (!error) {
        console.log(`server is running on port ${port}`);
    }
    else {
        console.log('error' + error);
    }
})