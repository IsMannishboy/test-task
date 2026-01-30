module.exports = (sequelize, DataTypes) => {
    const Deal = sequelize.define('Deal', {
        dealname: {
            type: DataTypes.STRING,
            allowNull: false,  
            unique: true
        },
        sold: { 
            type: DataTypes.INTEGER,
            allowNull: false

    
        },
        description:{
            type:DataTypes.STRING,
            allowNull:true
        }
    }
)
    return Deal;
}