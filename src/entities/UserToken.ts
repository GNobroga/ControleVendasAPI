import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import sequelize from "../config/db/connection";
import { v4 as uuidv4 } from "uuid";
import { User } from "./User";
import { NOW } from "sequelize";

export class UserToken extends Model<InferAttributes<UserToken>, InferCreationAttributes<UserToken>> {
  declare id: CreationOptional<string>;
  user_id?: CreationOptional<string>;
  createdAt?: Date;
  updatedAt?: Date;
};

UserToken.init(
  {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
    }
  },
  {
    tableName: 'user_tokens',
    sequelize,
    timestamps: true,
    createdAt: true,
    updatedAt: true,
  }
);

User.hasMany(UserToken, {
  foreignKey: {
    allowNull: false,
    name: 'user_id',
  },
  onDelete: 'CASCADE',
})
