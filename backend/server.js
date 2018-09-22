const express = require("express");
const { postgraphile } = require("postgraphile");

const app = express();

app.use(postgraphile(process.env.DATABASE_URL || "postgres://postgres@localhost:5432/manager", "public", {
    graphiql: true,
    watchPg: true
}));

app.listen(process.env.PORT || 4000);