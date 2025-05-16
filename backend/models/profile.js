const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    const Profile = sequelize.define('Profile', {
        user_id: {
            type: DataTypes.INTEGER,
            unique: true
        },
        bio: DataTypes.TEXT
    }, {
        tableName: 'profiles',
        timestamps: true,
        paranoid: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at'
    });

    return Profile;
};