module.exports = (sequelize, DataTypes) => {
    const PostTag = sequelize.define('PostTag', {
        post_id: DataTypes.INTEGER,
        tag_id: DataTypes.INTEGER
    }, {
        tableName: 'post_tag',
        timestamps: false,
    });

    return PostTag;
};
