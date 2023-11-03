import { Sequelize } from "sequelize";

const sequelize = new Sequelize('postgres', 'postgres', 'postgres', {
  host: 'localhost',
  port: 5532,
  dialect: 'postgres',
  logging: false,
});

export default sequelize;