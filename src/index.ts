import { graphql, buildSchema } from "graphql";
import express, { query } from "express";
import schemas from "./schema.gql";
import { createHandler } from "graphql-http/lib/use/express";
import { makeExecutableSchema } from "@graphql-tools/schema";

const customer = [
  { id: 1, name: 'Babon' },
  { id: 2, name: 'Babon Gila' },
  { id: 3, name: 'Gila' },
];

const concession = [
  { id: 1, name: 'Babon' },
  { id: 2, name: 'Babon Gila' },
  { id: 3, name: 'Gila' },
];


const schema = buildSchema(schemas);

const resolvers = {
  Query: {
    customer: () => 
  },
}
const rootValue = {
  hello(a: any, b: any, c: any, d: any) {
    console.log(a);
    console.log(d);
    return "Hello World";
  },
};

const app = express();

const graphqlHandler = createHandler({
  schema,
  rootValue,
  context: (req) => {
    return {
      ip: "1212",
    };
  },
});

app.all("/graphql", graphqlHandler);
app.listen(4000);
