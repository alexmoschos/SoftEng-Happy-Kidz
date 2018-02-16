module.exports = function(sequelize, DataTypes) {
    // Favorites Model
    const Favorites = sequelize.define('favorites', {
        parentId: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        organizerId: {
            type: DataTypes.INTEGER,
            primaryKey: true
        }
    }, {
        tableName: 'favorites',
        timestamps: false
    });
    return Favorites;
};