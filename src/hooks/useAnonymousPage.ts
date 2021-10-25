import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";

export const useAnonymousPage = () => {
  const [{ data, fetching }] = useMeQuery({ pause: isServer() });
  const router = useRouter();
  useEffect(() => {
    if (!fetching && data?.me) {
      router.replace("/");
    }
  }, [fetching, data, router]);
};
