import React from "react";
import styled from "styled-components";
import Img from "gatsby-image";

export default function ImgWrap({
  type = "fluid",
  width,
  maxwidth,
  imageStyle,
  src,
  children,
  ...props
}) {
  return (
    <ImageWrap maxwidth={maxwidth} {...props}>
      {type === "fluid" ? (
        <Img imageStyle={imageStyle || { objectFit: "contain" }} fluid={src} />
      ) : (
        <Img imageStyle={imageStyle || { objectFit: "contain" }} fixed={src} />
      )}
      {children}
    </ImageWrap>
  );
}

const ImageWrap = styled.div`
  /* max-width: ${props => props.maxwidth || `100%`};
  width: ${props => props.width || `100%`}; */
`;
