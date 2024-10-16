import { ApolloServer, gql } from "apollo-server";


// 스키마
const typeDefs = gql`

    type User {
        id:ID!
        username:String!
    }

    type Tweet {
        id: ID!
        text: String!
        author: User!
    }

    type Query {
        allTweets: [Tweet!]!
        tweet(id:ID!): Tweet!
    }

    type Mutation {
        postTweet(text:String!, userID: ID!): Tweet!
        deleteTweet(id: ID!): Boolean!
    }
`
// GET /api/v1/tweets
// POST /api/v1/tweets
// GET /api/v1/tweet/:id


const server = new ApolloServer({typeDefs});

server.listen().then(({url})=>{
    console.log(`running on ${url}`)
})