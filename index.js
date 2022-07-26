const express = require('express');
require('dotenv').config();
const MongoUtil = require('./MongoUtil');
const MONGO_URI = process.env.MONGO_URI;
const cors = require('cors');
const { ObjectId } = require('mongodb');
const app = express();
let Validation = require('./Validation')

app.use(cors());
app.use(express.json());

async function main() {

    const db = await MongoUtil.connect(MONGO_URI, "tgc18_dog_adoption");

    app.get('/', (req, res) => {
        res.send('hello');
    })

    app.post('/dog_adoption', async (req, res) => {
        let dogName = req.body.dogName;
        let breed = req.body.breed;
        let gender = req.body.gender;
        let description = req.body.description;
        let dateOfBirth = req.body.dateOfBirth;
        let hypoallergenic = req.body.hypoallergenic;
        let temperament = req.body.temperament;
        let healthStatus = req.body.healthStatus;
        let familyStatus = req.body.familyStatus
        let toiletTrained = req.body.toiletTrained;
        let pictureUrl = req.body.pictureUrl;
        let ownerName = req.body.owner.ownerName;
        let email = req.body.owner.email

        let errorTracker = [];

        errorTracker.push(
            Validation.validateDogName(dogName), Validation.validateBreed(breed), Validation.validateEmail(email), Validation.validateGender(gender),
            Validation.validateToiletTrained(toiletTrained), Validation.validateDescription(description), Validation.validateHypoallergenic(hypoallergenic),
            Validation.validateTemperament(temperament), Validation.validateHealthStatus(healthStatus), Validation.validateFamilyStatus(familyStatus),
            Validation.validatePictureUrl(pictureUrl), Validation.validateOwnerName(ownerName), Validation.validateDateOfBirth(dateOfBirth)
        )

        if (errorTracker.includes(false)) {
            res.status(406).json("Errors")
        }
        else {
            let owner = { ownerName, email }

            let result = await db.collection('dog_adoption').insertOne({
                dogName, breed, gender, description, dateOfBirth,
                hypoallergenic, toiletTrained, temperament,
                healthStatus, familyStatus, pictureUrl, owner
            })
            res.status(200).json(result);
        }
    })

    app.post('/dog_adoption/comments/:id', async (req, res) => {
        let _id = new ObjectId();
        let dateOfComment = new Date();
        let username = req.body.username;
        let content = req.body.content;

        let errorMsg = [];

        if (typeof (req.body.username) !== 'string' || !req.body.username.match(/^[A-Za-z]+( [A-Za-z]+)*$/)) {
            errorMsg.push({ username: `${username} is an invalid input` })
        }
        if (typeof (req.body.content) !== 'string') {
            errorMsg.push({ content: `${content} is an invalid input` });
        }

        if (errorMsg && errorMsg.length > 0) {
            res.status(406).json({ "Errors": errorMsg });
        } else {
            let result = await db.collection('dog_adoption').updateOne({
                _id: ObjectId(req.params.id)
            }, {
                '$push': {
                    comments: { _id, username, dateOfComment, content }
                }
            })
            res.status(200).json(result);
        }
    })

    app.get('/dog_adoption', async (req, res) => {
        let criteria = {};

        if (req.query.search) {
            criteria['$or'] = [
                {
                    'dogName': {
                        '$regex': `${req.query.search}`,
                        '$options': 'i'
                    }
                },
                {
                    'breed': {
                        '$regex': `${req.query.search}`,
                        '$options': 'i'
                    }
                },
                {
                    'description': {
                        '$regex': `${req.query.search}`,
                        '$options': 'i'
                    }
                }
            ]
        }

        if (req.query.gender) {
            if (req.query.gender !== 'all') {
                criteria['gender'] = {
                    '$eq': req.query.gender
                }
            } else {
                criteria['gender'] = {
                    '$ne': req.query.gender
                }
            }
        }

        if (req.query.healthStatus) {
            criteria['healthStatus'] = {
                '$all': req.query.healthStatus
            }
        }


        if (req.query.hypoallergenic === 'true') {
            criteria['hypoallergenic'] = {
                '$eq': true
            }
        }
        // req.query.hypoallergenic === 'true' ? criteria.hypoallergenic = {$eq: true} : null;

        if (req.query.familyStatus) {
            // criteria['$and'] = req.query.familyStatus.map(fstatus => { return {"familyStatus": {'$in': [fstatus]}}})
            criteria['familyStatus'] = {
                '$all': req.query.familyStatus
            }
        }

        if (req.query.gteyear && !req.query.lteyear) {
            criteria['dateOfBirth'] = {
                '$gte': req.query.gteyear
            }
        } else if (!req.query.gteyear && req.query.lteyear) {
            criteria['dateOfBirth'] = {
                '$lte': req.query.lteyear
            }
        } else if (req.query.gteyear && req.query.lteyear) {
            criteria['dateOfBirth'] = {
                '$gte': req.query.gteyear,
                '$lte': req.query.lteyear
            }
        }

        if (req.query.temperament) {
            criteria['temperament'] = {
                '$in': req.query.temperament
            }
        }

        let result = await db.collection('dog_adoption').find(criteria).toArray();
        res.status(200).json(result);
    })

    // /dog_adoption/dateOfBirth/asc
    // /dog_adoption/dateOfBirth/desc

    // app.get('/dog_adoption/dateOfBirth/:sortOrder', async (req, res) => {
    //     let criteria = {};

    //     let sortOpt = { "dateOfBirth": req.params.sortOrder === "asc" ? 1 : -1 }

    //     let result = await db.collection('dog_adoption').find(criteria).sort(sortOpt).toArray();

    //     res.status(200).json(result);
    // })

    app.get('/dog_adoption/:id([0-9a-fA-F]{24})', async (req, res) => {
        let result = await db.collection('dog_adoption').findOne(
            {
                _id: ObjectId(req.params.id)
            },
            {
                projection: {
                    dogName: 1,
                    breed: 1,
                    gender: 1,
                    description: 1,
                    dateOfBirth: 1,
                    hypoallergenic: 1,
                    temperament: 1,
                    healthStatus: 1,
                    familyStatus: 1,
                    toiletTrained: 1,
                    pictureUrl: 1,
                    owner: 1
                }
            }
        )
        res.status(200).json(result);
    })

    app.put('/dog_adoption/:id', async (req, res) => {
        let dogName = req.body.dogName;
        let breed = req.body.breed;
        let gender = req.body.gender;
        let description = req.body.description;
        let dateOfBirth = req.body.dateOfBirth;
        let hypoallergenic = req.body.hypoallergenic;
        let temperament = req.body.temperament;
        let healthStatus = req.body.healthStatus;
        let familyStatus = req.body.familyStatus
        let toiletTrained = req.body.toiletTrained;
        let pictureUrl = req.body.pictureUrl;
        let ownerName = req.body.owner.ownerName;
        let email = req.body.owner.email

        let errorTracker = [];

        errorTracker.push(
            Validation.validateDogName(dogName), Validation.validateBreed(breed), Validation.validateEmail(email), Validation.validateGender(gender),
            Validation.validateToiletTrained(toiletTrained), Validation.validateDescription(description), Validation.validateHypoallergenic(hypoallergenic),
            Validation.validateTemperament(temperament), Validation.validateHealthStatus(healthStatus), Validation.validateFamilyStatus(familyStatus),
            Validation.validatePictureUrl(pictureUrl), Validation.validateOwnerName(ownerName), Validation.validateDateOfBirth(dateOfBirth)
        )

        if (errorTracker.includes(false)) {
            res.status(406).json("Errors")
        }
        else {
            let owner = { ownerName, email }

            let result = await db.collection('dog_adoption').updateOne(
                {
                    _id: ObjectId(req.params.id)
                },
                {
                    '$set': {
                        dogName, breed, gender, description, dateOfBirth,
                        hypoallergenic, toiletTrained, temperament,
                        healthStatus, familyStatus, pictureUrl, owner
                    }
                }
            )
            res.status(200).json(result);
        }
    })

    app.delete('/dog_adoption/:id', async (req, res) => {
        try {
            await db.collection('dog_adoption').deleteOne({
                _id: ObjectId(req.params.id)
            });
            res.status(200);
            res.send({
                message: 'OK'
            });

        } catch (e) {
            res.status(500).send("Internal server error. Please contact administrator.");
        }
    })

}

main();

app.listen(process.env.PORT, () => {
    console.log('Server has started');
});