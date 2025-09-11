// Documentacion https://medium.com/@turingvang/next-js-beginner-mongodb-crud-example-tutorial-db2afdb68e25
// https://hevodata.com/learn/next-js-mongodb-connection/

/*
En la pagina de HEvo, la conexion es el paso 5
*/

import 'dotenv/config'
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const options = {}

let client
let clientPromise

if (!process.env.MONGODB_URI) {
  throw new Error('Variable en .env')
}

if (process.env.NODE_ENV === 'development') {
  // apartado para produccion
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  // Establecer conexion
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise