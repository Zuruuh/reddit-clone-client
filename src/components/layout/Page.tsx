import Wrapper from "../Wrapper";
import type { WrapperVariant } from "../Wrapper";
import Navbar from "./Navbar";

interface PageProps {
  variant?: WrapperVariant;
}

const Page: React.FC<PageProps> = ({ children, variant }) => {
  return (
    <>
      <Navbar />
      <Wrapper variant={variant}>{children}</Wrapper>
    </>
  );
};

export default Page;
