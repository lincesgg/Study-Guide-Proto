import React from 'react'


import { HiMiniPencilSquare } from "react-icons/hi2";
import CustomButton from './CustomButton'

import {edit_button, button_icon} from "../styles/customButton.module.css"

const EditButton = ({className, children="Edit", ...props}) => {
    return (
      <CustomButton className={`${edit_button} ${className}`} {...props}>
          <HiMiniPencilSquare className={button_icon}/>
          {children}
      </CustomButton>
    )
  }

export default EditButton
