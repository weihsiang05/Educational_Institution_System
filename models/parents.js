'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Parents extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Parents.hasMany(models.studentParent)
    }
  }
  Parents.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Parents',
  });
  return Parents;
};