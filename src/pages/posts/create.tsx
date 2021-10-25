import { Box, Button } from "@chakra-ui/react";
import { Form, Formik, FormikHelpers } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";

import InputField from "../../components/InputField";
import Page from "../../components/layout/Page";
import { useCreatePostMutation } from "../../generated/graphql";
import { useIsAuthentificated } from "../../hooks/useIsAuthentificated";
import { PostInterface } from "../../types";
import { createUrqlClient } from "../../utils/createUrqlClient";

const create: React.FC<{}> = ({}) => {
  const router = useRouter();
  useIsAuthentificated();

  const [, createPost] = useCreatePostMutation();
  const handleInput = async (
    values: PostInterface,
    {}: FormikHelpers<PostInterface>
  ) => {
    const { error } = await createPost({ input: values });
    if (!error) {
      router.push("/");
    }
  };
  return (
    <Page variant="small">
      <Formik
        initialValues={{ title: "", content: "" } as PostInterface}
        onSubmit={async (values, form) => {
          await handleInput(values, form);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="title" placeholder="Title" label="Title" />
            <Box my={4}>
              <InputField
                textarea
                name="content"
                placeholder="Content..."
                label="Body"
              />
            </Box>
            <Button isLoading={isSubmitting} type="submit" colorScheme="teal">
              Create Post
            </Button>
          </Form>
        )}
      </Formik>
    </Page>
  );
};
export default withUrqlClient(createUrqlClient)(create);
