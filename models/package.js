var config = require('../config/config.js'),
    thinky = require('../config/thinky.js'),
    r = thinky.r,
    type = thinky.type,
    shortid = require('shortid'),
    Errors = thinky.Errors;


var Package = thinky.createModel("Package", {
  id:           type.string().default(shortid.generate),
  name:         type.string(),
  type:         type.string().default("package"),
  owner:        type.string(),
  description:  type.string(),
  keywords:     [type.string()],
  url:          type.string(),
  created_at:   type.date().default(r.now()),
  hits:         type.number(),
  stars:        type.number(),
  isPublic:     type.boolean().default(config.isPublic)
}, {
  pk: "name" // set primary key
});

Package.ensureIndex("name");


module.exports = Package;