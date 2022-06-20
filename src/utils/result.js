
class Result {
    constructor() {
        this.result = {}
        this.error = null
        this.pagination = null
        this.status = 200
    }

    setUnknownError() {
        this.status = 404
        this.error = { message: "Данные не найдены" }
        return this
    }

    setServerError(message = null) {
        this.status = 500
        this.error = { message: message ?? "Непредвиденная ошибка на сервере" }
        return this
    }

    setNotFound(message = null) {
        this.status = 404
        this.error = { message: message ?? "Объект не найден" }
        return this
    }

    setUnprocessable(message = null, data = null) {
        this.status = 422
        this.error = { message: message ?? "Некорректные параметры" }
        if(data) {
            this.error = {
                ...data,
                ...this.error
            }
        }
        return this
    }

    setConflict() {
        this.status = 409
        this.error = { message: "Конфликт ресурсов" }
        return this
    }


    setUnauthorized() {
        this.status = 401
        this.error = { message: "Необходимо авторизоваться" }
        return this
    }

    setForbidden() {
        this.status = 403
        this.error = { message: "Недостаточно прав" }
        return this
    }


    setStatus(status) {
        this.status = status
        return this
    }

    setError(code, message, data) {
        this.status = code
        this.error = { message: message ?? "Некорректные параметры" }
        if(data) {
            this.error = {
                ...data,
                ...this.error
            }
        }
        return this
    }

    setErrorData(error) {
        this.error = error
    }

    setErrorMessage(message) {
        this.error = { message }
        return this
    }

    setErrorAndStatus(status, message) {
        this.error = { message }
        this.status = status
        return this
    }

    setPagination({ page, perPage, pageCount, total }) {
        this.pagination = {
            page: page || 1,
            perPage: perPage || 10,
            pageCount: pageCount,
            total: total
        }
        return this
    }

    setResult(data) {
        this.result = data
        return this
    }
}
module.exports = Result