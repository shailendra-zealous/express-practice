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
        paranoid: true
    });

    Profile.associate = models => {
        Profile.belongsTo(models.User, { foreignKey: 'user_id' });
    };

    return Profile;
};