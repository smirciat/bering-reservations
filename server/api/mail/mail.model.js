'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('Mail', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    res: DataTypes.STRING,
    uid: DataTypes.STRING
  });
}
