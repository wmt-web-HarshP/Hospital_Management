require("dotenv/config");
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
const app = express();
const { MongoError } = require("mongodb");

//resolvers and typedefs setup
const patientsTypeDefs = require("./graphql/patients/typedefs");
const patientsResolvers = require("./graphql/patients/resolvers");

const scheduleTypedefs = require("./graphql/schedules/typedefs");
const scheduleResolvers = require("./graphql/schedules/resolvers");

const doctorsTypeDefs = require("./graphql/doctors/typedefs");
const doctorsResolvers = require("./graphql/doctors/resolvers");

const workingHoursTypedef = require("./graphql/workingHours/typedefs");
const workingHoursResolver = require("./graphql/workingHours/resolvers");
//static file setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public"));
app.use("/css", express.static(path.join(__dirname, "public", "css")));
app.use("/js", express.static(path.join(__dirname, "public", "js")));

app.get("/", (req, res) => {
  res.render("index");
});

async function startServer() {
  const server = new ApolloServer({
    typeDefs: [
      patientsTypeDefs,
      doctorsTypeDefs,
      workingHoursTypedef,
      scheduleTypedefs,
    ],
    resolvers: [
      patientsResolvers,
      doctorsResolvers,
      workingHoursResolver,
      scheduleResolvers,
    ],formatError: (error) => {
      if (error.originalError instanceof MongoError) {
        return {
          message: error.message,
          code: "DATABASE_ERROR",
          httpStatusCode: 500,
        };
      }
      if (error.originalError && error.originalError.extensions) {
        const { code, httpStatusCode } = error.originalError.extensions;
        return {
          message: error.message,
          code: code || "INTERNAL_SERVER_ERROR",
          httpStatusCode: httpStatusCode || 500,
        };
      }
      return error;
    },
  });

  PORT = process.env.PORT;
  const { url } = await startStandaloneServer(server, {
    listen: { port: PORT },
  });
  console.log(`🚀 Server ready at ${url}`);

  await mongoose
    .connect(process.env.CONNECTION_STRING)
    .then(() => console.log("MONGODB CONNECTED!!"))
    .catch((err) => console.error(err));
}

startServer();

app.listen(3001, () => {
  console.log("listening on port 3001");
});