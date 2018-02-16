module.exports = function(sequelize, DataTypes) {
    // Membership Model
    const Membership = sequelize.define('membership', {
        membershipId: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        parentId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        expiryDate: {
            type: DataTypes.DATE,
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