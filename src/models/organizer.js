module.exports = function(sequelize, DataTypes) {
    // Organizer model
    const Organizer = sequelize.define('organizer', {
        organizerId: {
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
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        webpage: {
            type: DataTypes.STRING,
            allowNull: true
        },
        avgRating: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        avatar: {
            type: DataTypes.STRING,
            allowNull: false
        },
        isVerified: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        documents: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'organizer',
        timestamps: false
    });
    return Organizer;
};