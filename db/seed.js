var Promise = require('bluebird');
var chance = require('chance').Chance();

var seed = function(knex) {
    return Promise.all([
        seedUsers(knex),
        seedSubreddits(knex)
    ])
    .then(function() {
        return seedRelations(knex)
    })
    .catch(function(err) {
        console.error(err);
    });
};

var seedUsers = function(knex) {
    var names = chance.unique(chance.name, 10);
    var users = names.map(function(name) {
        return {name: name};
    });

    return knex('users').insert(users);
};

var seedSubreddits = function(knex) {
    return knex('subreddits').insert([
        {name: 'dal_recipes'},
        {name: 'troll_hate'},
        {name: 'programming'},
        {name: 'kitten_pictures'},
        {name: 'katy_perry_hate'},
        {name: 'liberace_vs_fibonacci'},
        {name: 'puppy_hate'},
        {name: 'kitchen_chores_hate'}
    ]);
};

var seedRelations = function(knex) {
    // Create 30 random relations
    return Promise.all([
        knex('users').select(),
        knex('subreddits').select()
    ])
    .then(function(values) {
        var users = values[0];
        var subreddits = values[1];

        var pairs = chance.unique(function() {
            return [chance.pick(users), chance.pick(subreddits)];
        }, 30, {
            comparator: function(pairs, pair) {
                console.log(pair, pairs);
                for (var i=0; i<pairs.length; i++) {
                    var item = pairs[i];
                    if (item[0].id == pair[0].id &&
                        item[1].id == pair[1].id) {
                        return true;
                    }
                }
                return false;
            }
        });

        pairs = pairs.map(function(pair) {
            return {user_id: pair[0].id, subreddit_id: pair[1].id};
        });

        return knex('users_subreddits').insert(pairs);
    });

};

if (require.main === module) {
    var knex = require('./connect')();
    seed(knex)
        .then(function() {
            console.log("Database seeded successfully");
        })
        .catch(function(err) {
            console.error(err);
        })
        .finally(function() {
            knex.destroy()
        });
};
