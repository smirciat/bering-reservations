'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('Reservation', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    village: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    comment: DataTypes.STRING,
    ticket: DataTypes.STRING,
    direction: DataTypes.STRING,
    number: DataTypes.STRING,
    weight: DataTypes.INTEGER,
    date: DataTypes.DATE,
    active: DataTypes.BOOLEAN
  });
}
