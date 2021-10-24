import React from "react";
import { Form, Formik, FormikHelpers } from "formik";
import Wrapper from "../components/Wrapper";
import InputField from "../components/InputField";
import { Box, Button } from "@chakra-ui/react";
import { useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { createUrqlClient } from "../utils/createUrqlClient";
import { withUrqlClient } from "next-urql";

interface registerProps {}

interface AuthInterface {
  username: string;
  password: string;
}

const Login: React.FC<registerProps> = ({}) => {
  const [{}, login] = useLoginMutation();
  const router = useRouter();
  const handleInput = async (
    values: AuthInterface,
    { setErrors }: FormikHelpers<AuthInterface>
  ) => {
    const response = await login({ options: values });
    if (response.data?.login.errors) {
      setErrors(toErrorMap(response.data.login.errors));
    } else if (response.data?.login.user) {
      // * Auth successful
      router.push("/");
    }
  };
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", password: "" } as AuthInterface}
        onSubmit={async (values, form) => {
          handleInput(values, form);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              placeholder="Username"
              label="Username"
            />
            <Box my={4}>
              <InputField
                name="password"
                placeholder="Password"
                label="Password"
                type="password"
              />
            </Box>
            <Button isLoading={isSubmitting} type="submit" colorScheme="teal">
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};
export default withUrqlClient(createUrqlClient, { ssr: true })(Login);
