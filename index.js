const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(bodyParser.json());

let productos = [
    {
    id: 1,
    nombre: "aaaaaaaa",
    precio: "10",
    descripcion: "a"
    },
];

// Ruta para registrar un producto
app.post("/productos", (req, res) => {
    const { nombre, precio, descripcion } = req.body;
    if (!nombre || typeof precio !== "number") {
        return res.status(400).json({ mensaje: "Nombre y precio son obligatorios y válidos." });
    }
    const nuevoProducto = {
        id: productos.length + 1, // Generación simple de ID
        nombre,
        precio,
        descripcion
    };
    productos.push(nuevoProducto); // Guardar en memoria
    res.status(201).json(nuevoProducto);
});


// Ruta para consultar todos los productos
app.get("/productos", (req, res) => {
  res.json(productos);
});

// Ruta para consultar un producto por ID
app.get("/productos/:id", (req, res) => {
  const producto = productos.find((p) => p.id == req.params.id);
  if (producto) {
    res.json(producto);
  } else {
    res.status(404).send("Producto no encontrado");
  }
});

app.listen(port, () => {
  console.log(`API de productos escuchando en http://localhost:${port}`);
});
