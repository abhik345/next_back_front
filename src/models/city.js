const City = (sequelize, DataTypes) => {
  return sequelize.define(
    "City",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      stateId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "States",
          key: "id",
        },
        onDelete: "CASCADE",
      },
    },
    {
      tableName: "Cities",
      timestamps: true,
    }
  );
};

City.associate = (models) => {
  City.belongsTo(models.State, { foreignKey: "stateId", as: "state" });
};

export default City;
