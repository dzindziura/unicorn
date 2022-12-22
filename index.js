const express = require('express');
const cors = require('cors');
const bp = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
require('dotenv').config();

const {SingIn, SingUp, LogOut, Info} = require('./controller/UserController')


const app = express();
mongoose.set("strictQuery", false);
mongoose.connect(
    process.env.MONGOOSE_URL
).then(() => {console.log('DB OK')}
).catch((err) => console.log('DB ERROR', err))

const PORT = process.env.PORT;
const HOST = process.env.HOST;

app.use(cookieParser())
app.use(bp.json())
app.use(cors())
app.use(bp.urlencoded({ extended: false }))
app.use(express.static('public'))

app.get('', (req, res) => {
    res.send('hello')
})

app.post('/signin', SingIn);
app.post('/singup', SingUp)
app.get('/logout/:all', LogOut)
app.get('/info', Info)

app.listen(PORT, () => {
    console.log(`Server is running: http:/${HOST}:${PORT}`)
})