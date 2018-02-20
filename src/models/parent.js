
module.exports = function(sequelize, DataTypes) {
    // Parent Model
    const Parent = sequelize.define('parent', {
        parentId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        wallet: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0            
        },
        mailNotifications: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    }, {
        tableName: 'parent',
        timestamps: false
    });
    return Parent;
};