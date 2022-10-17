const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo y le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    "Category",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      status: {
        type: DataTypes.STRING,
        allowNull: false,   
      },
    },
    {
      timestamps: true,
    }
  );
};
