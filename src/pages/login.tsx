import React from "react";
import { Form, Formik, FormikHelpers } from "formik";
import InputField from "../components/InputField";
import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { createUrqlClient } from "../utils/createUrqlClient";
import { withUrqlClient } from "next-urql";
import type { AuthInterface } from "../types";
import NextLink from "next/link";
import Page from "../components/layout/Page";
import { useAnonymousPage } from "../hooks/useAnonymousPage";

interface registerProps {}

const Login: React.FC<registerProps> = ({}) => {
  useAnonymousPage();
  const [, login] = useLoginMutation();
  const router = useRouter();
  const handleInput = async (
    values: AuthInterface,
    { setErrors }: FormikHelpers<AuthInterface>
  ) => {
    const response = await login(values);
    if (response.data?.login.errors) {
      setErrors(toErrorMap(response.data.login.errors));
    } else if (response.data?.login.user) {
      // * Auth successful
      if (typeof router.query.next === "string") {
        router.push(router.query.next);
      } else {
        router.push("/");
      }
    }
  };
  return (
    <Page variant="small">
      <Formik
        initialValues={{ usernameOrEmail: "", password: "" } as AuthInterface}
        onSubmit={async (values, form) => {
          await handleInput(values, form);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="usernameOrEmail"
              placeholder="Username or Email"
              label="Username or Email"
            />
            <Box my={4}>
              <InputField
                name="password"
                placeholder="Password"
                label="Password"
                type="password"
              />
            </Box>
            <Flex>
              <span>Forgot your password ?</span>
              <Box ml={2}>
                <NextLink href="/forgot-password">
                  <Link>Click here</Link>
                </NextLink>
              </Box>
            </Flex>
            <Button isLoading={isSubmitting} type="submit" colorScheme="teal">
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </Page>
  );
};
export default withUrqlClient(createUrqlClient, { ssr: true })(Login);
