import { ApolloServer, gql } from "apollo-server";

const typeDefs = gql`
    type Query {
        hello:String
    }
`;

const resolvers = {
    Query: {
        hello() {
            return 'hell!!o'
        }
    }
}


const server = new ApolloServer({typeDefs, resolvers});

server.listen().then(({url})=>{
    return console.log(`${url}에 연결`)
})
