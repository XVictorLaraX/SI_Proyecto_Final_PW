const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'admin',
    password: '1234',
    database: 'sistema_de_finanzas',
    port: 3306
});

db.connect(err => {
    if (err) throw err;
    console.log('Conectado a la base de datos');
});

// Rutas
app.get('/', (req, res) => {
    const query = `
        SELECT gastos.*, catalogo_clasificacion.clasificacion 
        FROM gastos
        JOIN catalogo_clasificacion 
        ON gastos.clasificacion_id = catalogo_clasificacion.id`;
    db.query(query, (err, results) => {
        if (err) throw err;
        // Formatear la fecha de cada registro
        const gastos = results.map(gasto => {
            gasto.fecha = gasto.fecha.toISOString().split('T')[0]; // Formato yyyy-mm-dd
            return gasto;
        });
        res.render('index', { gastos });
    });
});


app.get('/formulario', (req, res) => {
    db.query('SELECT * FROM catalogo_clasificacion', (err, results) => {
        if (err) throw err;
        res.render('formulario', { clasificaciones: results });
    });
});

app.post('/registrar', (req, res) => {
    const { concepto, clasificacion_id, monto, fecha, forma_pago, entidad, es_deducible } = req.body;
    const query = `INSERT INTO gastos 
        (concepto, clasificacion_id, monto, fecha, forma_pago, entidad, es_deducible) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.query(query, [concepto, clasificacion_id, monto, fecha, forma_pago, entidad, es_deducible ? 1 : 0], (err) => {
        if (err) throw err;
        res.redirect('/');
    });
});

app.get('/actualizar/:id', (req, res) => {
    const id = req.params.id;
    db.query('SELECT * FROM gastos WHERE id = ?', [id], (err, gastoResult) => {
        if (err) throw err;

        // Formatear la fecha del gasto al formato yyyy-mm-dd
        if (gastoResult.length > 0) {
            gastoResult[0].fecha = gastoResult[0].fecha.toISOString().split('T')[0];
        }

        db.query('SELECT * FROM catalogo_clasificacion', (err, clasificacionesResult) => {
            if (err) throw err;
            res.render('actualizar', { gasto: gastoResult[0], clasificaciones: clasificacionesResult });
        });
    });
});


app.post('/actualizar/:id', (req, res) => {
    const id = req.params.id;
    const { concepto, clasificacion_id, monto, fecha, forma_pago, entidad, es_deducible } = req.body;
    const query = `UPDATE gastos SET 
        concepto = ?, clasificacion_id = ?, monto = ?, fecha = ?, forma_pago = ?, entidad = ?, es_deducible = ? 
        WHERE id = ?`;
    db.query(query, [concepto, clasificacion_id, monto, fecha, forma_pago, entidad, es_deducible ? 1 : 0, id], (err) => {
        if (err) throw err;
        res.redirect('/');
    });
});

app.get('/eliminar', (req, res) => {
    db.query('SELECT id, concepto, monto FROM gastos', (err, results) => {
        if (err) throw err;
        res.render('eliminar', { gastos: results });
    });
});

app.post('/eliminar/:id', (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM gastos WHERE id = ?', [id], (err) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// Iniciar el servidor
app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
