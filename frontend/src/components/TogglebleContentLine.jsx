import React from 'react'

import TogglebleLine from './togglebleLine';

import { MdOutlineInfo } from "react-icons/md";

import {toggleble_content_line__icon} from "../styles/TogglebleContentLine.module.css"


const TogglebleContentLine = ({content, onContentInformationRequired, ...restProps}) => {
  return (
    <TogglebleLine 
    content={(
    <>
      <button onClick={onContentInformationRequired}>
          <MdOutlineInfo className={toggleble_content_line__icon}/>
      </button>
    {content} 
    </>
    )}
    {...restProps}
    />
  )
}

export default TogglebleContentLine
