require('dotenv').config()

const knex = require('knex')({
    client: 'pg',
    connection: {
        user: 'dcwwprxb',
        host: 'isabelle.db.elephantsql.com',
        database: 'dcwwprxb',
        password: 'GXTBwWUI6dCBIwDCSPuKS-rEcu3iA36d',
        ssl:{rejectUnauthorized: false}
    },
    
})

const query = (text, param) => {
    return knex.query(text, param);
}

module.exports = knex;
