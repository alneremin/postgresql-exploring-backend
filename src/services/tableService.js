const Result = require("../utils/result")


exports.getTableSettings = () => {

    let result = new Result()

    return result.setResult({
        resultsColumns: [
            {
                name: "Наименование СУБД",
                propertyName: "databaseName",
                width: 400,
                order: 0
            }, 
            {
                name: "Проверяемые метрики",
                propertyName: "metrics",
                width: 300,
                order: 1
            },
            {
                name: "Время проверки",
                propertyName: "checkTime",
                width: 200,
                order: 2
            },
            {
                name: "Результаты",
                propertyName: "results",
                width: 327,
                order: 3
            }
        ]
    })
}