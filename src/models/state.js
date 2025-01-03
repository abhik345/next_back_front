const State = (sequelize, DataTypes) => {
  return sequelize.define(
    "State",
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
    },
    {
      tableName: "States",
      timestamps: true,
    }
  );
};

State.associate = (models) => {
  State.hasMany(models.City, { foreignKey: "stateId", as: "cities" });
};

export default State;
