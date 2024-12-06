const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Conexión a la base de datos MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

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
        res.status(201).json(nuevoProducto);
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar el producto' });
    }
});

// Ruta para consultar todos los productos
app.get('/productos', async (req, res) => {
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: 'Error al consultar los productos' });
    }
});

// Ruta para consultar un producto por ID
app.get('/productos/:id', async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
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
