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
import LineGraph from "./components/lineGraph.jsx";
import BarGraph from "./components/BarGraph.jsx";

import "./styles/setup.css"
import "./styles/generalStyles.css"
import "./styles/main.css"
// import {time_panel, time_panel__header} from "./styles/time_panel.module.css"
import {contentsPanel, addTopicToReview_button, addTopicToReview_button__icon} from "./styles/contentsPanel.module.css"
import {hidden} from "./styles/utils.module.css"
import {most_forgeted_contents_panels} from "./styles/mostForgetedContentPanel.module.css"

import {createContent, emptyContent} from "./controller/content.jsx"
import { forgetPercentageBasedOnReviewAmount, howManyDaysToForgetInFunctionOfRevisionsAmount } from "./controller/utils/forgettingMath.js";
import { FcSerialTasks } from "react-icons/fc";


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
    // const [rootContent, setRootContent] = useState({})
    const rootContent = useRef({})
    
    

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

        const isParentAContent = ("id" in parentContent && "parentContent" in parentContent)
        if (!isParentAContent && Object.keys(rootContent.current).length != 0){
            throw Error("Tried to Create content With No Parent Content, but ONLY root can have no parentContent and ROOT alredy Exists!")
        }


        const createdContent = createContent(name, description, parentContent, subContents, reviewDates, newContentId)
        append2SavedContents(createdContent, newContentId)

        return createdContent
    }

    // ---
    //FIXME root should not be save
    function serializeSavedContents(contents) {
        const {[rootContent.current.id]:root, ...contentsToSerialize} = {...contents}

        for (const contentId in contentsToSerialize) {
            const content = {...contentsToSerialize[contentId]}

            const contentToSerialize = {
                name: content.name,
                description: content.description,
                id: content.id,
                studyreviewDates: content.studyreviewDates,
                subContentsIDs: content.subContents.map(subContent => subContent.id),
                parentContentID : content.parentContent == rootContent.current ? "ROOT" : content.parentContent?.id,
                // parentContentID : content.parentContent == rootContent.current || !content.parentContent?.id ? "ROOT" : content.parentContent?.id,

            }
            contentsToSerialize[contentId] = contentToSerialize
    
        }

        // "" for garantee that a string will be send, same if contentsToSerialize is undefined
        const serializedContents = JSON.stringify(contentsToSerialize, null, 4)
        return (!serializedContents || serializedContents == "{}") ? "" : serializedContents
    }

    function deserializeSavedContents(contentsToSerialize) {
        const JsonDeserializedContents = JSON.parse(contentsToSerialize);
        const deserializedContents = JSON.parse(contentsToSerialize);

        for (const contentId in deserializedContents) {
            const content = deserializedContents[contentId]

            deserializedContents[contentId] = createContent(content.name, content.description, content.parentContent ?? {}, content.subContents ?? [], content.studyreviewDates ?? [], content.id)
        }

        // Stablish relation Between Content ONLY after all content Was deserialized into Content Objects
        for (const contentId in deserializedContents) {
            const deserializedContent = deserializedContents[contentId]
            const serializedContent = JsonDeserializedContents[contentId]

            if (serializedContent.parentContentID == "ROOT")
                deserializedContent.parentContent = rootContent.current
            else
                deserializedContent.parentContent = deserializedContents[serializedContent.parentContentID]

            deserializedContent.subContents = serializedContent.subContentsIDs.map(subContentId => deserializedContents[subContentId])
        }

        return deserializedContents
        
    }

    // Handling Forms ---
    const initCloseFormsOnEscPressed = () => {
        document.addEventListener('keydown', evt => {
            if (evt.key == "Esc" || evt.key == "Escape") 
                setFormsVisibility(false)
        })

    }

    function renderFormsAsCreationForms() {
        initCloseFormsOnEscPressed()

        if (formsCrrContent.type != "inCreation") {
            saveformsCrrContentToProcessLater()
            setFormsCrrContent({current: formsContents.current.inCreation, type:"inCreation"})
            eventManager.emit("forms.populateWContent", formsContents.current.inCreation)
        }

        setFormsVisibility(true)
    }

    function renderFormsAsEditForms(nextContent) {
        initCloseFormsOnEscPressed()

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

    function closeForms() {
        document.removeEventListener('keydown', initCloseFormsOnEscPressed)
        setFormsVisibility(false)
    }


    // ---
    useEffect(() => {
        // openContentFormsEmpty()
        setFormsVisibility(false)

        const crrRootContent = saveContent("root", "", {}, [], [""])
        rootContent.current = crrRootContent;

        (async () => {
            const savedSerializedContentsOnOS = await window.electronAPI.getSavedContent()
            
            try {
                const savedContentsOnOS = deserializeSavedContents(savedSerializedContentsOnOS)
                setSavedContents(prev => {
                    return {[rootContent.current.id]:rootContent.current, ...savedContentsOnOS}
                })
            }
            catch (err) {
                console.error(`Error on Data Deserialization: ${err}`)
            }



            // const B = saveContent("Eletroestatica", "Voaz", rootContent.current, [], ["2024-07-13", "2024-08-17", "2024-08-02"])
            // const K = saveContent("Campos Elétricos", "Voaz", B, [], ["2024-08-13"])
            // const C = saveContent("Circuitos", "Voaz", B, [], ["2024-07-13"])
            // const W = saveContent("aaaa", "Voaz", rootContent.current, [], ["2024-08-18"])
            // const Y = saveContent("kkkk", "Voaz", rootContent.current, [], ["2024-08-13", "2024-10-02", "2023-12-27"])
        })();

    }, [])


    // ---
    const {[rootContent.id]:root, ...validCOntents} = savedContents
    const leastToMostMemoryContents = Object.values(validCOntents).toSorted(({memoryPercentage: aMemPercentage}, {memoryPercentage: bMemPercentage}) => {
        // Target: Descrescent Order
        return aMemPercentage - bMemPercentage
    })

    const contentsToRender = leastToMostMemoryContents.slice(0, 5)
    
    const datasetsLabels = contentsToRender.map(content => content.name)
    const datasetsData = {}
    datasetsData.memoryPercentage = {}
    datasetsData.memoryPercentage.label = "Memory %"
    datasetsData.memoryPercentage.data = contentsToRender.map(content => content.memoryPercentage)

    datasetsData.daysToForgetContentAfterLastReview = {}
    datasetsData.daysToForgetContentAfterLastReview.label = "Days Since Last Review To Forget"
        datasetsData.daysToForgetContentAfterLastReview.data = contentsToRender.map(content => {
        const reviewAmount = content.studyreviewDates.length
        return howManyDaysToForgetInFunctionOfRevisionsAmount(reviewAmount)
    })


    // ---
    useEffect(() => {
        const serializedContent = serializeSavedContents(savedContents)
        if (saveContent.length > 0) {
            window.electronAPI.saveContent(serializedContent)
        }
    }, [savedContents])



    return (<div className="main__page_container">

        <div className="ContentPropsPanel__container">
            <ContentPropsPanel id="contentForms" contentsList={savedContents} closePanel={closeForms}
            eventManager={eventManager} saveContent={saveContent} crrContent={formsCrrContent} setContentList={setSavedContents} getContentById={getContentById}
            />
            <div className="ContentPropsPanel__background" style={{backgroundColor:"rgba(0, 0, 0, .3)", width:"100%"}}/>
        </div>


        {/* <Panel className={time_panel}> 
            <h3 className={time_panel__header}><b style={{display:"inline-block", marginBottom: "var(--S)"}}>3 dias</b>  <br/>Para o ENEM</h3>
        </Panel> */}

        <HeadedPanel className={contentsPanel} title="Review" style={{marginLeft:"calc(-1 * var(--M))"}}>
            <div className="content_Panel__content_container">
            {("renderAsToggleble" in rootContent.current) ? rootContent.current.renderAsToggleble(true, renderFormsAsEditForms) : ""}
            </div>
            <button className={addTopicToReview_button} onClick={renderFormsAsCreationForms}><LuCopyPlus className={addTopicToReview_button__icon}/></button>
        </HeadedPanel>


        <Panel className={most_forgeted_contents_panels} style={{height: "50%", marginRight:"calc(-1 * var(--M))"}}>
        <BarGraph
                labels={datasetsLabels}
                datasets={Object.values(datasetsData)}
                style={{width:"100%", height:"100%"}}
            />
        </Panel>

        <ToastContainer/>
    </div>
    );
}

// Adding This Component As Root
const reactRoot = document.getElementById("reactRoot");
createRoot(reactRoot).render(<Main/>);

