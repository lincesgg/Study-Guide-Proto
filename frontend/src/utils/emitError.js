import {toast} from "react-toastify"

export default
function emitError(msg, config={}) {
    return toast.error(msg, {
        position: "top-right",
        autoClose: 850,
        hideProgressBar: true,
        closeOnClick:true,
        ...config
    })         
}