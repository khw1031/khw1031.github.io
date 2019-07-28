import React from 'react'
import styled, { css } from 'styled-components'
import { darken } from 'polished'
import theme from 'styled-theming'
import { tabletAbove } from '../styles/mediaQuery'
import {
  LightThemeColors,
  DarkThemeColors,
} from '../../custom/styleScheme/colors'

const FilterButton = ({
  category,
  currentCategories,
  handleCategoryFilter,
}) => {
  const active = currentCategories.includes(category.fieldValue).toString()
  return (
    <Filter>
      <Button
        active={active}
        type='button'
        onClick={() => handleCategoryFilter(category.fieldValue)}
      >
        {category.fieldValue}
      </Button>
    </Filter>
  )
}

export const CategoryFilter = ({
  categories,
  currentCategories,
  handleCategoryFilter,
}) => {
  return (
    <Filters>
      {categories.map(category => (
        <FilterButton
          key={category.fieldValue}
          category={category}
          currentCategories={currentCategories}
          handleCategoryFilter={handleCategoryFilter}
        />
      ))}
    </Filters>
  )
}

const Filters = styled.ul`
  display: flex;
  flex-wrap: wrap;
  margin: 0 0 1.5rem;
`
const Filter = styled.li`
  list-style-type: none;
  margin-right: 0.5rem;
  ${tabletAbove`
    margin-right: 0.9rem;
  `}
`

const ButtonCss = theme('siteTheme', {
  light: css`
    color: ${props =>
      props.active === 'true' ? '#ffffff' : LightThemeColors.link};
    background: ${props =>
      props.active === 'true'
        ? LightThemeColors.link
        : LightThemeColors.filterButtonBg};
    :hover,
    :active,
    :focus {
      color: ${props =>
        props.active === 'true' ? '#ffffff' : LightThemeColors.linkHover};
      background: ${props =>
        props.active === 'true'
          ? LightThemeColors.link
          : darken(0.1, LightThemeColors.filterButtonBg)};
    }
  `,
  dark: css`
    color: ${props =>
      props.active === 'true' ? '#ffffff' : LightThemeColors.link};
    background: ${props =>
      props.active === 'true'
        ? LightThemeColors.link
        : DarkThemeColors.filterButtonBg};
    :hover,
    :active,
    :focus {
      color: ${props =>
        props.active === 'true' ? '#ffffff' : LightThemeColors.linkHover};
      background: ${props =>
        props.active === 'true'
          ? LightThemeColors.link
          : darken(0.1, DarkThemeColors.filterButtonBg)};
    }
  `,
})

const Button = styled.button`
  outline-width: 0;
  padding: 0.4rem 0.85rem;
  border-radius: 4px;
  border: 0;
  font-weight: 800;
  font-size: 0.7rem;
  cursor: pointer;
  ${ButtonCss}
  ${tabletAbove`
    font-size: 0.85rem;
  `}
`
