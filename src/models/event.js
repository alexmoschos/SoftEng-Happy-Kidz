module.exports = function(sequelize, DataTypes) {
    // Event Model
    const Event = sequelize.define('event', {
        eventId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        organizerId: {
            type: DataTypes.INTEGER
        },
        title: {
            type: DataTypes.STRING,
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
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        categoryName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        geoLon: {
            type: DataTypes.STRING,
            allowNull: false
        },
        geoLat: {
            type: DataTypes.STRING,
            allowNull: false
        },
        geoAdress: {
            type: DataTypes.STRING,
            allowNull: false
        },
        ticketPrice: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        discount: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        ticketCount: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        minAge: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        maxAge: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        pictures: {
            type: DataTypes.STRING,
            allowNull: false
        },
        isVerified: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        clickNumber: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    }, {
        tableName: 'event',
        timestamps: true,
        createdAt: false,
        updatedAt: 'updatedAt',
        deletedAt: false
    });
    return Event;
};