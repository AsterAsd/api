const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

let productos = [];

// Redirección de la raíz a /productos
app.get('/', (req, res) => {
    res.redirect('/productos');
});

// Ruta para registrar un producto
app.post('/productos', (req, res) => {
    const { nombre, precio, descripcion } = req.body;
    const nuevoProducto = { id: productos.length + 1, nombre, precio, descripcion };
    productos.push(nuevoProducto);
    res.status(201).json(nuevoProducto);
});

// Ruta para consultar todos los productos
app.get('/productos', (req, res) => {
    res.json(productos);
});

// Ruta para consultar un producto por ID
app.get('/productos/:id', (req, res) => {
    const producto = productos.find(p => p.id == req.params.id);
    if (producto) {
        res.json(producto);
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

app.listen(port, () => {
    console.log(`API de productos escuchando en http://localhost:${port}`);
});
