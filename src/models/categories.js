module.exports = function(sequelize, DataTypes) {
    // Categories Model
    const Categories = sequelize.define('categories', {
        categoryName: {
            type: DataTypes.STRING,
            primaryKey: true
        }
    }, {
        tableName: 'categories',
        timestamps: false
    });
    return Categories;
};