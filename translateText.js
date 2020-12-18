const express = require("express");
const bodyparser = require("body-parser");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");

const axios = require("axios").default;
const { v4: uuidv4 } = require("uuid");
const app = express();
require("dotenv").config();

app.use(bodyparser.json());
var subscriptionKey = process.env.API_KEY;
var endpoint = "https://api.cognitive.microsofttranslator.com/";
var location = "global";

//swagger Definition
const def = {
  swaggerDefinition: {
    info: {
      version: "1.0.0",
      title: "Text Translator Azure Api",
      description:
        "An AI service for real-time text translation, sentence length and dictionary lookup.",
      contact: {
        name: "Yash Kanodia",
      },
    },
    host: "localhost:3000",
    basePath: "/",
  },
  apis: ["./translateText.js"],
};

const specs = swaggerJsdoc(def);
app.use(cors());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

/**
 * @swagger
 * definitions:
 *   Translation:
 *     properties:
 *       text:
 *         type: string
 *       from:
 *         type: string
 *       to:
 *         type: string
 *       api_version:
 *         type: string
 */
/**
 * @swagger
 * /translateText:
 *    post:
 *      description: Translate Text
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: Data Translated
 *          500:
 *              description: Error
 *      parameters:
 *          - name: Translation
 *            description: Translation Object
 *            in: body
 *            required: true
 *            schema:
 *              $ref: '#/definitions/Translation'
 *
 */

app.post("/translateText", (req, res) => {
  console.log(req.params);
  axios
    .request({
      url: endpoint + "/translate",
      method: "post",
      headers: {
        "Ocp-Apim-Subscription-Key": subscriptionKey,
        "Ocp-Apim-Subscription-Region": location,
        "Content-type": "application/json",
        "X-ClientTraceId": uuidv4().toString(),
      },
      params: {
        "api-version": req.body.api_version,
        from: req.body.from,
        to: req.body.to,
      },
      data: [
        {
          text: req.body.text,
        },
      ],
      responseType: "json",
    })
    .then(function (response) {
      res.send(response.data);
    });
});

/**
 * @swagger
 * definitions:
 *   sentenceLength:
 *     properties:
 *       text:
 *         type: string
 *       api_version:
 *         type: string
 */
/**
 * @swagger
 * /sentenceLength:
 *    post:
 *      description: Length of sentence without translation
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: Provided length of sentence without translation
 *          500:
 *              description: Error
 *      parameters:
 *          - name: sentenceLength
 *            description: sentence length object
 *            in: body
 *            required: true
 *            schema:
 *              $ref: '#/definitions/sentenceLength'
 *
 */

app.post("/sentenceLength", (req, res) => {
  console.log(req.params);
  axios
    .request({
      baseURL: endpoint,
      url: "/breaksentence",
      method: "post",
      headers: {
        "Ocp-Apim-Subscription-Key": subscriptionKey,
        "Ocp-Apim-Subscription-Region": location,
        "Content-type": "application/json",
        "X-ClientTraceId": uuidv4().toString(),
      },
      params: {
        "api-version": req.body.api_version,
      },
      data: [
        {
          text: req.body.text,
        },
      ],
      responseType: "json",
    })
    .then(function (response) {
      res.send(response.data);
    });
});

/**
 * @swagger
 * definitions:
 *   dictionaryLookup:
 *      properties:
 *       text:
 *         type: string
 *       from:
 *         type: string
 *       to:
 *         type: string
 *       api_version:
 *         type: string
 */
/**
 * @swagger
 * /dictionary:
 *    post:
 *      description: Dictionary Lookup
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: Dictionary Lookedup with alternate translations
 *          500:
 *              description: Error
 *      parameters:
 *          - name: dictionaryLookup
 *            description: Dictionary Lookup object
 *            in: body
 *            required: true
 *            schema:
 *              $ref: '#/definitions/dictionaryLookup'
 *
 */
app.post("/dictionary", (req, res) => {
  axios({
    url: endpoint + "/dictionary/lookup",
    method: "post",
    headers: {
      "Ocp-Apim-Subscription-Key": subscriptionKey,
      "Ocp-Apim-Subscription-Region": location,
      "Content-type": "application/json",
      "X-ClientTraceId": uuidv4().toString(),
    },
    params: {
      "api-version": req.body.api_version,
      from: req.body.from,
      to: req.body.to,
    },
    data: [
      {
        text: req.body.text,
      },
    ],
    responseType: "json",
  }).then(function (response) {
    res.send(response.data);
  });
});

app.listen(3000, () => {
  console.log(`Listening at http://localhost:3000`);
});
