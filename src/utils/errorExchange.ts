import { Exchange } from "urql";
import { pipe, tap } from "wonka";
import Router from "next/router";

export const errorExchange: Exchange =
  ({ forward }) =>
  (ops$) => {
    return pipe(
      forward(ops$),
      tap(({ error }) => {
        if (error?.message.includes("001")) {
          Router.replace("/login");
        }
      })
    );
  };
