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

        const rootContent = saveContent("root", "", {}, [], [""])
        setRootContent(rootContent)

        const K = saveContent("Campos Elétricos", "Voaz", {}, [], ["2024-08-13"])
        const C = saveContent("Circuitos", "Voaz", {}, [], ["2024-07-13"])
        const B = saveContent("Eletroestatica", "Voaz", rootContent, [K, C], ["2024-07-13", "2024-08-17", "2024-08-02"])
        const W = saveContent("aaaa", "Voaz", rootContent, [], ["2024-08-18"])
        const Y = saveContent("kkkk", "Voaz", rootContent, [], ["2024-08-13", "2024-10-02", "2023-12-27"])

        console.log(savedContents)


    }, [])


    const {[rootContent.id]:root, ...validCOntents} = savedContents
    const leastToMostMemoryContents = Object.values(validCOntents).toSorted(({memoryPercentage: aMemPercentage}, {memoryPercentage: bMemPercentage}) => {
        // Target: Descrescent Order
        return aMemPercentage - bMemPercentage
    })
    console.log(leastToMostMemoryContents)

    const contentsToRender = leastToMostMemoryContents.slice(0, 5)
    
    console.log("UPDATED")
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
    
    
    // let sortedReviewDatesToRender = []
    // contentsToRender.forEach(({studyreviewDates}) => {
    //     console.log(studyreviewDates)
    //     for (const strDate of studyreviewDates) {
    //         const date = new Date(strDate)

    //         if (date == "" || sortedReviewDatesToRender.includes(date))
    //             continue
    //         else
    //             sortedReviewDatesToRender.push(date)
    //     }
    // })
    // sortedReviewDatesToRender.push(Date.now())
    // sortedReviewDatesToRender.sort((b, a) => a - b)
    


    // const contentMemoryPercentageAtEachReviewDate = []
    // // Key Dates 
    // //  = Content's own and other review dates
    // //  = If At other's review Date, memory became 0, then Day That Memory Became 0
    // //  = Today
    // const contentsMemoryPercentageOnKeyDates = []
    // for (const contentToRenderIdx in contentsToRender) {
    //     // contentMemoryPercentageAtEachReviewDate.push([])
    //     contentsMemoryPercentageOnKeyDates.push([])
    //     const nextContentToRender = contentsToRender[contentToRenderIdx]
    //     const reviewsDatesAsObj = nextContentToRender.studyreviewDates.map(dateStr => new Date(dateStr))


    //     for (const crrDateToRender of sortedReviewDatesToRender) {

    //         // Identify The First Review Date Before crrDateToRenderStr for each Content
    //         // & Quantify time passed since crrDateToRenderStr
    //         // & and Review AMount at that point
    //         let daysSinceCrrDateToRender = -1
    //         let reviewAmountAtCrrDateToRender = 0

    //         for (const crrContentReviewDateIdx in reviewsDatesAsObj) {

    //             const crrContentReviewDate = reviewsDatesAsObj[crrContentReviewDateIdx]
    //             const timeSinceDateInProcess = crrDateToRender - crrContentReviewDate

    //             if (timeSinceDateInProcess < 0)
    //                 break

    //             else {
    //                 const dayInMs = 1000 * 60 * 60 * 24
    //                 daysSinceCrrDateToRender = timeSinceDateInProcess / (dayInMs)
    //                 reviewAmountAtCrrDateToRender = parseInt(crrContentReviewDateIdx) + 1
    //             }
    //         }

    //         // ---
    //         const memoryPercentageAtDateInProcess = daysSinceCrrDateToRender < 0 ? -100 : forgetPercentageBasedOnReviewAmount(daysSinceCrrDateToRender, reviewAmountAtCrrDateToRender)
    //         // contentMemoryPercentageAtEachReviewDate[contentToRenderIdx].push(memoryPercentageAtDateInProcess)
    //         contentsMemoryPercentageOnKeyDates[contentToRenderIdx].push({x:crrDateToRender, y:memoryPercentageAtDateInProcess})
    //     }
    //     // console.log(contentsMemoryPercentageOnKeyDates)
    // }






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
            {("renderAsToggleble" in rootContent) ? rootContent.renderAsToggleble(true, renderFormsAsEditForms) : ""}
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

            {/* <LineGraph
            graphTitle="Most Forgeted Contents"
            datasetsData={contentsMemoryPercentageOnKeyDates}
            // xLabels={sortedReviewDatesToRender}
            // datasetsYLabels={contentMemoryPercentageAtEachReviewDate}
            datasetsTitles={contentsToRender.map(content => content.name)}
            /> */}


        <ToastContainer/>
    </div>
    );
}

// Adding This Component As Root
const reactRoot = document.getElementById("reactRoot");
createRoot(reactRoot).render(<Main/>);

