const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
require('dotenv').config({path : './.env'});

const auth = require('./routes/auth');
const cinema = require('./routes/cinema');
const theater = require('./routes/theater');
const movie = require('./routes/movie');
const showtime = require('./routes/showtime');

const app = express();

mongoose.set('strictQuery', false);
mongoose
    .connect(process.env.DATABASE, { autoIndex: true })
    .then(() => {
        console.log('mongoose connected!');
    })
    .catch((err) => console.log(err));

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: 'https://cinema-booking-client-mu.vercel.app', credentials: true })); // Allow requests from frontend
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());

app.use('/auth', auth);
app.use('/cinema', cinema);
app.use('/theater', theater);
app.use('/movie', movie);
app.use('/showtime', showtime);

// Route definition should come after app is defined and configured
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`Server started on port ${port}`));
