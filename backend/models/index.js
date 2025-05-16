'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  // sequelize = new Sequelize(config.database, config.username, config.password, config);
  sequelize = new Sequelize({
    dialect: config.dialect,
    storage: config.storage,
    logging: config.logging || false // Optional: disable logging for cleaner output
  });
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection to SQLite has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

testConnection();

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./user')(sequelize, Sequelize.DataTypes);
db.Profile = require('./profile')(sequelize, Sequelize.DataTypes);
db.Post = require('./post')(sequelize, Sequelize.DataTypes);
db.Tag = require('./tag')(sequelize, Sequelize.DataTypes);
db.PostTag = require('./posttag')(sequelize, Sequelize.DataTypes);
db.Taggable = require('./taggable')(sequelize, Sequelize.DataTypes);
db.Video = require('./video')(sequelize, Sequelize.DataTypes);


db.User.hasOne(db.Profile, { foreignKey: 'user_id' });
db.User.hasMany(db.Post, { foreignKey: 'user_id' });

db.Profile.belongsTo(db.User, { foreignKey: 'user_id' });

db.Post.belongsTo(db.User, { foreignKey: 'user_id' });
db.Post.belongsToMany(db.Tag, {
  through: db.PostTag,
  foreignKey: 'post_id'
});

db.Tag.belongsToMany(db.Post, {
  through: db.PostTag,
  foreignKey: 'tag_id'
});

db.Tag.belongsToMany(db.User, {
  through: {
    model: db.Taggable,
    unique: false,
    scope: {
      taggable_type: 'user'
    }
  },
  foreignKey: 'tag_id',
  otherKey: 'taggable_id',
  as: 'users'
})

db.Tag.belongsToMany(db.Video, {
  through: {
    model: db.Taggable,
    unique: false,
  scope: {
      taggable_type: 'video'
  }
  },
  foreignKey: 'tag_id',
  otherKey: 'taggable_id',
  as: 'videos'
});

db.User.belongsToMany(db.Tag, {
  through: {
    model: db.Taggable,
    unique: false,
    scope: {
      taggable_type: 'user'
    }
  },
  foreignKey: 'taggable_id',
  otherKey: 'tag_id',
  as: 'tags'
});

db.Video.belongsToMany(db.Tag, {
  through: {
    model: db.Taggable,
    unique: false,
  scope: {
      taggable_type: 'video'
  }
  },
  foreignKey: 'taggable_id',
  otherKey: 'tag_id',
  as: 'tags'
})

module.exports = db;
