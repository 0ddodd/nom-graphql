import { ApolloServer, gql } from "apollo-server";
import fetch from 'node-fetch';

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
        allMovies: [Movie!]!
        movie(id:ID!):Movie!
    }

    type Mutation {
        postTweet(text:String!, userId: ID!): Tweet!
        deleteTweet(id: ID!): Boolean!
    }

    type Movie {
        id: Int!
        url: String!
        imdb_code: String!
        title: String!
        title_english: String!
        title_long: String!
        slug: String!
        year: Int!
        rating: Float!
        runtime: Float!
        genres: [String!]!
        summary: String
        description_full: String!
        synopsis: String!
        yt_trailer_code: String!
        language: String!
        background_image: String!
        background_image_original: String!
        small_cover_imag: String!
        medium_cover_image: String!
        large_cover_image: String!
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
        },
        async allMovies() {
            return await fetch("https://yts.mx/api/v2/list_movies.json")
            .then(res => res.json())
            .then(json => json.data.movies)
        },
        async movie(root, {id}) {
            return await fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`)
            .then(res => res.json())
            .then(json => json.data.movie)
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
    // type에는 존재하는데 변수에는 없는 것 처리
    // 해당 필드의 값을 동적으로 계산
    User: {
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