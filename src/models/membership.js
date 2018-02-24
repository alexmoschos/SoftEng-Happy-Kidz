module.exports = function(sequelize, DataTypes) {
    // Membership Model
    const Membership = sequelize.define('membership', {
        parentId: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            allowNull: false
        },
        startDate: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        expiryDate: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        membershipTier: {
            type: DataTypes.STRING,
            allowNull: false
        },
        maxTicketsPerEvent: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'membership',
        timestamps: false
    });
    return Membership;
};