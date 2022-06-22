const Result = require("../utils/result")
const Sequelize = require('sequelize');

exports.getBaseStatus = async () => {
    const result = new Result()
    const statuses = {};
    try {
        const mysql = new Sequelize("test", "test", "test", {
            dialect: "mysql",
            host: "localhost", // Мой ip вместо локал хоста
            port: "3306"
        });
        await mysql.authenticate()
        statuses["mysql"] =  true;
    } catch (error) {
        statuses["mysql"] = false;
    }

    try {
        const mssql = new Sequelize("TEST", "SA", "fakePassw0rd", {
            dialect: "mssql",
            host: "localhost",
            dialectOptions: {
                options: {
                    useUTC: false,
                    dateFirst: 1,
                }
            }
          });
        await mssql.authenticate()
        statuses["mssql"] =  true;
    } catch (error) {
        statuses["mssql"] = false;
    }

    try {
        const mariadb = new Sequelize("test", "test1", "test", {
            dialect: "mariadb",
            host: "localhost",
            port: "3808"
        });
        await mariadb.authenticate()
        statuses["mariadb"] =  true;
    } catch (error) {
        statuses["mariadb"] = false;
    }
    // Подключись к своей или посмотри что не так, вообще ни в какую не хочет работать, бесконечно вести и все
    // try {
    //     const postgres = new Sequelize("test", "postgres", "postgres", {
    //         dialect: "postgres",
    //         host: "localhost"
    //     });
    //     await postgres.authenticate()
    //     statuses["postgres"] =  true;
    // } catch (error) {
    //     statuses["postgres"] = false;
    // }

    result.result = {statuses};
    return result
}