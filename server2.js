import { ApolloServer, gql } from "apollo-server";

let actors = [
    { id: "1", name: "Robert Downey Jr.", age: 56 },
    { id: "2", name: "Chris Evans", age: 40 }
];

let movies = [
    { id: "1", title: "Avengers: Endgame", releaseYear: 2019, actorIds: ["1"] },
    { id: "2", title: "Captain America: The First Avenger", releaseYear: 2011, actorIds: ["2"] }
];

const typeDefs = gql`

    type Movie {
        id: ID!
        title: String!
        releaseYear: Int!
        actors: [Actor!]!
    }

    type Actor {
        id: ID!
        name: String!
        age: Int!
        movies: [Movie!]!
    }

    type Query {
        allActors:[Actor!]!
        allMovies:[Movie!]!
        actor(id:ID!):Actor!
        movie(id:ID!):Movie!
    }

    type Mutation {
        addMovie(title: String!, releaseYear: Int!):Movie!
        addActor(name: String!, age:Int!):Actor!
    }
`;
const resolvers = {
    Query: {
        allActors() {
            return actors;
        },
        allMovies() {
            return movies;
        },
        actor(root, {id}) {
            return actors.find(actor => actor.id === id);
        },
        movie(root, {id}) {
            return movies.find(movie => movie.id === id);
        }
    },
    Mutation: {
        addMovie(root, {title, releaseYear}) {
            const newMovie = {
                id: movies.length + 1,
                title,
                releaseYear
            }
            movies.push(newMovie);
            return newMovie;
        },
        addActor(root, {name, age}) {
            const newActor = {
                id: actors.length + 1,
                name,
                age
            }
            actors.push(newActor);
            return newActor;
        },
    },
    Movie: {
        actors(movie) {
            return actors.filter(actor => movie.actorIds.includes(actor.id));
        }
    },
    Actor: {
        movies(actor) {
            return movies.filter(movie => movie.actorIds.includes(actor.id));
        }
    }
}

const server = new ApolloServer({typeDefs, resolvers});
server.listen().then(({url}) => console.log(`${url} 접속`))