import React from 'react'

import Panel from './Panel'
import Header from './header'

import panelCls from "../styles/panel.module.css"

const HeadedPanel = ({title, className="", children, ...restProps}) => {
  return (
    <Panel className={`${className} ${panelCls.headed_panel} headed_panel_component`} {...restProps}>
      <Header className={panelCls.panel__header} {...{title}}/>
      {children}
    </Panel>
  )
}

export default HeadedPanel
