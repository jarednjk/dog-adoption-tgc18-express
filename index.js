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
    app.post('/test', async (req, res) => {
        try {
            if (!req.body.dogName.match(/^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/)) {
                res.status(404).send('Sorry, field for dogName is incorrect');
            }
            if (req.body.gender !== 'male' && req.body.gender !== 'female') {
                res.status(404).send('Sorry, field for gender is incorrect');
            }
            if (req.body.description.length < 20) {
                res.status(404).send('Sorry, field for description is incorrect');
            }
            if (req.body.hdbApproved !== true && req.body.hdbApproved !== false) {
                res.status(404).send('Sorry, field for hdbApproved is incorrect');
            }
            if (req.body.hypoallergenic !== true && req.body.hypoallergenic !== false) {
                res.status(404).send('Sorry, field for hypoallergenic is incorrect');
            }
            if (req.body.pictureUrl === null) {
                res.status(404).send('Sorry, field for pictureUrl is incorrect');
            }
            // if it is not an array
            // if it is not s, m, v

            if (!Array.isArray(req.body.healthStatus)) {
                // send error if not array
                res.status(404).send('Sorry, field for healthStatus is incorrect');
            } else {
                [...req.body.healthStatus].map(status => {
                    if (!status.includes('sterilized') && !status.includes('vaccinated') && !status.includes('microchipped')) {
                        // send error if not any of the values
                        res.status(404).send('Sorry, field for healthStatus is incorrect');
                    }
                })
            }
            if (!Array.isArray(req.body.temperament) || req.body.temperament.length < 1 || req.body.temperament.length > 4) {
                res.status(404).send('Sorry, field for temperament is incorrect');
            } else {
                [...req.body.temperament].map(t => {
                    if (!t.includes('good-natured') && !t.includes('shy') && !t.includes('assertive') && !t.includes('aggressive') && !t.includes('laidback') && !t.includes('playful') && !t.includes('active')) {
                        res.status(404).send('Sorry, field for temperament is incorrect');
                    }
                })
            }
            if (req.body.goodWithKids !== true && req.body.goodWithKids !== false) {
                res.status(404).send('Sorry, field for goodWithKids is incorrect');
            }
            if (req.body.goodWithOtherDogs !== true && req.body.goodWithOtherDogs !== false) {
                res.status(404).send('Sorry, field for goodWithOtherDogs is incorrect');
            }
            if (req.body.toiletTrained !== true && req.body.toiletTrained !== false) {
                res.status(404).send('Sorry, field for toiletTrained is incorrect');
            }
            if (typeof (req.body.owner) !== 'object' && !req.body.owner.ownerName.match(/^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/)) {
                res.status(404).send('Sorry, field for ownerName is incorrect');
            }

            res.status(200);
            res.send("success");
        }
        catch (e) {
            res.status(500)
            // res.send("Error writing")
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

        let errorMsg = [];


        if (!req.body.dogName.match(/^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/)) {
            errorMsg.push({dogName: `${dogName} is an invalid input`})
            // res.status(406).send('Sorry, field for dogName is incorrect');
        }
        if (req.body.gender !== 'male' && req.body.gender !== 'female') {
            errorMsg.push({gender: `${gender} is an invalid input`})
            // res.status(406).send('Sorry, field for gender is incorrect');
        }
        if (req.body.description.length < 20) {
            errorMsg.push({description: `${description} must be at least 50 characters`})
            // res.status(406).send('Sorry, field for description is incorrect');
        }
        if (req.body.hdbApproved !== true && req.body.hdbApproved !== false) {
            errorMsg.push({hdbApproved: `${hdbApproved} is an invalid input`})
            // res.status(406).send('Sorry, field for hdbApproved is incorrect');
        }
        if (req.body.hypoallergenic !== true && req.body.hypoallergenic !== false) {
            errorMsg.push({hypoallergenic: `${hypoallergenic} is an invalid input`})
            // res.status(406).send('Sorry, field for hypoallergenic is incorrect');
        }
        if (!req.body.pictureUrl.match(/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/)) {
            errorMsg.push({pictureUrl: `${pictureUrl} is an invalid url`})
        }
        // if it is not an array
        // if it is not s, m, v

        if (!Array.isArray(req.body.healthStatus)) {
            // send error if not array
            errorMsg.push({healthStatus: `${healthStatus} is invalid`})
            // res.status(406).send('Sorry, field for healthStatus is incorrect');
        } else {
            [...req.body.healthStatus].map(status => {
                if (!status.includes('sterilized') && !status.includes('vaccinated') && !status.includes('microchipped')) {
                    // send error if not any of the values
                    errorMsg.push({healthStatus: `${healthStatus} is invalid`})
                    // res.status(406).send('Sorry, field for healthStatus is incorrect');
                }
            })
        }
        if (!Array.isArray(req.body.temperament) || req.body.temperament.length < 1 || req.body.temperament.length > 4) {
            errorMsg.push({temperament: `${temperament} is invalid`})
            // res.status(406).send('Sorry, field for temperament is incorrect');
        } else {
            [...req.body.temperament].map(t => {
                if (!t.includes('good-natured') && !t.includes('shy') && !t.includes('assertive') && !t.includes('aggressive') && !t.includes('laidback') && !t.includes('playful') && !t.includes('active')) {
                    errorMsg.push({temperament: `${temperament} is invalid`})
                    // res.status(406).send('Sorry, field for temperament is incorrect');
                }
            })
        }
        if (req.body.goodWithKids !== true && req.body.goodWithKids !== false) {
            errorMsg.push({goodWithKids: `${goodWithKids} is an invalid input`});
            // res.status(406).send('Sorry, field for goodWithKids is incorrect');
        }
        if (req.body.goodWithOtherDogs !== true && req.body.goodWithOtherDogs !== false) {
            errorMsg.push({goodWithOtherDogs: `${goodWithOtherDogs} is an invalid input`})
            // res.status(406).send('Sorry, field for goodWithOtherDogs is incorrect');
        }
        if (req.body.toiletTrained !== true && req.body.toiletTrained !== false) {
            errorMsg.push({toiletTrained: `${toiletTrained} is an invalid input`})
            // res.status(406).send('Sorry, field for toiletTrained is incorrect');
        }
        if (typeof (req.body.owner) !== 'object' && !req.body.owner.ownerName.match(/^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/)) {
            errorMsg.push({ownerName: `${owner.ownerName} is an invalid input`})
            // res.status(406).send('Sorry, field for ownerName is incorrect');
        }

        if (errorMsg && errorMsg.length > 0) {
            res.status(406).json({"Errors": errorMsg});
        } else {
            // db insert
            // success
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
            res.status(200);
            res.send(result);
        }
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
        try {
            let result = await db.collection('dog_adoption').remove({
                _id: ObjectId(req.params.id)
            });
            res.status(200);
            res.send({
                message: 'OK'
            });

        } catch (e) {
            res.status(500);
        }
    });

};

main();

app.listen(8888, () => {
    console.log('Server has started');
});