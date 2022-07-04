const express = require('express');
require('dotenv').config();
const MONGO_URI = process.env.MONGO_URI;
const cors = require('cors');
const { objectId } = require('mongodb');
const app = express();

app.use(cors());

async function main() {
    app.get('/', (req, res)=> {
        res.send('hello');
    })
};

main();

app.listen(8888, ()=>{
    console.log('Server has started');
});