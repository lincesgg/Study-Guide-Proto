import TogglebleContentLine from ".././components/TogglebleContentLine";

export
function createContent(name, description, parentContent, subContents, reviewDates, id) {
    // If Arguments Are Invalid return {}
    for (const arg of arguments) {
        if (arg == undefined) throw Error("ALL Parameter of createContent MUST BE != undefined!");
    }

    // --- 
    let content = {
        id,
        name,
        description,
        subContents,
        parentContent,
        
        studyreviewDates: reviewDates
    }

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