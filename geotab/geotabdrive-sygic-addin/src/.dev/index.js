/**
 * Entry point for serving the app on localhost
 * Allows several UI features to be displayed to improve
 * development without adding them in to the final
 * build sent to production
 * 
 * ******************** NOTE ********************
 * 
 *  Any features built into this file will not be included in
 * the addin build. Any changes you want included should be in
 * app/index.js instead.
 * 
 * **********************************************
 */


// Global object is used to simulate the api, state, and geotab objects
global.api
global.state = require('./state');
global.geotab = {
    addin: {}, 
    customButtons: {}, 
    isDriveAddin: true
}
// Importing the app rules -> Where addin will be described

require('../app/scripts/main');

// Importing dev-specific packages
import './rison';
import './login/loginTemplate.js';
import GeotabLogin from './login/loginLogic';
import GeotabApi from './api';

// Building navbar
// Exposing handler to let the translate function have access to it
import './navbar/NavBuilder';

// Global Translate function
global.state.translate = function(target, language) {
    
    // First translation from initialize doesn't pass a language in. Will cause problems is language is undefined
    if (typeof language !== 'undefined'){
        localStorage.language = language;
        location.reload();
    }

    // Primary behaviour passes HTMLElement, but function needs to support string translation as well
    if (typeof target === 'string'){
        // Do translation
        let translation = global.translator.translateSentence(target);
        // return translated string
        return translation;
    }
}

/* Logic */
const loginLogic = new GeotabLogin(global.geotab.isDriveAddin, GeotabApi);


// Handling the blur toggle
require('./ToggleHandler');



// Setup complete
/* Addin Logic */
require('../app/index');
