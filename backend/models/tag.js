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

    return Tag;
};
