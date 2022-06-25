
const analyzeWorker = require("./analyzeWorker")

module.exports.startWorkers = async () => {
    analyzeWorker.start()
}
     
module.exports.stopWorkers = () => {
    analyzeWorker.stop()
}
