import React from "react";
import ThemeToggle from "./themeToggle";
import styled from "styled-components";
import { Link } from "gatsby";
import { mobileLAbove, tabletAbove } from "../styles/mediaQuery";

export default function Navigation() {
  return (
    <Nav>
      <NavBar>
        <BrandLink to="/">Hyunwoo Kim</BrandLink>
        <Menus>
          <MenuLink activeClassName="active" to="/">
            articles
          </MenuLink>
          <MenuLink activeClassName="active" to="/about">
            about
          </MenuLink>
          <MenuLink activeClassName="active" to="/portfolio">
            portfolio
          </MenuLink>
          <ThemeToggle />
        </Menus>
      </NavBar>
    </Nav>
  );
}

const Nav = styled.div`
  padding: var(--inset-header);
  background-color: var(--color-navbar);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  box-shadow: var(--color-navbarshadow);
  z-index: var(--navbar-z-index);
  transition: background 350ms ease 0s;
`;

const BrandLink = styled(Link)`
  padding: var(--squish-s);
  font-size: var(--font-size-brand);
  color: var(--color-heading);
  font-weight: var(--font-weight-bold);
  margin-left: auto;
  margin-right: auto;
  font-style: italic;
  ${mobileLAbove`
    margin-left: calc(var(--squish-s) * -1);
  `}
`;

const NavBar = styled.nav`
  display: flex;
  align-items: center;
  max-width: var(--container-max-width);
  padding: var(--container-pad);
  margin: var(--container-margin);
  flex-direction: column;
  ${mobileLAbove`
    flex-direction: row;
  `}
`;

const Menus = styled.div`
  display: flex;
  align-items: center;
`;

const MenuLink = styled(Link)`
  font-size: calc(var(--font-size-brand) * 0.9);
  margin-right: var(--inline-xs);
  padding: var(--squish-s);
  &.active,
  &:hover {
    background-color: var(--color-menuActive);
    border-radius: 3px;
  }
  ${tabletAbove`
    margin-right: var(--inline-s);
  `}
`;
