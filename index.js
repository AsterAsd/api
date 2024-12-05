const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const config = require('./config.json').development;

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Conexión a la base de datos MySQL
const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect
});

const Producto = sequelize.define('Producto', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  precio: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// Sincroniza el modelo con la base de datos
sequelize.sync();

// Ruta para registrar un producto
app.post('/productos', async (req, res) => {
  const { nombre, precio, descripcion } = req.body;
  try {
    const nuevoProducto = await Producto.create({ nombre, precio, descripcion });
    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(500).send('Error al registrar el producto');
  }
});

// Ruta para consultar todos los productos
app.get('/productos', async (req, res) => {
  try {
    const productos = await Producto.findAll();
    res.json(productos);
  } catch (error) {
    res.status(500).send('Error al consultar los productos');
  }
});

// Ruta para consultar un producto por ID
app.get('/productos/:id', async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (producto) {
      res.json(producto);
    } else {
      res.status(404).send('Producto no encontrado');
    }
  } catch (error) {
    res.status(500).send('Error al consultar el producto');
  }
});

app.listen(port, () => {
  console.log(`API de productos escuchando en http://localhost:${port}`);
});
