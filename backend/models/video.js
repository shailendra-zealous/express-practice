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

    Video.associate = models => {
        Video.hasMany(models.Taggable, {
            foreignKey: 'taggable_id',
            constraints: false,
            scope: {
                taggable_type: 'videos'
            }
        });
    };

    return Video;
};
