module.exports = function(sequelize, DataTypes) {
    // Bought Tickets Model
    const BoughtTickets = sequelize.define('boughtTickets', {
        ticketId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        eventId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        parentId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        transactionId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        startTime: {
            type: DataTypes.DATE,
            allowNull: false
        },
        endTime: {
            type: DataTypes.DATE,
            allowNull: false
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
        
    }, {
        tableName: 'boughtTickets',
        timestamps: false
    });
    return BoughtTickets;
};