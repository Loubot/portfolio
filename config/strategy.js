  
var passportJWT = require("passport-jwt");
var models = require('../models')
var cfg = require("./strategy-config.js");  
var ExtractJwt = passportJWT.ExtractJwt;  
var Strategy = passportJWT.Strategy;  
var params = {  
    secretOrKey: cfg.jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

module.exports = function( passport ) {  
    var strategy = new Strategy(params, function(payload, done) {
        console.log( payload )
        var user = models.User.findOne({
            where: { id: payload.id }
        }).then( user => {
            if (user) {
                return done(null, {
                    id: user.id,
                    email: user.email
                });
            } else {
                return done(new Error("User not found"), null);
            }
        });
        
    });
    passport.use(strategy);
    return {
        initialize: function() {
            return passport.initialize();
        },
        authenticate: function() {
            return passport.authenticate("jwt", cfg.jwtSession);
        }
    };
};