module.exports = {
    renderResponse: function (res, success, data) {
        if (success) {
            res.send({
                success: true,
                data: data
            })
        } else {
            res.status(404).send({
                success: false,
                data: data
            })
        }
    }
}