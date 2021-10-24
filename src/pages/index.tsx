import React from "react";
import Navbar from "../components/layout/Navbar";

interface indexProps {}

const Index: React.FC<indexProps> = ({}) => {
  return (
    <>
      <Navbar />
      <div>Hello World</div>
    </>
  );
};

export default Index;
