const { body, query, validationResult } = require("express-validator");

exports.testCaseInfovalidation = () => [
  body("featuresName")
    .notEmpty()
    .isString()
    .withMessage("Please Enter A String..!"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    next();
  },
];

exports.testCaseReasonValidation = () => [
  body("id").isMongoId().withMessage("Please id Should be mongoose Object Id "),
  body("reason").notEmpty().isString().withMessage("Please Enter A String..!"),
  body("executed")
    .notEmpty()
    .isString()
    .withMessage("Please Enter A String..!"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    next();
  },
];

exports.rowDataValidation = () => [
  body("id").isMongoId().withMessage("Please id Should be mongoose Object Id "),
  body("TestCaseID")
    .notEmpty()
    .withMessage("required TestCaseID")
    .isString()
    .withMessage("Please Enter A String..!"),
  body("Priority")
    .notEmpty()
    .isString()
    .withMessage("Please Enter A String..!"),
  body("TestcaseDescription")
    .notEmpty()
    .isString()
    .withMessage("Please Enter A String..!"),
  body("featuresName")
    .notEmpty()
    .isString()
    .withMessage("Please Enter A String..!"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    next();
  },
];

exports.mongoIdValidation = (field) => [
  query(field)
    .isMongoId()
    .withMessage("Please id Should be mongoose Object Id "),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    next();
  },
];

exports.mongoIdValidations = (field) => [
  body(field)
    .isMongoId()
    .withMessage("Please id Should be mongoose Object Id "),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    next();
  },
];
