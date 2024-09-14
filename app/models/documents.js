module.exports = (sequelize, Sequelize) => {
  const DocumentsModel = sequelize.define(
    "documents",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      filename: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      originalname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      fileSize: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      fileType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      document_url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      tableName: "documents",
    }
  );

  return DocumentsModel;
};
