const express = require("express");
const { postgraphile } = require("postgraphile");
const { Pool } = require('pg');
const { run } = require('./GenericScript')

const app = express();
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'manager',
    password: '',
    port: 5432,
});
const postgraphileHandler = postgraphile(pool, "public", {
    graphiql: true,
    watchPg: true,
    enableCors: true
});

// the pool with emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
});

// app.use('/graphiql', postgraphileHandler);
// app.use('/graphql', postgraphileHandler);

app.use(postgraphileHandler);

app.use('/screenshots', express.static('screenshots'))

app.use('/replay/:id', function (req, res, next) {
    const id = parseInt(req.params.id);
    // async/await - check out a client
    (async () => {
        const client = await pool.connect();
        try {
            const res = await client.query('SELECT * FROM records WHERE id = $1', [id]);
            const record = res.rows[0];
            if (record) {
                await run(record.events, `screenshots/${id}.png`);
            }else{
                res.json({err: `record ${id} not found`});
            }
        } catch (err) {
            res.json({err});
        } finally {
            client.release();
        }
    })().catch(e => console.log(e.stack));
    res.json({result: 'running'});
    next();
});

app.listen(process.env.PORT || 4000);