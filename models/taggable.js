
module.exports = (sequelize, DataTypes) => {
    const Taggable = sequelize.define('Taggable', {
        tag_id: DataTypes.INTEGER,
        taggable_id: DataTypes.INTEGER,
        taggable_type: DataTypes.STRING
    }, {
        tableName: 'taggables',
        timestamps: true,
        paranoid: true
    });

    Taggable.associate = models => {
        Taggable.belongsTo(models.Tag, { foreignKey: 'tag_id' });

        // Optional: define polymorphic association manually in business logic
    };

    return Taggable;
};
