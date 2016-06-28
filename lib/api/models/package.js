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
  isPublic:     type.boolean().default(config.isPublic),
  readme:       type.string(),
  license:      type.string(),
  metadata: {
      avatar_url:         type.string(),
      html_url:           type.string(),
      description:        type.string(),
      created_at:         type.string(),
      updated_at:         type.string(),
      pushed_at:          type.string(),
      homepage:           type.string(),
      stargazers_count:   type.string(),
      watchers_count:     type.string(),
      language:           type.string(),
      forks_count:        type.string(),
      open_issues_count:  type.string(),
      forks_count:        type.string(),
      subscribers_count:  type.string(),
      maintainers:        [type.string()],
      url:                type.string(),
      type:               type.string(),
      versions:           [type.string()],
      dependencies:       [type.string()],
      keywords:           [type.string()],
      license:            type.string(),
      jsonDescription:    type.string(),
      version:            type.string()

  }
}, {
  pk: "name" // set primary key
});

Package.ensureIndex("name");


module.exports = Package;