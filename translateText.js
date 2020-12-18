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
const port = 8000;

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
    host: "165.227.204.70:" + port,
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
 *         example: Hello UNCC!!
 *       from:
 *         type: string
 *         example: en
 *       to:
 *         type: array
 *         items:
 *          type: string
 *          example: es
 *       api_version:
 *         type: string
 *         example: '3.0'
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
 *          400:
 *              description: Bad Request
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
    .then(
      function (response) {
        res.status(200).send(response.data);
      },
      (error) => {
        res.status(400).send(error);
      }
    );
});

/**
 * @swagger
 * definitions:
 *   sentenceLength:
 *     properties:
 *       text:
 *         type: string
 *         example: Hello!
 *       api_version:
 *         type: string
 *         example: '3.0'
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
 *          400:
 *              description: Bad request
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
    .then(
      function (response) {
        res.status(200).send(response.data);
      },
      (error) => {
        res.status(400).send(error);
      }
    );
});

/**
 * @swagger
 * definitions:
 *   dictionaryLookup:
 *      properties:
 *       text:
 *         type: string
 *         example: shark
 *       from:
 *         type: string
 *         example: en
 *       to:
 *         type: string
 *         example: de
 *       api_version:
 *         type: string
 *         example: '3.0'
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
 *          400:
 *              description: Bad request
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
  }).then(
    function (response) {
      res.status(200).send(response.data);
    },
    (error) => {
      res.status(400).send(error);
    }
  );
});

app.listen(port, () => {
  console.log(`Listening at http://134.122.16.20:${port}`);
});
