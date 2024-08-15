import React from 'react'

import { LuCopyPlus } from 'react-icons/lu'

import CustomButton from './CustomButton'
import {create_button, button_icon} from "../styles/customButton.module.css"

const CreateButton = ({className, children="Create", ...props}) => {
  return (
    <CustomButton className={`${create_button} ${className}`} {...props}>
        <LuCopyPlus className={button_icon}/>
        {children}
    </CustomButton>
  )
}

export default CreateButton
