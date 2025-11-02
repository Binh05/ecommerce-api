class UserController {
    index(req, res) {
        res.send("User route")
    }
}

export default new UserController();