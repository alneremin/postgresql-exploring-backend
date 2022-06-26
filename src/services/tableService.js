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
                width: 150,
                order: 2
            },
            {
                name: "Кол-во записей",
                propertyName: "rowCount",
                width: 200,
                order: 2
            },
            {
                name: "Действие",
                propertyName: "action",
                width: 200,
                order: 2
            },
            {
                name: "Значение метрики",
                propertyName: "metricValue",
                width: 327,
                order: 3
            },
            {
                name: "Время начала проверки",
                propertyName: "createDate",
                width: 200,
                order: 2
            },
        ],
        compareColumns: [
            {
                name: "Метрика",
                propertyName: "metric",
                width: 200,
                order: 0
            },
            {
                name: "Кол-во записей",
                propertyName: "rowCount",
                width: 180,
                order: 2
            },
            {
                name: "Действие",
                propertyName: "action",
                width: 100,
                order: 2
            },
            {
                name: "СУБД №1",
                propertyName: "dbms1",
                width: 150,
                order: 1
            },
            {
                name: "СУБД №2",
                propertyName: "dbms2",
                width: 150,
                order: 2
            }
        ]
    })
}