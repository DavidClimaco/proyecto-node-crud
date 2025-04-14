import express from "express";
import Book from "../models/book.model.js";
const router = express.Router();


//Middleware
const getBook = async (req, res, next) => {
    let book;
    const {id} = req.params;

    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        return res.status(404).json({message: 'El ID del libro no es válido'});
    }
    try{
        book = await Book.findById(id);
        if(!book){
            return res.status(404).json({message: 'El libro no fue encontrado'})
        }
    }catch(error){
        return res.status(500).json({message: error.message});
    }
    res.book = book;
    next();
};
//GET ALL BOOKS
router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        console.log('GET ALL', books);
        if(books.length === 0){
            return res.status(204).json([]);
        }
        res.json(books);
    }catch (error){
        res.status(500).json({message: error.message});
    }
});

//CREATE BOOK
router.post('/', async (req, res) => {
        const {title, author, genre, publicationDate} = req?.body;
        if(!title || !author || !genre || !publicationDate){
            return res.status(400).json({message: 'Los campos son obligatorios'});
        }

        const book = new Book({
            title,
            author,
            genre,
            publicationDate
        });

        try {
            const newBook = await book.save();
            console.log('CREATE', newBook);
            res.status(201).json(newBook);
        }catch (error){
            res.status(400).json({message: error.message});
        }
});

//GET BOOK BY ID
router.get('/:id', getBook, async (req, res) => {
    res.json(res.book);
});

//PUT book
router.put('/:id', getBook, async (req, res) => {
    try {
        const book = res.book;
        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.genre = req.body.genre || book.genre;
        book.publicationDate = req.body.publicationDate || book.publicationDate;

        const updateBook = await book.save();
        res.json(updateBook);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

router.patch('/:id', getBook, async (req, res) => {
    if(!req.body.title && !req.body.author && !req.body.genre && !req.body.publicationDate){
        res.status(400).json({message: 'Al menos uno de los campos debe ser modificado'})
    }

    try {
        const book = res.book;
        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.genre = req.body.genre || book.genre;
        book.publicationDate = req.body.publicationDate || book.publicationDate;

        const updateBook = await book.save();
        res.json(updateBook);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

router.delete('/:id', getBook, async (req, res) => {
    try {
        const book = res.book;
        await book.deleteOne({
            _id: book._id
        });
        res.json({message: `El libro ${book.title} fue borrado correctamente`})
    } catch (error) {
        res.json({message: error.message});
    }
})

export default router;