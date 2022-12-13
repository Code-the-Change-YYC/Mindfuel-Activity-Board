db.createCollection('users');
db.createCollection('activityStats')
db.users.createIndex({
    date: 1
})