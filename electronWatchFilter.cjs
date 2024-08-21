module.exports = function electronWatchFilter(filePath) {
    return filePath.split(`\\`).splice(-1)[0] === "main.js"
}