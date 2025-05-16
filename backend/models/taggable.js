module.exports = (sequelize, DataTypes) => {
    const Taggable = sequelize.define('Taggable', {
        tag_id: DataTypes.INTEGER,
        taggable_id: DataTypes.INTEGER,
        taggable_type: DataTypes.STRING
    }, {
        tableName: 'taggables',
        timestamps: false,
        id: false,
    });

    Taggable.removeAttribute('id');
    
    return Taggable;
};
