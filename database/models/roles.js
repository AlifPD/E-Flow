'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Roles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Roles.belongsTo(models.Users, { foreignKey: "user_id" })
      Roles.belongsTo(models.RoleTypes, { foreignKey: "role_type_id" })
    }
  }
  Roles.init({
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id"
      }
    },
    role_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "RoleTypes",
        key: "id"
      }
    }
  }, {
    sequelize,
    modelName: 'Roles',
    tableName: 'Roles',
    freezeTableName: true,
    timestamps: true
  });
  return Roles;
};