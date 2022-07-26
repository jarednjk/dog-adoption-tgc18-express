# Adogpt API

This is a RESTful API project built using NodeJS (ExpressJS) and MongoDB for a dog adoption website. It is used in combination with a frontend interface, React which can be found [here](https://github.com/jarednjk/dog-adoption-tgc18-react).

## Sample MongoDB Document

![Sample MongoDB document](https://github.com/jarednjk/dog-adoption-tgc18-express/blob/main/img/sample_mongo_doc.png)

## Endpoints

### Display all dog records or certain dog records based on search queries

#### Request
```
GET /dog_adoption
```
#### Response
Returns an array of the dog records

### Create a new dog record

#### Request
```
POST /dog_adoption
```
#### Response
New dog is added to the database

### Edit a dog record based on the ID

#### Request
```
PUT /dog_adoption/:id
```
#### Response
Dog record (id: _id) is updated in the database

### Delete a dog record based on the ID

#### Request
```
DELETE /dog_adoption/:id
```
#### Response
Dog record (id: _id) is deleted from the database

### Post a comment on a certain dog

#### Request
```
POST /dog_adoption/comments/:id
```
#### Response
Comment is posted on the dog

## Technologies Used

1. [ExpressJS](https://expressjs.com/) & [NodeJS](https://nodejs.org/en/) - minimalist web application framework to help manage servers and routes
2. [MongoDB & MongoDB Atlas](https://www.mongodb.com/) - manage document-oriented information, store or retrieve information
3. [Heroku](https://id.heroku.com/login) - cloud platform server for API

## Testing

Testing is done for the HTTP methods (POST, GET, PUT, DELETE) via the [Advanced REST Client](https://install.advancedrestclient.com/install).

## Deployment

Deployment is done through Heroku. For the detailed deployment steps, you may refer [here](https://devcenter.heroku.com/articles/git#deploy-your-code).