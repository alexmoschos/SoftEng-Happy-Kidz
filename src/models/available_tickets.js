module.exports = function(sequelize, DataTypes) {
    // Available tickets model
    const AvailableTickets = sequelize.define('availableTickets', {
        eventId: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        category_name: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        count: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'availableTickets',
        timestamps: false
    });
    return AvailableTickets;
};