app.factory("User", [function() {

    var User = {};
    User.sessionId = Cookies.get("topdeck_session");

    if(!User.sessionId) {
        User.sessionId = guid();
        console.log(User.sessionId);
        Cookies.set("topdeck_session", User.sessionId, {
            //domain: "localhost",
            secure: false,
            expires: 60 * 60 * 24 * 45 // 45 days
        });

        console.log(new Date());
        console.log(new Date().setYear(new Date().getFullYear()+1));
    }
    console.log(User.sessionId);

    return User;
}]);