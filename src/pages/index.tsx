import React, { useState } from "react";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import Page from "../components/layout/Page";
import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";

interface indexProps {}

const Index: React.FC<indexProps> = ({}) => {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as null | string,
  });
  const [{ data, fetching }] = usePostsQuery({
    variables,
  });

  if (!fetching && !data) {
    return <div>{"Query failed :("}</div>;
  }

  const loadMorePosts = () => {
    if (data) {
      setVariables({
        limit: variables.limit,
        cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
      });
    }
  };

  return (
    <Page variant="regular">
      <Flex align="center">
        <Heading>Reddit</Heading>
        <Link ml="auto">
          <NextLink href="/posts/create">Create post</NextLink>
        </Link>
      </Flex>
      <br />
      {!data && fetching ? (
        <div>loading</div>
      ) : (
        <Stack spacing={8}>
          {data!.posts.posts.map((p) => (
            <Box key={p.id} p={5} shadow="md" rounded="md" borderWidth="1px">
              <Heading fontSize="xl">{p.title}</Heading>
              <Text color="gray">u/{p.author.username}</Text>
              <Text mt={4}>{p.contentSnippet}</Text>
            </Box>
          ))}
        </Stack>
      )}
      {data ? (
        <Flex>
          <Button
            onClick={loadMorePosts}
            disabled={!data.posts.hasMore}
            isLoading={fetching}
            m="auto"
            my={8}
          >
            Load more
          </Button>
        </Flex>
      ) : null}
    </Page>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
