import {useState} from 'react'

import { IoMdArrowDropright, IoMdArrowDropdown } from "react-icons/io";

import {toggleble_line, content_container, toggleble_line_icon, children_content_container,} from "../styles/togglebleLine.module.css"

const TogglebleLine = ({content="Content", children="", className="", ...restProps}) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const toggleState = () => setIsCollapsed((prev) => !prev)

  return (
    <div className={`${toggleble_line} ${className}`} iscollapsed={isCollapsed.toString()} {...restProps}>
        <div className={content_container}>
            {
                children == "" ?
                "-  " :
                <button type="button" name="Toggle" onClick={toggleState}>
                    <IoMdArrowDropright className={toggleble_line_icon}/>
                </button>
            }
            {content}
        </div>

        <div className={children_content_container}>
            {children}
        </div>
    </div>
  )
}

export default TogglebleLine
