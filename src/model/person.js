import { DataTypes, Sequelize } from 'sequelize'

export const sequelize = new Sequelize({
  dialect: "postgres",
  host: "localhost",
  username: "postgres",
  password: "password",
  database: "rinha",
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true
  }
})

export const PersonModel = sequelize.define('people', {
  id: {
    primaryKey: true,
    type: DataTypes.UUIDV4,
    defaultValue: Sequelize.UUIDV4
  },
  apelido: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nascimento: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  stack: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
    defaultValue: []
  }
})

sequelize.authenticate().then(() => {
   console.log('Connection has been established successfully.')
}).catch((error) => {
   console.error('Unable to connect to the database: ', error)
})