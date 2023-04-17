
/*
* Auto generated Codehooks (c) example
* Install: npm i codehooks-js codehooks-crudlify
*/
import {app} from 'codehooks-js'
import {crudlify} from 'codehooks-crudlify'
import { object, string, number } from 'yup'

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

const userSchema = object({
    userId: string().required(),
    placeIds: array().of(string()).required().default([]),
});

// Sanity check
app.get('/hello', async (req, res) => {
    console.log("I run locally, cool!");
    res.json({"message": "Hello local world!"});
});

// Use Crudlify to create a REST API for any collection
crudlify(app)

// bind to serverless runtime
export default app.init();
