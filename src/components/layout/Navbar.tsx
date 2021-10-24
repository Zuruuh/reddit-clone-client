import React from "react";
import { Box, Link, Flex, Button } from "@chakra-ui/react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../../generated/graphql";
import { isServer } from "../../utils/isServer";
interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = ({}) => {
  const [{ data, fetching: loggedInFetching }] = useMeQuery({
    pause: isServer(),
  });
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  let body: React.ReactElement | null = null;

  // * Data is loading
  if (loggedInFetching) {
    // * User is not logged in
  }
  if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2}>Login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>Register</Link>
        </NextLink>
      </>
    );
    // * User is logged in
  } else {
    body = (
      <Flex>
        <Box mr={2}>{data?.me?.username}</Box>
        <Button
          onClick={() => {
            logout();
          }}
          isLoading={logoutFetching}
          variant="link"
        >
          Log Out
        </Button>
      </Flex>
    );
  }

  return (
    <Flex bg="tan" p={4} ml={"auto"}>
      <Box ml={"auto"}>{body ?? null}</Box>
    </Flex>
  );
};
export default Navbar;
