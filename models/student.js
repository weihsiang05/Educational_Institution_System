'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class student extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      student.belongsTo(models.user, {
        foreignKey: 'userId'
      })
      student.hasMany(models.studentHomework)
      student.hasMany(models.studentParent)
    }
  }
  student.init({
    FiristName: DataTypes.STRING,
    LastName: DataTypes.STRING,
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'student',
  });
  return student;
};