import React from 'react'

import Header from "./header";
import {panel} from "../styles/panel.module.css"

const Panel = ({className="", children, ...restProps}) => {
  return (
    <div className={`${panel} ${className} panel_component`} {...restProps}>
      {children}
    </div>
  )
}

export default Panel
