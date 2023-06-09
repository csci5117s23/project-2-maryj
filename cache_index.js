
/*
* Auto generated Codehooks (c) example
* Install: npm i codehooks-js codehooks-crudlify
*/
import {app, Datastore} from 'codehooks-js'
import {crudlify} from 'codehooks-crudlify'
import { object, string, array, number, boolean } from 'yup'
import jwtDecode from 'jwt-decode'

const backend_base = "https://backend-qsum.api.codehooks.io/dev";

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
app.use(userAuth)

// app.use("/restaurants", (req, res, next) => {
//     if (req.method === "POST") {
//         req.body.userId = req.user_token.sub
//     } else if (req.method === "GET") {
//         req.query.userId = req.user_token.sub
//     }
//     next();
// });

// add an endpoint to get a resturant by user id and place id
// app.get('/get-restaurant/:userId/:placeId', async (req, res) => {
//     const userId = req.params.userId;
//     const placeId = req.params.placeId;
//     const conn = await Datastore.open();
//     const restaurant = await conn.getOne('restaurant', {filter: {userId: userId, placeId: placeId}});
//     res.json(restaurant);
// });

// Write me a codehooks endpoint that takes a image id and returns the image
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
  
// Write me a codehooks endpoint that takes in a image and uploads it to the datastore
app.post('/upload-image', async (req, res) => {
    const conn = await Datastore.open();
    // Assign the image a random id
    req.body.id = Math.random().toString(36).substring(7);
    // upload the image to the datastore with the id
    // Convert the image to b64 before adding it to the database
    console.log(req.body);
    const image = await conn.insertOne('image', req.body);
    res.json({url: `${req.headers.host}/dev/get-image/${image.id}`});
});

// Sanity check
app.get('/hello', async (req, res) => {
    console.log("I run locally, cool!");
    res.json({"message": "Hello local world!"});
});

// Make an endpoint that takes in a restaurant id and adds a new item to it
app.post('/add-item/:restaurantId', async (req, res) => {
    const conn = await Datastore.open();
    const restaurant = await conn.getOne('restaurant', req.params.restaurantId);
    restaurant.itemsTried.push(req.body);
    await conn.updateOne('restaurant', req.params.restaurantId, restaurant);
    res.json(restaurant);
});

// Make an endpoint that takes in a restaurant id, item name, and reflection and updates it
app.post('/update-item/:restaurantId', async (req, res) => {
    const conn = await Datastore.open();
    const restaurant = await conn.getOne('restaurant', req.params.restaurantId);
    const item = restaurant.itemsTried.find((item) => item.name === req.body.name);
    if (req.body.reflect) {
        item.reflection = req.body.reflection;
    }
    if (req.body.liked) {
        item.liked = req.body.liked;
    }
    await conn.updateOne('restaurant', req.params.restaurantId, restaurant);
    res.json(restaurant);
});


app.post("/google", async (req, res) => {
    // TODO: get this from the environment
    const google_api_key = "AIzaSyCTYBU_S3FSdZ6N_0Mxrz5ldKzoIh1qrfo";

    let lat = req.body.lat.toString();
    let lng = req.body.lon.toString();
    let userId = req.body.userId;
    console.log(lat, lng, userId)

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
            imageId: restaurant.photos[0].photo_reference,
            starred: false,
            liked: false,
            address: restaurant.formatted_address,
        }
        // console.log(newRestaurant)
        const doc = await conn.insertOne('restaurant', newRestaurant);
        // console.log(doc)
        restaurantsAdded.push(doc);
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


import Card from "./Card";
import { useState, useEffect } from "react";
import styles from '@/styles/CardContainer.module.css';
import { useAuth } from '@clerk/nextjs';

const backend_base = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

interface CardContainerProps {
    filter: string;
}

interface Card {
    id: number;
    title: string;
    category: string;
    image: string;
    isStarred: boolean;
}

const dummyCards: Card[] = [
    {
      id: 1,
      title: "Raising Cane's Chicken Fingers",
      category: "Fried Chicken",
      image: "https://i.imgur.com/tB3WB6m.jpeg",
      isStarred: false
    },
    {
      id: 2,
      title: "Hong Kong Noodle",
      category: "Chinese Cuisine",
      image: "https://i.imgur.com/FL5Xd1Y.jpeg",
      isStarred: true
    },
    {
      id: 3,
      title: "Sushi Station",
      category: "Japanese",
      image: "https://i.imgur.com/tB3WB6m.jpeg",
      isStarred: false
    },
    {
      id: 4,
      title: "Chipotle Mexican Grill",
      category: "Mexican",
      image: "https://i.imgur.com/FL5Xd1Y.jpeg",
      isStarred: true
    },
    {
      id: 5,
      title: "Café de Paris",
      category: "French",
      image: "https://i.imgur.com/tB3WB6m.jpeg",
      isStarred: false
    }
];

export default function CardContainer({ filter }: CardContainerProps) {
    // add auth
    const { isLoaded, userId, sessionId, getToken } = useAuth();
    const [cards, setCards]: [Card[], Function] = useState<Card[]>([]);

    const [lat,setLat] = useState<string>("");
    const [lon,setLon] = useState<string>("");
    const [restaurants, setRestaurants] = useState<any[]>([]);

    useEffect(()=>{
        async function getGeo(){
            navigator.geolocation.getCurrentPosition((position)=>{
                setLat(position.coords.latitude.toString());
                setLon(position.coords.longitude.toString());
            });
        }
        getGeo();
    }, []);

    // // Delete all restaurants lol
    // useEffect(()=>{
    //     async function clearDatabase(){
    //         let queryString = backend_base + "/clear";
    //         // console.log(queryString)
    //         const response = await fetch(queryString, {
    //             method: "DELETE",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body : JSON.stringify({
    //                 userId: userId,
    //             }),
    //         });
    //         const data = await response.json();
    //         // console.log(data);
    //     }
    //     clearDatabase();
    // }, [userId]);
    
    useEffect(()=>{
        async function getNearbyPlaces(){
            let queryString = backend_base + "/google";
            // console.log(queryString)
            console.log(lat,lon)
            const response = await fetch(queryString, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body : JSON.stringify({
                    lat: lat,
                    lon: lon,
                    userId: userId,
                }),
            });
            const data = await response.json();
            setRestaurants(data);
            console.log(data);
        }
        getNearbyPlaces();
    }, [lat]);


    useEffect(() => {
        
        // Fetch for cards and set them in setCards() function
        async function getCards() {
            // const response = await fetch()
            setCards(dummyCards);
        }
        getCards();
    }, []);


    return (
        <div className={styles.container}>
            {cards.map(card => {
                return (
                    <Card
                        key={card.id}
                        id={card.id}
                        title={card.title}
                        category={card.category}
                        image={card.image}
                        isStarred={card.isStarred}
                    />                    
                );
            })}
        </div>
    );
}