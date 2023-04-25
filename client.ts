import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { Observable } from "@apollo/client/utilities";
import { getToken } from "./auth";

const httpLink = new HttpLink({
  uri: __DEV__
    ? "http://192.168.1.106:4000/graphql"
    : "https://rider-driver-backend.herokuapp.com/graphql",
  credentials: "include",
});

const request = async (operation) => {
  const token = await getToken();
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : "",
    },
  });
};

const requestLink = new ApolloLink(
  (operation, forward) =>
    new Observable((observer) => {
      let handle;
      Promise.resolve(operation)
        .then((oper) => request(oper))
        .then(() => {
          handle = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer),
          });
        })
        .catch(observer.error.bind(observer));

      return () => {
        if (handle) handle.unsubscribe();
      };
    })
);

// const authLink = setContext(async (_, { headers }) => {
//   // get the authentication token from local storage if it exists
//   const token = await getToken();

//   // return the headers to the context so httpLink can read them
//   return {
//     headers: {
//       ...headers,
//       authorization: token ? `Bearer ${token}` : "",
//     },
//   };
// });

// const authorizedLink = authLink.concat(httpLink as any);

// const wsLink = new WebSocketLink({
//   uri: __DEV__
//     ? `ws://192.168.0.46:4000/graphql`
//     : `ws://rider-driver-backend.herokuapp.com/graphql`,
//   options: {
//     reconnect: true,
//     lazy: true,
//     connectionParams: async () => ({
//       authorization: `Bearer ${await getToken()}`,
//     }),
//   },
// });

// const link = split(({ query }) => {
//   const definition = getMainDefinition(query);
//   return (
//     definition.kind === "OperationDefinition" &&
//     definition.operation === "subscription"
//   );
// }, authorizedLink as any);

const cache = new InMemoryCache();
const client = new ApolloClient({
  link: ApolloLink.from([requestLink, httpLink]),
  cache,
});

export default client;
