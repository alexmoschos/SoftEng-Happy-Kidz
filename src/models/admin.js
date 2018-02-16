module.exports = function(sequelize, DataTypes) {
    // Admin Model
    const Admin = sequelize.define('admin', {
        adminId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'admin',
        timestamps: false
    });
    return Admin;
};