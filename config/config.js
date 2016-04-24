var config = {};

// general info
config.version = 1.0;
config.name = 'The unofficial Bower registry';
config.description = 'This is the unofficial Bower registry, home of 45k+ packages.';

// defaults
config.port = 3333;
config.defaultSize = 30;

config.thinkHost = 'localhost';
config.thinkPort = 28015;
config.thinkAuthKey = '';
config.thinkDB = 'cookiejar';

// pub/priv registry
config.isPublic = true;
config.skipValidation = false;
config.skipNormalization = false;



module.exports = config;
