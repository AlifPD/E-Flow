'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RoleTypes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      RoleTypes.hasMany(models.Roles, {foreignKey: "role_type_id"})
    }
  }
  RoleTypes.init({
    role_name: DataTypes.STRING,
    allowNull: false,
    unique:true
  }, {
    sequelize,
    modelName: 'RoleTypes',
    tableName: 'RoleTypes',
    freezeTableName: true,
    paranoid: true,
    timestamps: true
  });
  return RoleTypes;
};