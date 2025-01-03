const User = (sequelize, DataTypes) => {
    return sequelize.define(
      "User",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        username: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        timestamps: true,
      }
    );
  };

  User.associate = (models) => {
    User.hasMany(models.Post, { foreignKey: "userId", as: "user" });
  }
 
  export default User;
  