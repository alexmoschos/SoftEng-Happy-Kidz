module.exports = function(sequelize, DataTypes) {
    // Subscription Model
    const Subscription = sequelize.define('subscription', {
        parentId: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        organizerId: {
            type: DataTypes.INTEGER,
            primaryKey: true
        }
    }, {
        tableName: 'subscription',
        timestamps: false
    });
    return Subscription;
};