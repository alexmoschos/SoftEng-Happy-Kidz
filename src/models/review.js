module.exports = function(sequelize, DataTypes) {
    // Review Model
    const Review = sequelize.define('review', {
        parentId: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        eventId: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        text: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        tableName: 'review',
        timestamps: false
    });
    return Review;
};