import React, {useState, useRef, useEffect} from 'react'

import { toast } from 'react-toastify'
import emitError from '../utils/emitError.js'

import Panel from "./Panel.jsx"
import CreateButton from './createButton.jsx'
import EditButton from "./EditButton.jsx"

import { createContent, emptyContent } from '../controller/content.jsx'

import {content_props_panel, content_props_panel__container, create_button, closeButton, date__button, add_date__button, date_input_container, remove_date__button, date_input_collection_container} from "../styles/contentPropsPanel.module.css"

const ContentPropsPanel = ({className="", closePanel, contentsList={}, saveContent, eventManager, setContentList, crrContent, getContentById, ...props}) => {

  // ---
  const [dateInputsContent, setDateInputsContent] = useState(['']);

  const formsRefs = {};
  formsRefs["nameInput"] = useRef(null);
  formsRefs["descriptionInput"] = useRef(null);
  formsRefs["reviewDatesCollection"] = useRef(null);
  formsRefs["parentContentIdInput"] = useRef(null);

  // dateInputsContent Handling ---
  const addOneDateInput = () => setDateInputsContent(prev => prev.concat(""))
  const removeOneDateInput = (idx) => setDateInputsContent(prev => {
    prev.splice(idx, 1)
    return [...prev]
  })
  const updateDateInputAtIdx = (idx, newVal) => setDateInputsContent(prev => {
    prev[idx] = newVal
    return [...prev]
  })


  // ---
  function getFormsData() {
    const formsData = {};
    formsData["name"] = document.querySelector("input#contentName").value
    formsData["description"] = document.querySelector("textarea#contentDescription").value
    formsData["reviewDates"] = dateInputsContent
    formsData["parentContentID"] = document.querySelector("input#parentContentID").value

    return formsData
  }

  function saveContentDescribedOnForms() {
    const formsData = getFormsData()

    formsData["parentContent"] = getContentById(formsData["parentContentID"])
    if (formsData["parentContent"] == undefined) {
      emitError("Invalid parentContentID")
      return {};
    }

    for (const noEmptyProp of ["name", "reviewDates"]) {
      if (formsData[noEmptyProp].length <= 0) {
        emitError("Some Required Prop Is Empty!")
        return;
      }
    }

    // TODO Further More Add Possibility to Add More Dates At Once]
    const createdContent = saveContent(formsData["name"], formsData["description"], formsData["parentContent"], [], formsData["reviewDates"]) 

    toast.success("Content Created !", {
      autoClose: 500,
      hideProgressBar: true,
      closeOnClick: true
    })

    crrContent.current = emptyContent
    fillFormsWContentData(emptyContent)
  }

  function updateContentRenderedAsForms() {
    const formsContentProps = getFormsData()

    formsContentProps.parentContent = getContentById(formsContentProps.parentContentID)
    if (formsContentProps.parentContent == undefined) {
        emitError("Invalid parentContentID")
    }

    
    for (const prop of ["name", "description", "reviewDates", "parentContent"]) {
      setContentList(prev => {
        prev[crrContent.current.id][prop] = formsContentProps[prop]
        return {...prev}
      })
    }

    toast.success("Content Edited!", {
      position: "top-right",
      autoClose: 500,
      hideProgressBar: true,
      closeOnClick:true
    }) 

  }

  function fillFormsWContentData(content) {
    formsRefs["nameInput"].current.value = content.name
    formsRefs["descriptionInput"].current.value = content.description
    setDateInputsContent(content.studyreviewDates)
    formsRefs["parentContentIdInput"].current.value = content?.parentContent?.id ?? ""
  }

  useEffect(() => {
    eventManager.on("forms.populateWContent", fillFormsWContentData)
    eventManager.on("withFormsData", (cb) => {
      const formsData = getFormsData()
      return cb(formsData)
    })
  }, [])


  // Rendering ---
  return (
    <div className={`${content_props_panel__container} ${className} content_data_forms_component`} {...props}> 
      <Panel className={content_props_panel}>

        <div className={closeButton} onClick={closePanel}>
          X
        </div>

        <fieldset>
          <label htmlFor="contentName">Content Name </label>
          <br/>
          <input type="text" name="contentName" id="contentName" ref={formsRefs["nameInput"]} required/>
        </fieldset>

        <fieldset>
          <label htmlFor="contentDescription">Description </label>
          <br/>
          <textarea name="contentDescription" id="contentDescription" wrap="soft" ref={formsRefs["descriptionInput"]}/>
        </fieldset>

        <fieldset>
          <label htmlFor="reviewsDates">Review Dates </label>
          <br/>

          <div className={date_input_collection_container} ref={formsRefs["reviewDatesCollection"]}>
            {dateInputsContent.map((val, idx) => (
              <div className={date_input_container} key={`input_dates__${idx}__${val}`}>

                {dateInputsContent.length <= 1 ? "" : 
                  <button className={`${date__button} ${remove_date__button}`} onClick={() => removeOneDateInput(idx)}>-</button>
                }
                <input type="date" name="reviewsDates" id="reviewsDates" value={dateInputsContent[idx]} onInput={(evt) => {updateDateInputAtIdx(idx, evt.target.value)}} required/>
              </div>
            ))}
          </div>
          <button className={`${date__button} ${add_date__button}`} onClick={addOneDateInput}>
            +
          </button>
        </fieldset>

        <fieldset>
          <label htmlFor="parentContentID">Parent Content </label>
          <br/>
          <input type="text" name="parentContentID" id="parentContentID" list="parentContentId__list" ref={formsRefs["parentContentIdInput"]} required/>
          <datalist id="parentContentId__list">
            {Object.values(contentsList).map(content => {
              return <option key={`parentContent__list__${content.id}`} label={content.getRepresentation()} value={content.id}/>
            })}
          </datalist>
        </fieldset>

        {
         crrContent.type == "inCreation" ?
         <CreateButton className={create_button} onClick={saveContentDescribedOnForms}/>
         :
         <EditButton className={create_button} onClick={updateContentRenderedAsForms}/>
        }


      </Panel>
    </div>
  )
}

export default ContentPropsPanel
