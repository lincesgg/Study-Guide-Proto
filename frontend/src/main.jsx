import {useState, useEffect, useRef} from "react"
import {createRoot} from "react-dom/client";
import {v4 as newUUID} from "uuid"

import createEventEmitter from "./controller/utils/eventEmitter.js"

import { LuCopyPlus } from "react-icons/lu";
import {ToastContainer, toast} from "react-toastify"
import "react-toastify/ReactToastify.css"

import Panel from "./components/Panel"
import HeadedPanel from "./components/HeadedPanel";
import TogglebleContentLine from "./components/TogglebleContentLine";
import ContentPropsPanel from "./components/ContentPropsPanel.jsx";

import "./styles/setup.css"
import "./styles/generalStyles.css"
import "./styles/main.css"
// import {time_panel, time_panel__header} from "./styles/time_panel.module.css"
import {contentsPanel, addTopicToReview_button, addTopicToReview_button__icon} from "./styles/contentsPanel.module.css"
import {hidden} from "./styles/utils.module.css"

import {createContent, emptyContent} from "./controller/content.jsx"


// Open Forms
function setFormsVisibility(isVisible) {
    const contentCreationPanel = document.getElementById("contentForms")

    if (isVisible)
        contentCreationPanel.classList.remove(hidden)

    else
        contentCreationPanel.classList.add(hidden)
}

function Main() {
    // ---
    //FIXME Transform In REf
    const eventManager = useState(createEventEmitter())[0];

    const [savedContents, setSavedContents] = useState({})
    const [rootContent, setRootContent] = useState({})
    
    

    const [formsCrrContent, setFormsCrrContent] = useState({current: emptyContent, type:"inCreation"});
        const formsContents = useRef({
            inCreation: emptyContent,
            inEdition: emptyContent
        })

    function getContentById(id) {
        if (!(id in savedContents)) 
            return;
      
        return savedContents[id]
    }

    const saveformsCrrContentToProcessLater = () => {
        eventManager.emit("withFormsData", (formsData) => {
            const newFormsContents = Object.assign({}, formsCrrContent.current)

            newFormsContents.name = formsData.name
            newFormsContents.description = formsData.description
            newFormsContents.reviewDates = formsData.reviewDates
            // FIXME ID In Input?

            formsContents.current[formsCrrContent.type] = newFormsContents
        })
    }

    function append2SavedContents(content2Save, id) {
        if (typeof content2Save != "object" || Array.isArray(content2Save)) 
            throw new Error("content2Save MUST be an content Object")
        
        setSavedContents((prev) => {
            prev[id] = content2Save
            return {...prev}
        })

    }

    function saveContent(name, description, parentContent, subContents, reviewDates) {
        const newContentId = newUUID()

        const createdContent = createContent(name, description, parentContent, subContents, reviewDates, newContentId)
        append2SavedContents(createdContent, newContentId)

        return createdContent
    }


    // Handling Forms ---
    function renderFormsAsCreationForms() {
        if (formsCrrContent.type != "inCreation") {
            saveformsCrrContentToProcessLater()
            setFormsCrrContent({current: formsContents.current.inCreation, type:"inCreation"})
            eventManager.emit("forms.populateWContent", formsContents.current.inCreation)
        }

        setFormsVisibility(true)
    }

    function renderFormsAsEditForms(nextContent) {
        // If you Opened Forms To Content That Was in Edition, then created One, and then Opened The Same Content in Edition restore forms values
        if (nextContent.id == formsContents.current.inEdition.id && formsCrrContent.type != "inEdition") {
            saveformsCrrContentToProcessLater()
            setFormsCrrContent({current: nextContent, type:"inEdition"})
            eventManager.emit("forms.populateWContent", formsContents.current.inEdition)

        // If Last Content != Next Content || You Need To Restore Edition Forms Data Showing != Content Than last Opened
        } else if (nextContent.id != formsContents.current.inEdition.id) {
            saveformsCrrContentToProcessLater()
            setFormsCrrContent({current: nextContent, type:"inEdition"})
            eventManager.emit("forms.populateWContent", nextContent)
        }
        
        setFormsVisibility(true)
    }


    // ---
    useEffect(() => {
        // openContentFormsEmpty()
        setFormsVisibility(false)

        const rootContent = saveContent("root", "", {}, [], [""])
        setRootContent(rootContent)

        const K = saveContent("Campos Elétricos", "Voaz", {}, [], ["2024-08-13"])
        const C = saveContent("Circuitos", "Voaz", {}, [], ["2024-08-13"])
        const B = saveContent("Eletroestatica", "Voaz", rootContent, [K, C], ["2024-07-13", "2024-08-13"])

    }, [])


    return (<>

        <div className="ContentPropsPanel__container">
            <ContentPropsPanel id="contentForms" contentsList={savedContents} closePanel={()=>setFormsVisibility(false)} 
            eventManager={eventManager} saveContent={saveContent} crrContent={formsCrrContent} setContentList={setSavedContents} getContentById={getContentById}
            />
            <div className="ContentPropsPanel__background" style={{backgroundColor:"rgba(0, 0, 0, .3)", width:"100%"}}/>
        </div>


        {/* <Panel className={time_panel}> 
            <h3 className={time_panel__header}><b style={{display:"inline-block", marginBottom: "var(--S)"}}>3 dias</b>  <br/>Para o ENEM</h3>
        </Panel> */}

        <HeadedPanel className={contentsPanel} title="Review">
            <div className="content_Panel__content_container">
            {("renderAsToggleble" in rootContent) ? rootContent.renderAsToggleble(true, renderFormsAsEditForms) : ""}
            </div>
            <button className={addTopicToReview_button} onClick={renderFormsAsCreationForms}><LuCopyPlus className={addTopicToReview_button__icon}/></button>
        </HeadedPanel>

        <ToastContainer/>
    </>
    );
}

// Adding This Component As Root
const reactRoot = document.getElementById("reactRoot");
createRoot(reactRoot).render(<Main/>);

