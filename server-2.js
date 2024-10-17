import { ApolloServer, gql } from "apollo-server";

let tweets = [
    {
        id:'1',
        text:'text1',
    },
    {
        id:'2',
        text:'text2',
    },
]

let users = [
    {id:"1", firstName:"Nico", lastName:"las"},
    {id:"2", firstName:"Nico2", lastName:"las2"},
]

// 1. 스키마
const typeDefs = gql`

    type User {
        id:ID!
        firstName: String!
        lastName: String!
        fullName: String!
    }

    type Tweet {
        id: ID!
        text: String!
        author: User
    }

    type Query {
        allUsers: [User!]!
        allTweets: [Tweet!]!
        tweet(id:ID!): Tweet!
    }

    type Mutation {
        postTweet(text:String!, userId: ID!): Tweet!
        deleteTweet(id: ID!): Boolean!
    }
`

//2. pre 요청
const resolvers = {
    Query: {
        allTweets() {
            return tweets;
        },
        tweet(root, {id}) {
            return tweets.find(tweet => tweet.id === id);
        },
        allUsers() {
            return users;
        }
    },
    Mutation: {
        postTweet(root, {text, userId}) {
            const newTweet = {
                id: tweets.length + 1,
                text
            }
            tweets.push(newTweet);
            return newTweet;
        },
        deleteTweet(root, {id}) {
            const tweet = tweets.find(tweet => tweet.id === id);
            if (!tweet) return false;
            tweets = tweets.filter(tweet => tweet.id !== id);
            return true;
        }
    },
    User: {
        fullName({firstName, lastName}) {
            return firstName + ' ' + lastName;
        }
    }
}

const server = new ApolloServer({typeDefs, resolvers});

server.listen().then(({url})=>{
    console.log(`running on ${url}`)
})