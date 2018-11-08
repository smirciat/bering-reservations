'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('Chat', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    username: DataTypes.STRING,
    content: DataTypes.STRING,
    date: DataTypes.DATE,
    fromUserId: DataTypes.STRING,
    imageUrl: DataTypes.STRING
  });
}
