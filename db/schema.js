var Promise = require('bluebird');

var createSchema = function(knex) {
    return Promise.all([
        createUsersTable(knex),
        createSubredditsTable(knex)
    ])
    .then(function() {
        return createUsersSubredditsTable(knex)
    });
};

var createUsersTable = function(knex) {
    return knex.schema.createTable('users', function(table) {
        table.increments();
        table.string('name')
            .notNullable();
    });
};

var createSubredditsTable = function(knex) {
    return knex.schema.createTable('subreddits', function(table) {
        table.increments();
        table.string('name')
            .notNullable()
            .unique();
    });
};

var createUsersSubredditsTable = function(knex) {
    return knex.schema.createTable('users_subreddits', function(table) {
        table.increments();
        table.integer('user_id')
            .unsigned()
            .notNullable()
            .references('id').inTable('users');
        table.integer('subreddit_id')
            .unsigned()
            .notNullable()
            .references('id').inTable('subreddits');
        table.unique(['user_id', 'subreddit_id']);
    });
};

if (require.main === module) {
    var knex = require('./connect')();
    createSchema(knex)
        .then(function() {
            console.log("Schema created successfully");
        })
        .catch(function(err) {
            console.error(err);
        })
        .finally(function() {
            knex.destroy()
        });
};
