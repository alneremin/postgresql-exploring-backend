const { EXPLORING_ACTIONS } = require("../utils/enum");
const difficultRead = require("./actions/difficultRead");
const difficultWrite = require("./actions/difficultWrite");
const simpleRead = require("./actions/simpleRead");
const simpleWrite = require("./actions/simpleWrite");


module.exports = (db, task) => {

    switch(task.action) {
        case EXPLORING_ACTIONS.simpleWrite: {
            return simpleWrite(db, task.rowCount);
        }
        case EXPLORING_ACTIONS.simpleRead: {
            return simpleRead(db);
        }
        case EXPLORING_ACTIONS.difficultWrite: {
            return difficultWrite(db, task.rowCount)
        }
        case EXPLORING_ACTIONS.difficultRead: {
            return difficultRead(db)
        }
    }
}