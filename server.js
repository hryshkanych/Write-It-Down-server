const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });
const dbPassword = '';
const db = process.env.DATABASE.replace('<PASSWORD>', dbPassword);
mongoose.connect(db).then(() => {
  console.log('Db connection is successful');
});

const port = 3000;
app.listen(port, () => console.log(`App is running on port ${port}...`));



