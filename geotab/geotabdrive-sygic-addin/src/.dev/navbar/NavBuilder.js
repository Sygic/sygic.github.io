
let NavFactory = require('./NavFactory');
let NavHandler = require('./NavHandler');
let props = require('./props');
let language = localStorage.language ? localStorage.language : 'en';

let factory = new NavFactory(language);
let handler = new NavHandler(factory, props);


handler.enableDisplayToggle();
