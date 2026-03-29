import { motion } from "framer-motion";
import React from "react";
import styled from "styled-components";

const Box = styled(motion.a)`
  width: calc(18rem + 20vw);
  text-decoration: none;
  height: 24rem;
  padding: 1rem;
  color: ${(props) => props.theme.body};
  border: 2px solid ${(props) => props.theme.body};
  backdrop-filter: blur(2px);
  box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.2);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  z-index: 5;

  &:hover {
    color: ${(props) => props.theme.text};
    background-color: ${(props) => props.theme.body};
    transition: all 0.3s ease;
  }
`;

const Image = styled.div`
  background-image: ${(props) => `url(${props.img})`};
  width: 100%;
  height: 80%;
  background-size: cover;
  background-position: center center;
  border: 1px solid ${(props) => props.theme.body};

  ${Box}:hover & {
    border: 1px solid ${(props) => props.theme.text};
  }
`;

const Title = styled.h1`
  color: inherit;
  padding: 0.5rem 0 0;
  margin: 0;
  font-family: "Karla", sans-serif;
  font-weight: 700;
  font-size: 2rem;
  text-align : center;
`;

const Container = styled(motion.div)``;

const Item = {
  hidden: { scale: 0 },
  show: {
    scale: 1,
    transition: { type: "spring", duration: 0.5 },
  },
};

const BlogComponent = (props) => {
  const { name, imgSrc, link } = props.blog;

  return (
    <Container variants={Item}>
      <Box href={link} target="_blank" rel="noopener noreferrer">
        <Image img={imgSrc} />
        <Title>{name}</Title>
      </Box>
    </Container>
  );
};

export default BlogComponent;