module.exports = (sequelize, DataTypes) => {
    const Tag = sequelize.define('Tag', {
        name: DataTypes.TEXT
    }, {
        tableName: 'tags',
        timestamps: true,
        paranoid: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at'
    });

    Tag.associate = models => {
        Tag.belongsToMany(models.Post, {
            through: models.PostTag,
            foreignKey: 'tag_id'
        });

        Tag.hasMany(models.Taggable, { foreignKey: 'tag_id' });
    };

    return Tag;
};
