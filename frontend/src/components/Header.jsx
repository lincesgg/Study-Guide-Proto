import React from 'react'

import {header__container} from "../styles/header.module.css"

const Header = ({title, Prefix, className, ...restProps}) => {
  return (
    <div className={`${header__container} ${className} header_component`} {...restProps}>
        <h3>
            {Prefix}
            {title}
        </h3>
    </div>
  )
}

export default Header
