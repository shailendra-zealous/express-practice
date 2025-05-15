module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', {
        user_id: DataTypes.INTEGER,
        title: DataTypes.TEXT,
        content: DataTypes.TEXT
    }, {
        tableName: 'posts',
        timestamps: true,
        paranoid: true
    });

    Post.associate = models => {
        Post.belongsTo(models.User, { foreignKey: 'user_id' });
        Post.belongsToMany(models.Tag, {
            through: models.PostTag,
            foreignKey: 'post_id'
        });
    };

    return Post;
};