const testcase = require("./testcase.model");
const feature = require("./feature.model");
const clonetestcase = require("./testcase.clone.model");
const ObjectId = require("mongodb").ObjectID;
const AWS = require("aws-sdk");
const s3 = new AWS.S3();

//get testcase all data from db
// exports.testCaseData = async (res) => {
//   try {
// const featureList = await feature.find({}, { _id: 1 }).lean();
// const featureListId = featureList.map((e) => ObjectId(e._id));
// const cloneTestCaseData = await clonetestcase.aggregate([
//   {
//     $match: {
//       id: {
//         $in: featureListId,
//       },
//     },
//   },
//   {
//     $group: {
//       _id: { cloneKey: "$cloneKey" },
//       data: {
//         $push: {
//           cloneKey: "$cloneKey",
//           featuresName: "$featuresName",
//           version: "$version",
//         },
//       },
//     },
//   },
// ]);
// res.send(cloneTestCaseData);
//   } catch (err) {
//     console.log(err);
//   }
// };

const groupBy = (keys) => (array) =>
  array.reduce((objectsByKeyValue, obj) => {
    const value = obj[keys];
    objectsByKeyValue[value] === undefined &&
      (objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj));
    return objectsByKeyValue;
  }, {});

// 1 get testcase data from db
exports.testCaseData = async (res) => {
  try {
    const featureList = await feature.find({}, { _id: 1 }).lean();
    const result = await feature.find({});
    const featureListId = featureList.map((e) => ObjectId(e._id));
    const cloneTestCaseData = await clonetestcase.find({
      id: { $in: featureListId },
    });
    let executedData = [];
    featureListId.map((id) => {
      let groupByData = cloneTestCaseData.filter((item) => id.equals(item.id));
      let groupByReturn = groupBy("cloneKey")(groupByData);
      executedData = executedData.concat(Object.values(groupByReturn).flat());
    });
    const response = {
      originalData: result,
      executedData: executedData,
    };
    res.send(response);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

// 4 get api find by id from testcase table
exports.testCaseIndividualData = async ({ query = {} }, res) => {
  try {
    const { id } = query;
    const result = await testcase.find({ id: id }).lean();
    const featureData = await feature
      .find({ _id: id }, { _id: 0, __v: 0 })
      .lean();
    res.json({
      data: result,
      featureData: featureData,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

//get s3 bucket all data from aws s3 bucket
exports.s3bucketRecordVideoData = async (res) => {
  try {
    const result = await s3
      .listObjectsV2({
        Bucket: process.env.AWS_BUCKET_NAME,
      })
      .promise();
    const x = result.Contents.map((item) => item);
    res.send(x);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

// 6 post clone testcase data clone collection
exports.testCaseCloneData = async ({ body = {} }, res) => {
  try {
    const { id, reason, executed } = body;
    const executionReason = {
      reason: reason,
      executed: executed,
    };
    let cloneKey = 1;
    const testCaseData = await testcase.find({ id: id }).lean();
    if (testCaseData.length === 0)
      return res
        .status(400)
        .json({ message: "testcase data not available..!" });
    const cloneTestCaseData = await clonetestcase.find({ id: id }).lean();
    if (cloneTestCaseData.length !== 0) {
      cloneKey =
        Math.max(...cloneTestCaseData.map((item) => item.cloneKey)) + 1;
    }

    for (let data of testCaseData) {
      const {
        _id,
        TestCaseID,
        Priority,
        TestcaseDescription,
        Steps,
        featuresName,
        version,
        module,
        ExpectedResult,
        ActualResult,
      } = data;

      await clonetestcase.create({
        id: id,
        testcasedataid: _id,
        cloneKey: cloneKey,
        TestCaseID: TestCaseID,
        Priority: Priority,
        TestcaseDescription: TestcaseDescription,
        Steps: Steps,
        featuresName: featuresName,
        version: version,
        module: module,
        executionReason: executionReason,
        ExpectedResult: ExpectedResult,
        ActualResult: ActualResult,
      });
    }
    const cloneTestCasesData = await testcase.find({ id: id }).lean();
    res.json({ data: cloneTestCasesData, cloneKey: cloneKey });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

// 9 find clone data by key and id
exports.getExecutedCloneData = async ({ query = {} }, res) => {
  try {
    const { id, cloneKey } = query;
    const clonedata = await clonetestcase.find({ id: id, cloneKey: cloneKey });
    res.json({ data: clonedata, message: "success" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

// 11 get clone testcase individual data from db
exports.testCaseCloneIndividualData = async ({ query = {} }, res) => {
  try {
    const { id, cloneKey } = query;
    const result = await clonetestcase
      .find({ id: id, cloneKey: cloneKey })
      .lean();
    const featureData = await feature
      .find({ _id: id }, { _id: 0, __v: 0 })
      .lean();
    res.json({
      data: result,
      featureData: featureData,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

// 12 delete testcase and clone data
exports.deleteData = async ({ query = {} }, res) => {
  try {
    const { id } = query;
    await testcase.deleteMany({ id: id });
    const result = await clonetestcase.deleteMany({ id: id });
    res.json({ message: result });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

// 15 get testcase clone data filter by clonkey and testcase id
exports.singleTestCaseData = async ({ query = {} }, res) => {
  try {
    const { id, cloneKey } = query;
    if (isNaN(cloneKey)) {
      const result = await testcase.findOne({ _id: id }).lean();
      res.json({ data: result });
    } else {
      const result = await clonetestcase.findOne({ _id: id }).lean();
      res.json({ data: result });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

// 16 delete testcase and feature data or testcaseclone data
exports.deleteExistingData = async ({ query = {} }, res) => {
  try {
    const { id, cloneKey } = query;
    if (isNaN(cloneKey) || cloneKey === "") {
      await testcase.deleteMany({ id: id });
      await feature.deleteOne({ _id: id });
      res.json({ message: " func 1 deleted Successfully..!" });
    } else {
      await clonetestcase.deleteMany({
        id: id,
        cloneKey: cloneKey,
      });
      res.json({ message: "func 2 deleted Successfully..!" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};
