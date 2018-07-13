// var { graphql, buildSchema  } = require('graphql');

// var schema = buildSchema(`
//     type Query { 
//         hello : String 
//     }
// `);

// var root = { hello: () => 'Hello World!' };

// graphql(schema, '{ hello }', root).then((respoonse) => {
//     console.log(respoonse);
// });

var { request } = require('graphql-request');

const query = `{
  Movie(title: "Inception") {
    releaseDate
    actors {
      name
    }
  }
}`

request('https://api.graph.cool/simple/v1/movies', query).then(data => console.log(JSON.stringify(data)))
