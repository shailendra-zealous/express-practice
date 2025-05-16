const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        name: DataTypes.TEXT,
        email: {
            type: DataTypes.TEXT,
            unique: true
        },
        password: DataTypes.TEXT
    }, {
        tableName: 'users',
        timestamps: true,
        paranoid: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at'
    });

    return User;
};