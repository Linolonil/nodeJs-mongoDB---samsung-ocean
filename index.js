const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors")
// const url = "mongodb://localhost:27017";
// const url = "mongodb://127.0.0.1:27017";
const url = "mongodb+srv://admin:n2mHsvk07wkvcqt7@cluster0.gzavpjb.mongodb.net/";

// const url = "mongodb+srv://admin:V90K7ehx2krw7OlM@cluster0.gbnr4oi.mongodb.net";
const dbName = "jornada-backend-agosto-23";
const client = new MongoClient(url);

const main = async () => {
  console.info("Conectando ao banco de dados...");
  await client.connect();
  console.info("Banco de dados conectado com sucesso!");

  const db = client.db(dbName);
  const collection = db.collection("herois");

  const app = express();

  // Habilitamos o processamento de JSON
  app.use(express.json());
  // Habilitando cors no backend
  app.use(cors())

  // Endpoint Principal
  app.get("/", function (req, res) {
    res.send("Coloque a rota /herois para visualizar em JSON os herois salvos no banco do atlas db.");
  });

  // Read All -> [GET] /herois
 app.get("/herois", async function (req, res) {
    const itens = await collection.find().toArray();
    res.json(itens);
});

  // Create -> [POST] /herois
  app.post("/herois", async function (req, res) {
    // console.log(req.body, typeof req.body);

    // Extrai o nome do Body da Request (Corpo da Requisição)
    const item = req.body;

    // Inserir o item na collection
    await collection.insertOne(item);

    // Enviamos uma resposta de sucesso
    res.status(201).send(item);
  });

  // Read By Id -> [GET] /herois/:id
  app.get("/herois/:id", async function (req, res) {
    try {
      const id = parseInt(req.params.id);

      // Consulta o item na coleção "herois" com base no índice
      const item = await collection.findOne({}, { skip: id });

      if (!item) {
        return res.status(404).send("Item não encontrado");
      }

      res.send(item);
    } catch (error) {
      console.error("Erro ao buscar o item:", error);
      res.status(500).send("Erro interno do servidor");
    }
  });

  // Update -> [PUT] /herois/:id
  app.put("/herois/:id", async function (req, res) {
    // Pegamos o parâmetro de rota ID
    const id = req.params.id;

    // Extrai o nome do Body da Request (Corpo da Requisição)
    const item = req.body;

    // Atualizamos a informação na collection
    await collection.updateOne({ _id: new ObjectId(id) }, { $set: item });

    res.send(item);
  });

  // Delete -> [DELETE] /herois/:id
  app.delete("/herois/:id", async function (req, res) {
    try{
      // Pegamos o parâmetro de rota ID
      const id = req.params.id;
      
    // Excluir o item da collection
    await collection.deleteOne({ _id: new ObjectId(id) });
    
    res.status(204).send(`Arquivo deletado com sucesso! ${id}`);

  }catch(error){
    res.send(`Erro em deletar o id ${id} ${error}`)
  }
    
  });

  app.listen(process.env.PORT || 3000);
};

main();
