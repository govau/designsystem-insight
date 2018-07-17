const Express = require( 'express' );
const Path = require( 'path' );

//GLOBALS
const Server = Express();

/**
 * Check that server is requested securely middle-ware
 *
 * @param  {object}   request  - Express request object
 * @param  {object}   response - Express response object
 * @param  {function} next     - Express next function
 *
 * @return {object}            - Express object
 */
const ForwardSSL = ( request, response, next ) => {
	if( process.argv.indexOf( 'local' ) === -1 ) {
		if( request.headers['x-forwarded-proto'] === 'https' ) {
			return next();
		}

		response.redirect(`https://${ request.headers.host }${ request.originalUrl }`);
	}
	else {
		return next();
	}
};

/**
 * Start server
 */
Server
	// First we make sure all requests come through HTTPS
	.all( '*', ForwardSSL )

	// Now static assets
	.use( '/', Express.static( Path.normalize(`${ __dirname }/../site/`) ) )

	// Now let’s start this thing!
	.listen( 8080, () => {
		console.log(`Server listening on port 8080`);
});

// app.get('/', ( request, response ) => {
// 	response.sendFile( path.normalize( `${__dirname}/../index.html` ) )
// });
//
// app.listen( 3000, () => console.log('Server listening on port 3000!' ) );
