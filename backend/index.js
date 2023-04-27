
/*
* Auto generated Codehooks (c) example
* Install: npm i codehooks-js codehooks-crudlify
*/
import {app, Datastore} from 'codehooks-js'
import {crudlify} from 'codehooks-crudlify'
import { object, string, array, number, boolean } from 'yup'
import jwtDecode from 'jwt-decode'


const restaurantSchema = object({
    userId: string().required(),
    placeId: string().required(),
    starred: string().required().default("none"),
    liked: string().required().default("none"),
    favoriteItems: array().of(string()).required().default([]),

    itemsTried: array().of(object({
        name: string().required(),
        liked: boolean().required().default(false),
        reflection: string().required().default(""),
    })).required().default([]),
});


const userAuth = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (authorization) {
        const token = authorization.replace('Bearer ','');
        // NOTE this doesn't validate, but we don't need it to. codehooks is doing that for us.
        const token_parsed = jwtDecode(token);
        req.user_token = token_parsed;
        }
        next();
    } catch (error) {
        next(error);
    } 
}
app.use(userAuth)

app.use("/restaurants", (req, res, next) => {
    if (req.method === "POST") {
        req.body.userId = req.user_token.sub
    } else if (req.method === "GET") {
        req.query.userId = req.user_token.sub
    }
    next();
});

// add an endpoint to get restaurant data for a userId
app.get('/restaurants/:userId', async (req, res) => {
    const userId = req.params.userId; 
    const conn = await Datastore.open();
    conn.getMany('restaurant', {filter: {userId: userId}}).json(res)
});

// add an endpoint to add a restaurant to a user's list
app.post('/restaurants/:userId', async (req, res) => {
    const conn = await Datastore.open();
    const restaurant = await conn.insertOne('restaurant', req.body);
    res.json(restaurant);
});

// Write me a codehooks endpoint that takes a image id and returns the image
app.get('/image/:id', async (req, res) => {
    const conn = await Datastore.open();
    const image = await conn.getOne('image', { filter: { id: req.params.id } });
  
    if (!image) {
      return res.status(404).send('Image not found');
    }
  
    // Convert the base64-encoded image data to binary data
    const imageData = Buffer.from(image.data, 'base64');
  
    // Set the response headers and send the image data in the response body
    res.set('Content-Type', image.contentType);
    res.set('Content-Length', imageData.length);
    res.send(imageData);
  });
  
// Write me a codehooks endpoint that takes in a image and uploads it to the datastore
app.post('/upload-image', async (req, res) => {
    const conn = await Datastore.open();
    // Assign the image a random id
    req.body.id = Math.random().toString(36).substring(7);
    // upload the image to the datastore with the id
    // Convert the image to b64 before adding it to the database
    req.body.image = Buffer.from(req.body.image, 'base64');
    const image = await conn.insertOne('image', req.body);
    res.json({url: `/image/${image.id}`});
});


// Sanity check
app.get('/hello', async (req, res) => {
    console.log("I run locally, cool!");
    res.json({"message": "Hello local world!"});
});

// Use Crudlify to create a REST API for any collection
crudlify(app, {restaurant: restaurantSchema});

// bind to serverless runtime
export default app.init();
