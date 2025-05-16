module.exports = (sequelize, DataTypes) => {
    const Video = sequelize.define('Video', {
        title: DataTypes.TEXT
    }, {
        tableName: 'videos',
        timestamps: true,
        paranoid: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at'
    });

    return Video;
};
