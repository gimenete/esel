var esel = require('../')

var httpMethods = ['get', 'put', 'post', 'del', 'patch']
var options = {
  _: {
    children: httpMethods.concat(['query', 'header', 'form', 'accept']),
  },
  query: {
    keys: ['key', 'value'],
    types: ['string', 'string'],
    multiple: true,
  },
  form: {
    keys: ['key', 'value'],
    types: ['string', 'string'],
    multiple: true,
  },
  header: {
    keys: ['key', 'value'],
    types: ['string', 'string'],
    multiple: true,
  },
  accept: {
    children: ['mime'],
    nest: true,
  },
  mime: {
    types: ['string'],
    multiple: true,
  },
}
httpMethods.forEach(function(method) {
  options[method] = {
    types: ['string'],
    keys: ['path'],
    implicits: { method: method }
  }
})

var requestBuilder = esel(options)

var request =
  requestBuilder
    .get('/foo')
    .accept()
      .mime('text/html')
      .mime('application/json')
    .query('foo1', 'bar1')
    .query('foo2', 'bar2')
    .form('key', 'value')
    .header('User-Agent', 'nodejs')
    .build()
console.log(JSON.stringify(request, null, 2))

/* output
{
  "path": "/foo",
  "method": "get",
  "accept": {
    "mime": [
      {
        "mime": "text/html"
      },
      {
        "mime": "application/json"
      }
    ]
  },
  "query": [
    {
      "key": "foo1",
      "value": "bar1"
    },
    {
      "key": "foo2",
      "value": "bar2"
    }
  ],
  "form": [
    {
      "key": "key",
      "value": "value"
    }
  ],
  "header": [
    {
      "key": "User-Agent",
      "value": "nodejs"
    }
  ]
}*/
