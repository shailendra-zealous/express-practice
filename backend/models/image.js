const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    const Image = sequelize.define('Image', {
        file_url: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        imageableId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        imageableType: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        tableName: 'images',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });

    return Image;
};