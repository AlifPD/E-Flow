'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attendances extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Attendances.belongsTo(models.Users, {foreignKey: "user_id"})
    }
  }
  Attendances.init({
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    evidence: {
      type: DataTypes.STRING,
      allowNull: true
    },
    clock_in: {
      type: DataTypes.DATE,
      allowNull: true
    },
    clock_out: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Attendances',
    tableName: 'Attendances',
    freezeTableName: true,
    paranoid: true,
    timestamps: true
  });
  return Attendances;
};