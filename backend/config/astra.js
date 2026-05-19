import { DataAPIClient } from '@datastax/astra-db-ts';
import 'dotenv/config';

// Initialize the Astra DB cloud client configuration
const client = new DataAPIClient(process.env.ASTRA_DB_APPLICATION_TOKEN);

// Establish connection using the correct .db() method instantiation
const db = client.db(process.env.ASTRA_DB_API_ENDPOINT);

// Operational target collections
export const productCollection = db.collection('images'); 
export const userCollection = db.collection('users');
export const cartCollection = db.collection('carts');
export const orderCollection = db.collection('orders');

const connectAstra = async () => {
    try {
        await db.listCollections();
        console.log("Database Connected: Connected to Astra DB Cloud Instance!");
    } catch (error) {
        console.error("Astra DB Initialization Failed:", error.message);
        process.exit(1);
    }
}

export default connectAstra;