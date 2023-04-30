
/*
* Auto generated Codehooks (c) example
* Install: npm i codehooks-js codehooks-crudlify
*/
import {app, Datastore} from 'codehooks-js'
import {crudlify} from 'codehooks-crudlify'
import { object, string, array, number, boolean } from 'yup'
import jwtDecode from 'jwt-decode'
import fetch from 'node-fetch'

const backend_base = "https://backend-qsum.api.codehooks.io/dev";
const google_api_key = process.env.GOOGLE_API_KEY;

const restaurantSchema = object({
    userId: string().required(),
    placeId: string().required(),
    name: string().required(),
    starred: boolean().required().default(false),
    liked: boolean().required().default(false),
    favoriteItems: array().of(string()).required().default([]),
    imageId: string().required().default(""),
    address: string().required().default(""),

    itemsTried: array().of(object({
        name: string().required(),
        liked: boolean().required().default(false),
        reflection: string().required().default(""),
    })).required().default([]),
});

const imageSchema = object({
    id: string().required(),
    image: string().required(),
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

// Bypass auth for images
app.use((req, res, next) => {
    if (req.path.split("/")[2] === "get-image") {
        next();
    } else {
        userAuth(req, res, next);
    }
});

app.auth('/get-image/*', (req, res, next) => {
    next();
});
  

app.post("/update-restaurant", async (req, res) => {
    const conn = await Datastore.open();
    const restaurant = await conn.updateMany('restaurant', req.body, {filter: {userId: req.body.userId, placeId: req.body.placeId}});
    res.json(restaurant);
});

app.post("/get-restaurants", async (req, res) => {
    const conn = await Datastore.open();
    if (req.body.filter === "Starred") {
        const cursor = conn.getMany('restaurant', {filter: {userId: req.body.userId, starred: true}});
        const restaurants = [];
        await cursor.forEach((item) => {
            restaurants.push(item);
        });
        res.json(restaurants);
    } else { // if (req.body.filter === "liked") {
        const cursor = conn.getMany('restaurant', {filter: {userId: req.body.userId, liked: true}});
        const restaurants = [];
        await cursor.forEach((item) => {
            restaurants.push(item);
        });
        res.json(restaurants);
    }
});

app.post('/get-restaurant', async (req, res) => {
    const userId = req.body.userId;
    const placeId = req.body.placeId;
    const conn = await Datastore.open();
    const cursor = conn.getMany('restaurant', {filter: {userId: userId, placeId: placeId}});
    let restaurant = null;
    await cursor.forEach((item) => {
        restaurant = item;
        return;
    });

    if (restaurant === null) {
        res.status(404).send("Restaurant not found");
    } else {
        res.json(restaurant);
    }
});

app.get('/get-image/:id', async (req, res) => {
    const conn = await Datastore.open();
    const cursor = conn.getMany('image', {filter: {id: req.params.id}})
    await cursor.forEach((image) => {
        const imageData = Buffer.from(image.image, 'base64');
        res.set('Content-Type', 'image/jpeg');
        res.set('Content-Length', imageData.length);
        res.write(imageData, 'buffer');
    });
    res.end();
});

app.post('/upload-image', async (req, res) => {
    const conn = await Datastore.open();
    // Assign the image a random id
    req.body.id = Math.random().toString(36).substring(7);
    // upload the image to the datastore with the id
    // Convert the image to b64 before adding it to the database
    const image = await conn.insertOne('image', req.body);
    res.json({url: `https://${req.headers.host}/dev/get-image/${image.id}`});
});

// Sanity check
app.get('/hello', async (req, res) => {
    console.log("I run locally, cool!");
    res.json({"message": "Hello local world!"});
});

app.post('/add-item/:placeId', async (req, res) => {
    const userId = req.body.userId;
    const placeId = req.params.placeId;
    const conn = await Datastore.open();
    const cursor = conn.getMany('restaurant', {filter: {userId: userId, placeId: placeId}});
    let restaurant = null;
    await cursor.forEach((item) => {
        restaurant = item;
        return;
    });

    if (restaurant === null) {
        res.status(404).send("Restaurant not found");
    }

    if (!restaurant.itemsTried) restaurant.itemsTried = [];

    restaurant.itemsTried.push({
        name: req.body.name,
        liked: false,
        reflection: "",
    });
    await conn.updateOne('restaurant', restaurant._id, restaurant);
    res.json(restaurant);
});

// Make an endpoint that takes in a restaurant id, item name, and reflection and updates it
app.post('/update-item/:restaurantId', async (req, res) => {
    const conn = await Datastore.open();
    const userId = req.body.userId;
    const placeId = req.params.restaurantId;
    const cursor = conn.getMany('restaurant', {filter: {userId: userId, placeId: placeId}});
    let restaurant = null;
    await cursor.forEach((item) => {
        restaurant = item;
        return;
    });

    if (restaurant === null) {
        res.status(404).send("Restaurant not found");
    }

    const item = restaurant.itemsTried.find((item) => item.name === req.body.name);
    if (req.body.reflection != undefined) {
        item.reflection = req.body.reflection;
    }
    if (req.body.liked != undefined) {
        item.liked = req.body.liked;
    }
    
    await conn.updateOne('restaurant', restaurant._id, restaurant);
    res.json(restaurant);
});


app.post("/google", async (req, res) => {
    // TODO: get this from the environment
    const google_api_key = "AIzaSyCTYBU_S3FSdZ6N_0Mxrz5ldKzoIh1qrfo";

    let lat = req.body.lat.toString();
    let lng = req.body.lon.toString();
    let userId = req.body.userId;
    console.log(lat, lng, userId);

    let google_url = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurant&location=";
    google_url += lat + "," + lng + "&radius=1000&key=";
    google_url += `${google_api_key}`;
    // console.log(google_url);
    // console.log(google_api_key);

    const response = await fetch(google_url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
    });
    const data = await response.json();
    // console.log(data)

    // Add restaurants to the database
    const restaurantsAdded = [];
    const conn = await Datastore.open();
    for (const restaurant of data.results) {

        // const conn = await Datastore.open();
        const restaurants = conn.getMany('restaurant', {filter: {userId: userId, placeId: restaurant.place_id}});
        const rest = await restaurants.toArray();
        // console.log(rest.length);

        if (rest.length > 0) {
            console.log("Restaurant already exists");

            restaurantsAdded.push(rest[0]);
            continue;
        }

        let newRestaurant = {
            userId: userId,
            placeId: restaurant.place_id,
            name: restaurant.name,
            starred: false,
            liked: false,
            address: restaurant.formatted_address,
        }

        if (restaurant.photos && restaurant.photos.length > 0) {
            newRestaurant.imageId = restaurant.photos[0].photo_reference;
        }

        // console.log(newRestaurant)
        const doc = conn.insertOne('restaurant', newRestaurant);
        // console.log(doc)
        restaurantsAdded.push(newRestaurant);
    }
    // console.log(restaurantsAdded)
    
    // res.json(restaurantsAdded);
    res.json(restaurantsAdded);
});

// Delete all restaurants from the database (use carefully)
app.delete("/clear", async (req, res) => {
    const conn = await Datastore.open();
    const data = await conn.removeMany('restaurant', {filter: {userId: req.body.userId}});
    res.json(data);
});

// Use Crudlify to create a REST API for any collection
crudlify(app, {restaurant: restaurantSchema, image: imageSchema});

// bind to serverless runtime
export default app.init();
