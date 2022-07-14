global.__SERVER__ = true;

if (process.env.NODE_ENV === 'development') {
	require('./dev-env-vars.js');
}

// require('babel-register');
// require('ignore-styles').default(['.sass', '.scss', '.styl']);
var appPort = process.env.PORT || 3000;
var app = require('./src/server').default;

app.listen(appPort, function() {});

process.on('unhandledRejection', function(reason, p) {
	console.log("Possibly Unhandled Rejection at: Promise ", p, " reason: ", reason);
	// application specific logging here
});
