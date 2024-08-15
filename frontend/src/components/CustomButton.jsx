import React from 'react'

import {custom_button} from "../styles/customButton.module.css"

const CustomButton = ({className, children, ...props}) => {
  return (
    <button type="button" className={`${custom_button} ${className}`} {...props}>{children}</button>
  )
}

export default CustomButton
