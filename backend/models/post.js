module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', {
        user_id: DataTypes.INTEGER,
        title: DataTypes.TEXT,
        content: DataTypes.TEXT
    }, {
        tableName: 'posts',
        timestamps: true,
        paranoid: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at'
    });

    return Post;
};