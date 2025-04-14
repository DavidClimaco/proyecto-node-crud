import express from "express";
import 'dotenv/config';
import mongoose from "mongoose";
import router from './routes/book.route.js';  // If it's in src/routes
import bodyParser from "body-parser";

//Express para middleware
const app = express();
app.use(bodyParser.json()) //Para parsear el body de la request

//Conexion a la base de datos
mongoose.connect(process.env.MONGO_URL, {dbName: process.env.MONGO_DB_NAME});
const db = mongoose.connection;

app.use('/books', router);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});