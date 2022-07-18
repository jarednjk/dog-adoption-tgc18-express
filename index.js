const express = require('express');
require('dotenv').config();
const MongoUtil = require('./MongoUtil');
const MONGO_URI = process.env.MONGO_URI;
const cors = require('cors');
const { ObjectId } = require('mongodb');
const app = express();

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

        let errorMsg = [];
        
        if (typeof (dogName) !== 'string' || !dogName.match(/^[A-Za-z]+( [A-Za-z]+)*$/)) {
            errorMsg.push({ dogName: `${dogName} is an invalid input` })
        }
        if (typeof (breed) !== 'string' || !breed.match(/^[A-Za-z]+( [A-Za-z]+)*$/)) {
            errorMsg.push({ breed: `${breed} is an invalid input` })
        }
        if (typeof (dateOfBirth) !== 'string' || !dateOfBirth.match(/^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/)) {
            errorMsg.push({ dateOfBirth: `${dateOfBirth} is an invalid input`})
        }
        if (gender !== 'male' && gender !== 'female') {
            errorMsg.push({ gender: `${gender} is an invalid input` });
        }
        if (typeof (description) !== 'string' || description.length < 50) {
            errorMsg.push({ description: `${description} must be at least 50 characters` });
        }

        if (hypoallergenic !== true && hypoallergenic !== false) {
            errorMsg.push({ hypoallergenic: `${hypoallergenic} is an invalid input` });
        }
        if (!pictureUrl.match(/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/)) {
            errorMsg.push({ pictureUrl: `${pictureUrl} is an invalid url` });
        }

        if (toiletTrained !== true && toiletTrained !== false) {
            errorMsg.push({ toiletTrained: `${toiletTrained} is an invalid input` });
        }
        // if it is not an array
        // if it is not s, m, v

        if (!Array.isArray(healthStatus)) {
            // send error if not array
            errorMsg.push({ healthStatus: `${healthStatus} is invalid` });
        } else {
            [...healthStatus].map(hstatus => {
                if (!hstatus.includes('sterilized') && !hstatus.includes('vaccinated') && !hstatus.includes('microchipped')) {
                    // send error if not any of the values
                    errorMsg.push({ healthStatus: `${healthStatus} is invalid` });
                }
            })
        }

        if (!Array.isArray(familyStatus)) {
            // send error if not array
            errorMsg.push({ familyStatus: `${familyStatus} is invalid` });
        } else {
            [...familyStatus].map(fstatus => {
                if (!fstatus.includes('hdbApproved') && !fstatus.includes('goodWithKids') && !fstatus.includes('goodWithOtherDogs')) {
                    // send error if not any of the values
                    errorMsg.push({ familyStatus: `${familyStatus} is invalid` });
                }
            })
        }

        if (!Array.isArray(temperament) || temperament.length < 1 || temperament.length > 3) {
            errorMsg.push({ temperament: `${temperament} is invalid` });
        } else {
            [...temperament].map(t => {
                if (!t.includes('good-natured') && !t.includes('shy') && !t.includes('assertive') && !t.includes('aggressive') && !t.includes('laidback') && !t.includes('playful') && !t.includes('active')) {
                    errorMsg.push({ temperament: `${temperament} is invalid` });
                }
            })
        }

        if (typeof (ownerName) !== 'string' || !ownerName.match(/^[A-Za-z]+( [A-Za-z]+)*$/)) {
            errorMsg.push({ ownerName: `${ownerName} is an invalid input` });
        }
        if (typeof (email) !== 'string' || !email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
            errorMsg.push({ email: `${email} is an invalid input` });
        }

        if (errorMsg && errorMsg.length > 0) {
            res.status(406).json({ "Errors": errorMsg });
        } else {
            
            let owner = {ownerName, email}

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
                    comments: {_id, username, dateOfComment, content}
                }
            })
            res.status(200).json(result);
        }
    })

    app.get('/dog_adoption', async (req, res) => {
        let criteria = {
            // $and : []
        };
        

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
// change to eq for gender
        // if (req.query.gender) {
        //     criteria['gender'] = {
        //         '$in': [req.query.gender]
        //     }
        // }

        if (req.query.healthStatus) {
           criteria['$and'] = req.query.healthStatus.map(hstatus => { return {"healthStatus": {'$in': [hstatus]}}})
           criteria['healthStatus'] = {
            $all: req.query.healthStatus
           }
        };

        // if (req.query.hypoallergenic) {
        //     criteria['hypoallergenic'] = {
        //         '$eq': req.query.hypoallergenic === 'true'? true : false
        //     }
        // };

        // if (req.query.toiletTrained) {
        //     criteria['toiletTrained'] = {
        //         '$eq': req.query.toiletTrained === 'true'? true : false
        //     }
        // };

        if (req.query.familyStatus) {
            // criteria['$and'] = req.query.familyStatus.map(fstatus => { return {"familyStatus": {'$in': [fstatus]}}})

            // criteria['$and'].push( {"familyStatus": {'$in': [ req.query.familyStatus[0] ]}}  )

            criteria['familyStatus'] = {
                $all: req.query.familyStatus
            }

        }
        
        // if (req.query.temperament) {
        //     criteria['temperament'] = {
        //         '$in': [req.query.temperament]
        //     }
        // }
        // criteria = {
        //     $and : [{
        //         healthStatus : [
        //             { '$in': [ 'microchipped' ] },
        //             { '$in': [ 'sterilized' ] }
        //         ]
        //     }
        //     ]
        // }
        // console.log(criteria.$and[0].healthStatus, criteria.$and[1].healthStatus)
console.log(criteria)
        let result = await db.collection('dog_adoption').find(criteria).toArray();
        // console.log(result)
        res.status(200).json(result);
    })

    // /dog_adoption/dateOfBirth/asc
    // /dog_adoption/dateOfBirth/desc

    app.get('/dog_adoption/dateOfBirth/:sortOrder', async (req, res) => {
        let criteria = {};

        if (req.query.breed) {
            criteria['breed'] = {
                '$regex': req.query.breed, $options: 'i'
            }
        }
// change to eq for gender
        if (req.query.gender) {
            criteria['gender'] = {
                '$in': [req.query.gender]
            }
        };

        if (req.query.healthStatus) {
            criteria['healthStatus'] = {
                '$in': [req.query.healthStatus]
            }
        };

        if (req.query.temperament) {
            criteria['temperament'] = {
                '$in': [req.query.temperament]
            }
        }

        if (req.query.familyStatus) {
            criteria['familyStatus'] = {
                '$in': [req.query.familyStatus]
            }
        }

        let sortOpt = {"dateOfBirth": req.params.sortOrder === "asc" ? 1 : -1}

        let result = await db.collection('dog_adoption').find(criteria).sort(sortOpt).toArray();

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

        let errorMsg = [];
        
        if (typeof (dogName) !== 'string' || !dogName.match(/^[A-Za-z]+( [A-Za-z]+)*$/)) {
            errorMsg.push({ dogName: `${dogName} is an invalid input` })
        }
        if (typeof (breed) !== 'string' || !breed.match(/^[A-Za-z]+( [A-Za-z]+)*$/)) {
            errorMsg.push({ breed: `${breed} is an invalid input` })
        }
        if (typeof (dateOfBirth) !== 'string' || !dateOfBirth.match(/^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/)) {
            errorMsg.push({ dateOfBirth: `${dateOfBirth} is an invalid input`})
        }
        if (gender !== 'male' && gender !== 'female') {
            errorMsg.push({ gender: `${gender} is an invalid input` });
        }
        if (typeof (description) !== 'string' || description.length < 50) {
            errorMsg.push({ description: `${description} must be at least 50 characters` });
        }

        if (hypoallergenic !== true && hypoallergenic !== false) {
            errorMsg.push({ hypoallergenic: `${hypoallergenic} is an invalid input` });
        }
        if (!pictureUrl.match(/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/)) {
            errorMsg.push({ pictureUrl: `${pictureUrl} is an invalid url` });
        }

        if (toiletTrained !== true && toiletTrained !== false) {
            errorMsg.push({ toiletTrained: `${toiletTrained} is an invalid input` });
        }
        // if it is not an array
        // if it is not s, m, v

        if (!Array.isArray(healthStatus)) {
            // send error if not array
            errorMsg.push({ healthStatus: `${healthStatus} is invalid` });
        } else {
            [...healthStatus].map(hstatus => {
                if (!hstatus.includes('sterilized') && !hstatus.includes('vaccinated') && !hstatus.includes('microchipped')) {
                    // send error if not any of the values
                    errorMsg.push({ healthStatus: `${healthStatus} is invalid` });
                }
            })
        }

        if (!Array.isArray(familyStatus)) {
            // send error if not array
            errorMsg.push({ familyStatus: `${familyStatus} is invalid` });
        } else {
            [...familyStatus].map(fstatus => {
                if (!fstatus.includes('hdbApproved') && !fstatus.includes('goodWithKids') && !fstatus.includes('goodWithOtherDogs')) {
                    // send error if not any of the values
                    errorMsg.push({ familyStatus: `${familyStatus} is invalid` });
                }
            })
        }

        if (!Array.isArray(temperament) || temperament.length < 1 || temperament.length > 3) {
            errorMsg.push({ temperament: `${temperament} is invalid` });
        } else {
            [...temperament].map(t => {
                if (!t.includes('good-natured') && !t.includes('shy') && !t.includes('assertive') && !t.includes('aggressive') && !t.includes('laidback') && !t.includes('playful') && !t.includes('active')) {
                    errorMsg.push({ temperament: `${temperament} is invalid` });
                }
            })
        }

        if (typeof (ownerName) !== 'string' || !ownerName.match(/^[A-Za-z]+( [A-Za-z]+)*$/)) {
            errorMsg.push({ ownerName: `${ownerName} is an invalid input` });
        }
        if (typeof (email) !== 'string' || !email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
            errorMsg.push({ email: `${email} is an invalid input` });
        }

        if (errorMsg && errorMsg.length > 0) {
            res.status(406).json({ "Errors": errorMsg });
        } else {
            
            let owner = {ownerName, email}

            let result = await db.collection('dog_adoption').insertOne({
                dogName, breed, gender, description, dateOfBirth,
                hypoallergenic, toiletTrained, temperament,
                healthStatus, familyStatus, pictureUrl, owner
            })
            res.status(200).json(result);
        }
    })

    app.delete('/dog_adoption/:id', async (req, res) => {
        try {
            await db.collection('dog_adoption').remove({
                _id: ObjectId(req.params.id)
            });
            res.status(200);
            res.send({
                message: 'OK'
            });

        } catch (e) {
            res.status(500).send("Internal server error. Please contact administrator.");
        }
    });

};

main();

app.listen(8888, () => {
    console.log('Server has started');
});