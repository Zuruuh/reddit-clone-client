import { Form, Formik, FormikHelpers } from "formik";
import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import { Box, Flex, Link, Button } from "@chakra-ui/react";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from "next/link";
import { useForgotPasswordMutation } from "../generated/graphql";

interface forgotPasswordInterface {
  email: string;
}

const forgotPassword: React.FC<{}> = ({}) => {
  const [completed, setCompleted] = useState(false);
  const [, forgotPassword] = useForgotPasswordMutation();

  const handleInput = async (values: forgotPasswordInterface) => {
    await forgotPassword(values);
    setCompleted(true);
  };

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: "" } as forgotPasswordInterface}
        onSubmit={async (values) => {
          handleInput(values);
        }}
      >
        {({ isSubmitting }) =>
          completed ? (
            <Box>
              We sent you an email with a reset link, make sure to check your
              junk folder !
            </Box>
          ) : (
            <Form>
              <InputField
                name="email"
                placeholder="email@domain.com"
                label="Email address"
                type="email"
              />
              <Flex py={2}>
                <span>Already have an account ?</span>
                <Box ml={2}>
                  <NextLink href="/login">
                    <Link>Login</Link>
                  </NextLink>
                </Box>
              </Flex>
              <Button isLoading={isSubmitting} type="submit" colorScheme="teal">
                Send
              </Button>
            </Form>
          )
        }
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(forgotPassword);
