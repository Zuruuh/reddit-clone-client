import React from "react";
import Navbar from "../components/layout/Navbar";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";

interface indexProps {}

const Index: React.FC<indexProps> = ({}) => {
  const [{ data }] = usePostsQuery();
  return (
    <>
      <Navbar />
      <div>Hello World</div>
      <br />
      {!data ? (
        <div>loading</div>
      ) : (
        data.posts.map((p: any) => <div key={p.id}>{p.title}</div>)
      )}
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
