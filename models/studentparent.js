'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class studentParent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      studentParent.belongsTo(models.student, {
        foreignKey: 'studentId'
      })
      studentParent.belongsTo(models.Parents, {
        foreignKey: 'parentId'
      })
    }
  }
  studentParent.init({
    note: DataTypes.STRING,
    studentId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    parentId: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'studentParent',
  });
  return studentParent;
};