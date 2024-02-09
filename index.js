const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dataRoutes = require('./routes/collection');
const environmentRoutes = require('./routes/environment')
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());
app.options('*', cors());
const port = process.env.PORT || 4000;
const mongoDbUri = process.env.MONGODB_URI || '';
app.use(bodyParser.json());

mongoose.Promise = global.Promise;

mongoose.connect(mongoDbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

app.use('/api/data', dataRoutes);
app.use('/api/data', environmentRoutes);


app.listen(port, () => {
    console.log(`Server Started at ${port}`)
})