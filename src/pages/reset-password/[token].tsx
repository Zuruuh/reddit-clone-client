import React, { useState } from "react";
import { Form, Formik, FormikHelpers } from "formik";
import { NextPage } from "next";
import { Button, Box, Link, Flex } from "@chakra-ui/react";
import InputField from "../../components/InputField";
import Wrapper from "../../components/Wrapper";
import { useResetPasswordMutation } from "../../generated/graphql";
import { toErrorMap } from "../../utils/toErrorMap";
import router from "next/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import NextLink from "next/link";

interface ResetPasswordFormInterface {
  password: string;
}

const ResetPassword: NextPage<{ token: string }> = ({ token }) => {
  const [, resetPassword] = useResetPasswordMutation();
  const [tokenError, setTokenError] = useState("");
  const handleInput = async (
    values: ResetPasswordFormInterface,
    { setErrors }: FormikHelpers<ResetPasswordFormInterface>
  ) => {
    const response = await resetPassword({
      token,
      password: values.password,
    });

    if (response.data?.resetPassword.errors) {
      const errors = toErrorMap(response.data.resetPassword.errors);
      setTokenError("");
      if ("token" in errors) {
        setTokenError(errors.token);
      }
      setErrors(errors);
    } else if (response.data?.resetPassword.user) {
      router.push("/");
    }
  };
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ password: "" } as ResetPasswordFormInterface}
        onSubmit={async (values, form) => {
          handleInput(values, form);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box my={4}>
              <InputField
                name="password"
                placeholder="new Password"
                label="New Password"
                type="password"
              />
            </Box>
            {tokenError ? (
              <Flex>
                <Box mr={2} color="red">
                  {tokenError}
                </Box>
                <NextLink href="/forgot-password">
                  <Link>Click here to get a new one</Link>
                </NextLink>
              </Flex>
            ) : null}
            <Button isLoading={isSubmitting} type="submit" colorScheme="teal">
              Confirm
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

ResetPassword.getInitialProps = ({ query }) => {
  return {
    token: query.token as string,
  };
};

export default withUrqlClient(createUrqlClient, { ssr: true })(ResetPassword);
