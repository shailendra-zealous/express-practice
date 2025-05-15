module.exports = (sequelize, DataTypes) => {
    const PostTag = sequelize.define('PostTag', {
        post_id: DataTypes.INTEGER,
        tag_id: DataTypes.INTEGER
    }, {
        tableName: 'post_tag',
        timestamps: true,
        paranoid: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at'
    });

    return PostTag;
};
