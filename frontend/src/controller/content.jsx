import TogglebleContentLine from "../components/TogglebleContentLine";
import { forgetPercentageBasedOnReviewAmount } from "./utils/forgettingMath";

export
function createContent(name, description, parentContent, subContents, reviewDates, id) {

    // If Arguments Invalid, Throw Err
    for (const arg of arguments) {
        if (arg == undefined) 
            throw Error("ALL Parameter of createContent MUST BE != undefined!");
    }

    // --- 
    let content = {
        id,
        name,
        description,
        subContents,
        parentContent,
        
        _studyreviewDates: [],
        set studyreviewDates(newVal) {
            this._studyreviewDates = newVal

            // Update memoryPercentage --
            const lastReviewDate = new Date(content.studyreviewDates.slice(-1))
            
            const dayInMs = 1000 * 60 * 60 * 24
            const timeSinceLastReviewMs = Date.now() - lastReviewDate
            const daysSinceLastReviewMinutes = timeSinceLastReviewMs / dayInMs
        
            this.memoryPercentage = forgetPercentageBasedOnReviewAmount(daysSinceLastReviewMinutes, this.studyreviewDates.length).toFixed(2)
        },
        get studyreviewDates() {
            return this._studyreviewDates
        },
        
        memoryPercentage: 0
    }
    content.studyreviewDates = reviewDates

    // ---
    function getRepresentation() {
        return `${content.name} ${("name" in content.parentContent) ? " ← "+content.parentContent.getRepresentation() : ""}`
    }

    function renderAsToggleble(firstRendered=false, onContentInformationRequired, tabMargin="var(--L)") {
        return (
            <TogglebleContentLine content={content.name} key={`togglebleContentLine${content.id}`}
            onContentInformationRequired={() => onContentInformationRequired(content)}
            style={firstRendered? {marginLeft:"0"} : {marginLeft:tabMargin}}
            >
                {content.subContents.map(subContent => {
                    return subContent.renderAsToggleble(false, onContentInformationRequired, tabMargin)
                })}
            </TogglebleContentLine>
        )
    }
  
    // ---
    content = Object.assign(content, {renderAsToggleble, getRepresentation})

    if ("subContents" in parentContent) {
        parentContent.subContents.push(content)
    }

    subContents.forEach(subContent => {
        subContent.parentContent = content
    })

    // ---
    return content
}

export const emptyContent = createContent("", "", {}, [], [""], "")