import mongoose from "mongoose";

export const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    genre: String,
    publicationDate: String
});

const Book = mongoose.model("Book", bookSchema);
export default Book;
