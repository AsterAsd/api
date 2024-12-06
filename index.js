const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors()); // Habilitar CORS

// Conexión a la base de datos MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI);

const productoSchema = new mongoose.Schema({
    nombre: String,
    precio: Number,
    descripcion: String
});

const Producto = mongoose.model('Producto', productoSchema);

// Redirección de la raíz a /productos
app.get('/', (req, res) => {
    res.redirect('/productos');
});

// Ruta para registrar un producto
app.post('/productos', async (req, res) => {
    const { nombre, precio, descripcion } = req.body;
    const nuevoProducto = new Producto({ nombre, precio, descripcion });
    try {
        await nuevoProducto.save();
        const productoLimpio = nuevoProducto.toObject();
        delete productoLimpio.__v;  // Eliminar el campo __v del objeto antes de devolverlo
        res.status(201).json(productoLimpio);
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar el producto' });
    }
});

// Ruta para consultar todos los productos
app.get('/productos', async (req, res) => {
    try {
        const productos = await Producto.find().select('-__v');  // Excluir el campo __v en la consulta
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: 'Error al consultar los productos' });
    }
});

// Ruta para consultar un producto por ID
app.get('/productos/:id', async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id).select('-__v');  // Excluir el campo __v en la consulta
        if (producto) {
            res.json(producto);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al consultar el producto' });
    }
});

app.listen(port, () => {
    console.log(`API de productos escuchando en http://localhost:${port}`);
});
