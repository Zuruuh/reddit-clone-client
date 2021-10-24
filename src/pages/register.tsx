import React from "react";
import { Form, Formik, FormikHelpers } from "formik";
import Wrapper from "../components/Wrapper";
import InputField from "../components/InputField";
import { Box, Button } from "@chakra-ui/react";
import { useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import type { AuthInterface } from "../types";

const Register: React.FC<{}> = ({}) => {
  const [{}, register] = useRegisterMutation();
  const router = useRouter();
  const handleInput = async (
    values: AuthInterface,
    { setErrors }: FormikHelpers<AuthInterface>
  ) => {
    const response = await register({ options: values });
    if (response.data?.register.errors) {
      setErrors(toErrorMap(response.data.register.errors));
    } else if (response.data?.register.user) {
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
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};
export default Register;
