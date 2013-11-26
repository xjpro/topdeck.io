app.factory("User", [function() {

    var User = {
        sessionId: Cookies.get("topdeck_session")
    };

    if(!User.sessionId) {
        User.sessionId = guid();
        Cookies.set("topdeck_session", User.sessionId, {
            secure: false,
            expires: 60 * 60 * 24 * 45 // 45 days
        });
    }

    return User;
}]);