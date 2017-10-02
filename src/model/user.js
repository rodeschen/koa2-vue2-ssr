export default function user(sequelize, DataTypes) {
    return sequelize.define('user', {
        'email': {
            type: DataTypes.STRING(50)
        },
        'name': {
            type: DataTypes.STRING(50),
            primaryKey: true
        },
        'token': { // type 1 : sha256 password , other : access_token
            type: DataTypes.STRING(255)
        },
        'status': {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        'type': {
            type: DataTypes.INTEGER,
            defaultValue: 0 //0 : local ,1 : google ,2 : facebook
        }
    }, {
        freezeTableName: true,
        timestamps: false
    });
}