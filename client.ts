import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

const link = new HttpLink({
  uri: "http://192.168.0.45:4000/graphql/",
  //   uri: "http://172.20.10.4:4000/graphql/",
});
const cache = new InMemoryCache();
const client = new ApolloClient({
  link,
  cache,
});
export default client;
