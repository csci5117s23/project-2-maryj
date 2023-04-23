const ninjaKey = process.env.NINJAS_KEY;

//Used class example Tech-Stack-2-Kluver-Demo as inspiration
//************************** Get Calls***************************/
export const getFact = async () => {
    console.log(ninjaKey)
    const result = await fetch("https://api.api-ninjas.com/v1/facts?limit=1", {
        'method':'GET',
        'headers': {'X-Api-Key': ninjaKey}
    })
    return await result.json()
}