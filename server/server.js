var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');
var {graphqlExpress, graphiqlExpress} = require('graphql-server-express');
var {makeExecutableSchema} = require('graphql-tools');
var axios = require('axios')

// var schema = buildSchema(`
//   type Query {
//     name: String!
//     appearsIn: Episode!
//   } 
//   type Episode {
//     desc: String!
//     time: String!
//   } 
// `);


// var userschema = buildSchema(`
//   type Query {
//     me: User
//   }
//   type User {
//     id: ID
//     name: String
//   }`
// );

// var humanSchema = buildSchema(`
//   type Query {
//     human(id: ID!): Human
//   }
//   type Human {
//     name: String
//     appreasIn: [Episode]
//     starship: [Starship]
//   }
//   enum Episode {
//     NEWHOPE
//     EMPIRE
//     JEDI
//   }
//   type Starship {
//     name: String
//   }
// `);

const typeDefs = [`
  type Query {
    human(id: ID!): Human
    UserQuery: UserQuery
    Movie: Movie
    Person(id: ID!): Person
  }
  type Human {
    name: String
    appreasIn: [Episode]
    starship: [Starship]
  }
  enum Episode {
    NEWHOPE
    EMPIRE
    JEDI
  }
  type Starship {
    name: String
  }

  type UserQuery {
    me: User
  }
  type User {
    id: ID
    name: String
  }

  type Movie {
    name: String!
    appearsIn: Episodes!
  } 
  type Episodes {
    desc: String!
    time: String!
  } 

  type Person{
    birthPlace: City
    name: String
    label: String
    birthDate: String
    _id: ID
    _type: ID
  }
  type City {
    country : Country
    leader : Person
    label: String
    _id: ID
    _type: ID
  }
  type Country {
    capital: City
    label: String
    _id: ID
    _type: ID
  }

  schema {
    query: Query
  }
`]

var country = {capital: ()=> "Gandhinagar", label: "India"}
var city = { country: () => country, leader: "Leader", label: "gandhi"}
var person = { birthPlace : () => city, name: ()=> "Mahatma Gandhi", label  : ()=> "Mahatma Gandhi", birthDate: ()=> "1869-10-02"}


// var episode={desc: () => "Special Timing",time:()=>"12:20 am"}
//var root = { name: () => 'RAID!', appearsIn: () => episode };
var root = callDbPedia();
console.log('Response====>', root)

async function callDbPedia(){
  return await axios.get('http://lookup.dbpedia.org/api/search/KeywordSearch?QueryClass=place&QueryString=berlin')
  .then(function (response) {
    console.log(response.data);
    var episode={desc: () => response.data.results[0].description ,time:()=>response.data.results[0].uri}
    return { name: () => response.data.results[0].label, appearsIn: () => episode }
  })
  .catch(function (error) {
    console.log(error);
  });
}

var user = { id: () => "4253", name: () => "Urvashi Hirani"}
var me = { me: () => user }

var starship = [{ name: () => "startship1"}, { name: () => "startship2"}, { name: () => "startship3"}, { name: () => "startship4"}]
var appears =  ["NEWHOPE", "EMPIRE", "JEDI"]
var humandata = { name: () => "John smith", appreasIn: () => appears, starship: () => starship}
var human = { human: () => humandata, Movie: () => root, UserQuery: () => me, Person:()=>person}


const schema1 = makeExecutableSchema({
  typeDefs,
})

var app = express();

app.use('/graphql', graphqlHTTP({
  //schema: humanSchema,
  schema: schema1,
  rootValue: human,
  graphiql: true,
}));




app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));