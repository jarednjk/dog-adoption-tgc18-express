const express = require('express');
require('dotenv').config();
const MongoUtil = require('./MongoUtil');
const MONGO_URI = process.env.MONGO_URI;
const cors = require('cors');
const { ObjectId } = require('mongodb');
const bodyParser = require('body-parser');
const app = express();

app.use(cors());
app.use(express.json());

async function main() {

    const db = await MongoUtil.connect(MONGO_URI, "tgc18_dog_adoption");

    app.get('/', (req, res) => {
        res.send('hello');
    })
    app.post('/test', async (req,res)=> {
        try {
            if ( typeof( req.body.dogName) !== 'string' ){
                res.status(500);
                res.send("Error for dogName");
            }
            if ( req.body.gender !== 'male' && req.body.gender !== 'female' ) {
                res.status(500);
                res.send("Error for gender");
            }
            if ( req.body.description.length < 20 ){
                res.status(500);
                res.send("Error for description");
            }
            if ( !(req.body.hdbApproved || !req.body.hdbApproved) ) {
                res.status(500);
                res.send("Error for hdbApproved");
            }
            if ( req.body.hypoallergenic !== true && req.body.hypoallergenic !== false ){
                res.status(500);
                res.send("Error for hypoallergenic");
            }
            if ( req.body.pictureUrl === null ) {
                res.status(500);
                res.send("Error for pictureUrl");
            }
            if ( Array.isArray(req.body.healthStatus) == false && (req.body.healthStatus !== 'vaccinated' || req.body.healthStatus !== 'sterilized' || req.body.healthStatus !== 'microchipped' )) {
                res.status(500);
                res.send("Error for healthStatus");
            }
            if ( Array.isArray(req.body.temperament) == false && (req.body.temperament !== 'good-natured' || req.body.temperament !== 'shy' || req.body.temperament !== 'assertive' || req.body.temperament !== 'aggressive' || req.body.temperament !== 'laidback' || req.body.temperament !== 'playful' || req.body.temperament !== 'active' )) {
                res.status(500);
                res.send("Error for temperament");
            }
            if ( req.body.goodWithKids !== true && req.body.goodWithKids !== false ){
                res.status(500);
                res.send("Error for goodWithKids");
            }
            if ( req.body.goodWithOtherDogs !== true && req.body.goodWithOtherDogs !== false ){
                res.status(500);
                res.send("Error for goodWithOtherDogs");
            }
            if ( req.body.toiletTrained !== true || req.body.toiletTrained !== false ){
                res.status(500);
                res.send("Error for toiletTrained");
            }
            if ( typeof (req.body.owner) !== 'object' && !req.body.owner.ownerName.match(/^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/)) {
                res.status(500);
                res.send("Error for ownerName");
            }

            res.status(200);
            res.send("success");
        }
        catch (e) {
            res.status(500)
            res.send("Error writing")
        }
    })
    app.post('/dog_adoption', async (req, res) => {
        let dogName = req.body.dogName;
        let breed = req.body.breed;
        let gender = req.body.gender;
        let description = req.body.description;
        let dateOfBirth = req.body.dateOfBirth;
        let hdbApproved = req.body.hdbApproved;
        let hypoallergenic = req.body.hypoallergenic;
        let temperament = req.body.temperament;
        let healthStatus = req.body.healthStatus;
        let goodWithKids = req.body.goodWithKids;
        let goodWithOtherDogs = req.body.goodWithOtherDogs;
        let toiletTrained = req.body.toiletTrained;
        let pictureUrl = req.body.pictureUrl;
        let owner = req.body.owner;

        

        let result = await db.collection('dog_adoption').insertOne({
            dogName: dogName,
            breed: breed,
            gender: gender,
            description: description,
            dateOfBirth: dateOfBirth,
            hdbApproved: hdbApproved,
            hypoallergenic: hypoallergenic,
            temperament: temperament,
            healthStatus: healthStatus,
            goodWithKids: goodWithKids,
            goodWithOtherDogs: goodWithOtherDogs,
            toiletTrained: toiletTrained,
            pictureUrl: pictureUrl,
            owner: owner
        })
        res.status(201);
        res.send(result);
    })

    // app.get('/dog_adoption', async(req, res) => {
    //     let criteria = {};

    // })

    app.put('/dog_adoption/:id', async (req, res) => {
        let dogName = req.body.dogName;
        let breed = req.body.breed;
        let gender = req.body.gender;
        let description = req.body.description;
        let dateOfBirth = req.body.dateOfBirth;
        let hdbApproved = req.body.hdbApproved;
        let hypoallergenic = req.body.hypoallergenic;
        let temperament = req.body.temperament;
        let healthStatus = req.body.healthStatus;
        let goodWithKids = req.body.goodWithKids;
        let goodWithOtherDogs = req.body.goodWithOtherDogs;
        let toiletTrained = req.body.toiletTrained;
        let pictureUrl = req.body.pictureUrl;
        let owner = req.body.owner;
        
        let result = await db.collection('dog_adoption').updateOne({
            _id: ObjectId(req.params.id)
        }, {
            '$set': {
                dogName: dogName,
                breed: breed,
                gender: gender,
                description: description,
                dateOfBirth: dateOfBirth,
                hdbApproved: hdbApproved,
                hypoallergenic: hypoallergenic,
                temperament: temperament,
                healthStatus: healthStatus,
                goodWithKids: goodWithKids,
                goodWithOtherDogs: goodWithOtherDogs,
                toiletTrained: toiletTrained,
                pictureUrl: pictureUrl,
                owner: owner
            }
        })
        res.send(result);
    });

    app.delete('/dog_adoption/:id', async (req, res) => {
        let result = await db.collection('dog_adoption').remove({
            _id: ObjectId(req.params.id)
        });
        res.status(200);
        res.send({
            message: 'OK'
        });
    });
};

main();

app.listen(8888, () => {
    console.log('Server has started');
});