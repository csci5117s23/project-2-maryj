
/*
* Auto generated Codehooks (c) example
* Install: npm i codehooks-js codehooks-crudlify
*/
import {app, Datastore} from 'codehooks-js'
import {crudlify} from 'codehooks-crudlify'
import { object, string, array, number } from 'yup';
import jwtDecode from 'jwt-decode'


const restaurantSchema = object({
    userId: string().required(),
    placeId: string().required(),
    starred: string().required().default("none"),
    liked: string().required().default("none"),
    favoriteItems: array().of(string()).required().default([]),

    itemsTried: array().of(object({
        name: string().required(),
        liked: string().required().default("none"),
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

// Sanity check
app.get('/hello', async (req, res) => {
    console.log("I run locally, cool!");
    res.json({"message": "Hello local world!"});
});

// Use Crudlify to create a REST API for any collection
crudlify(app, {restaurant: restaurantSchema});

// bind to serverless runtime
export default app.init();
