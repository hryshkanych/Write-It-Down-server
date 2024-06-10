const express = require('express');
const cors = require('cors'); // додайте цей рядок
const bodyParser = require('body-parser'); // Імпортуємо body-parser

const userRouter = require('./routes/userRoutes');
const memoryRouter = require('./routes/memoryRoutes');


const app = express();

app.use(cors({origin: true, credentials: true}));

app.use(express.json());

app.use(bodyParser.json({limit: '50mb', type: 'application/json'}));

app.use('/Users', userRouter);
app.use('/Memories', memoryRouter);

module.exports = app;
