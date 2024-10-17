import { ApolloServer, gql } from "apollo-server";

let heros = [
    {id:'1', name: 'batman', superpower:'fucking lot money', affiliation: 'no'}
]
let villains = [
    {id:'1', name: 'joker', evilPlan:'kill batman', nemesisId: 1}
]
// 스키마
const typeDefs = gql`
    
    type Hero {
        id: ID!
        name: String!
        superpower: String!
        affiliation: String!
    }

    type Villain {
        id: ID!
        name: String!
        evilPlan: String!
        nemesisId: Int!
    }
    
    type Query {
        allHeros:[Hero!]!
        hero(id: ID!):Hero!
        allVillains:[Villain!]!
        villain(id: ID!):Villain!
    }

    type Mutation {
        addHero(name:String!, superpower:String!, affiliation:String!):Hero!
        deleteVillain(id:ID!):Boolean!
    }
`;

// 프리 요청 (스키마의 query, mutation 상세 구현)
const resolvers = {
    Query:{
        allHeros() {
            return heros;
        },
        hero(root, {id}) {
            return heros.find(h => h.id === id);
        },
        allVillains() {
            return this.allVillains;
        },
        villain(root, {id}) {
            return villains.find(v => v.id === id);
        }
    },
    Mutation:{ 
        addHero(root, {name, superpower, affiliation}) {
            const newHero = {
                id: heros.length + 1,
                name,
                superpower,
                affiliation
            }
            heros.push(newHero);
            return newHero;
        },
        deleteVillain(root, {id}) {
            const villain = villains.find(m => m.id === id);
            if(!villain) return false;
            villains = villains.filter(m => m.id !== id);
            return true;
        }
    }
}

const server = new ApolloServer({typeDefs, resolvers});

server.listen().then(({url})=>{
    console.log(`running on ${url}`)
})