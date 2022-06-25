const Result = require("../utils/result")


exports.getTableSettings = () => {

    let result = new Result()

    return result.setResult({
        resultsColumns: [
            {
                name: "Наименование СУБД",
                propertyName: "databaseName",
                width: 240,
                order: 0
            }, 
            {
                name: "Метрика",
                propertyName: "metricName",
                width: 250,
                order: 1
            },
            {
                name: "Статус",
                propertyName: "status",
                width: 200,
                order: 2
            },
            {
                name: "Время начала проверки",
                propertyName: "createDate",
                width: 200,
                order: 2
            },
            {
                name: "Значение метрики",
                propertyName: "metricValue",
                width: 327,
                order: 3
            }
        ]
    })
}