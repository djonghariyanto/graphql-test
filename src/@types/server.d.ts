declare module "server.ts" {
  import { Server as GraphqlServer } from "http";
  const Server: GraphqlServer;

  export = Server;
}
