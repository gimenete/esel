var esel = require('../')

var queryBuilder = esel({
  _: {
    children: ['select', 'from', 'join', 'where', 'order', 'limit', 'offset'],
  },
  select: {
    types: ['string'],
  },
  from: {
    types: ['string'],
  },
  join: {
    keys: ['table'],
    types: ['string'],
    children: ['on'],
    multiple: true,
  },
  on: {
    keys: ['field'],
    types: ['string'],
    children: ['equals', 'isNull', 'between', 'and'],
    nest: true,
  },
  and: {
    keys: ['field'],
    types: ['string'],
    children: ['equals', 'isNull', 'between'],
    multiple: true,
  },
  equals: {
    types: ['string'],
  },
  isNull: {
    implicits: { isNull: true }
  },
  between: {
    keys: ['min', 'max'],
    types: ['number', 'number'],
    nest: true,
  },
  limit: {
    types: ['number'],
  },
  offset: {
    types: ['number'],
  }
})

var query =
  queryBuilder
    .select('*')
    .from('messages')
    .join('users')
      .on('messages.author').equals('users.id')
      .and('users.deleted').isNull()
      .and('users.score').between(100, 200)
    .join('categories')
      .on('messages.category').equals('categories.id')
    .limit(10)
    .offset(100)
    .build()
console.log(JSON.stringify(query, null, 2))

/* output:

{
  "select": "*",
  "from": "messages",
  "join": [
    {
      "table": "users",
      "on": {
        "field": "messages.author",
        "equals": "users.id",
        "and": [
          {
            "field": "users.deleted",
            "isNull": true
          },
          {
            "field": "users.score",
            "between": {
              "min": 100,
              "max": 200
            }
          }
        ]
      }
    },
    {
      "table": "categories",
      "on": {
        "field": "messages.category",
        "equals": "categories.id"
      }
    }
  ],
  "limit": 10,
  "offset": 100
}
*/
