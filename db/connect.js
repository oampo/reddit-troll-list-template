var knex = require('knex');

var settings = require('../settings');

var connect = function() {
    return knex({
        client: 'postgres',
        debug: true,
        connection: {
            host: settings.DB_HOST || 'localhost',
            user: settings.DB_USER,
            password: settings.DB_PASS,
            database: 'reddit'
        }
    });
};

module.exports = connect;

