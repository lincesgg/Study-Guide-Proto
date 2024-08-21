import http from "node:http"
import fs from "node:fs/promises"
import path from "node:path";
import mime from "mime-types"

export default
function createStaticServer(originPath="/serv.js") {
    const server = http.createServer((req, res) => {
        const filePath = req.url == "/" ? "/index.html" : req.url
        try {
            fs.readFile(path.join(originPath, filePath))
                .then((pageHtml) => {
                    // Strict MIME type checking is enforced for module scripts per HTML spec
                    res.setHeader("Content-Type", mime.lookup(filePath.split(".").slice(-1)[0]))
                    res.writeHead(200)
                    res.end(pageHtml)
                })  
                .catch((err) => {
                    console.log(`Err On Electron Server: ${err}`)
                    res.writeHead(500)
                    res.end(err.message)
                })
        }
    
        catch (err) {
            res.writeHead(500)
            res.end(err)
        }
    
    });
    
    return server
}