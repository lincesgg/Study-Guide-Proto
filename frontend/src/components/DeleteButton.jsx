import React from 'react'

import { MdOutlineDelete } from "react-icons/md";

import CustomButton from './CustomButton'

import {delete_button, button_icon} from "../styles/customButton.module.css"

const DeleteButton = ({className, children="Delete", ...props}) => {
    return (
      <CustomButton className={`${delete_button} ${className}`} {...props}>
          <MdOutlineDelete className={button_icon}/>
          {children}
      </CustomButton>
    )
  }

export default DeleteButton
