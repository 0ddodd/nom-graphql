import { ApolloServer, gql } from "apollo-server";

let tweets = [
    {
        id:"1",
        text:"text1",
        userId: "2"
    },
    {
        id:"2",
        text:"text2",
        userId: "1"
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
        author: User!
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

// query 리졸버 : 부모 객체를 참조할 수 있기 때문에 root가 사용됨
// mutation 리졸버: 부모 객체가 없어서 root는 항상 undefined
// 객체(User) 리졸버: 해당 객체에서 직접 데이터를 가져옴
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
        // type에는 존재하는데 변수 내용에는 없는 것 처리
        // 해당 필드의 값을 동적으로 계산
        fullName({firstName, lastName}) {
            return firstName + ' ' + lastName;
        }
    },
    Tweet: {
        author({userId}) {
            return users.find(user => user.id === userId);
        }
    }
}

const server = new ApolloServer({typeDefs, resolvers});

server.listen().then(({url})=>{
    console.log(`running on ${url}`)
})