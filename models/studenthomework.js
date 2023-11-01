'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class studentHomework extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      studentHomework.belongsTo(models.student, {
        foreignKey: 'studentId'
      })
      studentHomework.belongsTo(models.subject, {
        foreignKey: 'subjectId'
      })
    }
  }
  studentHomework.init({
    note: DataTypes.STRING,
    studentId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    subjectId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'studentHomework',
  });
  return studentHomework;
};