import { createYoga } from "graphql-yoga";
import { createServer } from "http";
import { loadSchemaSync } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { addResolversToSchema } from "@graphql-tools/schema";
import { catchError, filter, from, of, share, switchMap } from "rxjs";

const users = [
  { id: 1, name: "Babon", goingTo: [1] },
  { id: 2, name: "Babon Gila", goingTo: [1, 2] },
  { id: 3, name: "Gila", goingTo: [1, 3] },
];

const events = [
  { id: 1, desc: "Boz 0" },
  { id: 2, desc: "Weird 20" },
  { id: 3, desc: "Dumb 21" },
];

const userResolvers = {
  Query: {
    user: (root: any, _: any, context: any, info: any) => {
      const { user } = context.observable;

      return user.toPromise();
    },
    events: (root: any, _: any, context: any, info: any) => {
      const { event } = context.observable;

      return event.toPromise();
    },
  },
};

const path = process.env.NODE_ENV === "production" ? "gql" : "dist";

const allSchema = loadSchemaSync(`${path}/**/*.gql`, {
  loaders: [new GraphQLFileLoader()],
});

const schema = addResolversToSchema({
  schema: allSchema,
  resolvers: userResolvers,
});

const yoga = createYoga({
  schema,
  context: (test) => {
    const { operationName, variables } = test.params;

    return reducer(operationName!, variables);
  },
});

const createOperationReducer = (...ons: any[]) => {
  return (operation: string, variables: any) => {
    const result = ons.find(({ key }) => operation === key);

    if (!result) return undefined;

    const { cb } = result;
    return { observable: { ...cb(null, variables) } };
  };
};

const on = <T>(key: string, cb: (dataSources: any, variables: T) => {}) => {
  return { key, cb };
};

const reducer = createOperationReducer(
  on<{ id: number }>("BabonGila", (dataSources, variables) => {
    const user = of(variables).pipe(
      switchMap(({ id }) => createUserRequest(id)),
      catchError((error) => {
        console.log(error);
        return of(null);
      }),
      share(),
    );

    const event = user.pipe(
      filter((user) => user != null && user.goingTo.length > 0),
      switchMap((user) => createEventRequest(user!.goingTo)),
    );

    return {
      user,
      event,
    };
  }),
);

const createUserRequest = (userId: number) => {
  return from(Promise.resolve(users.find((u) => u.id === userId) ?? null));
};

const createEventRequest = (eventIds: number[]) => {
  return from(
    Promise.resolve(
      eventIds.map((id) => events.find((e) => e.id === id) ?? null),
    ),
  );
};

const server = createServer(yoga);

export default server;
