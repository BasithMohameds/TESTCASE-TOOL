const testcase = require("./testcase.model");
const feature = require("./feature.model");
const xlsxFile = require("read-excel-file/node");
const clonetestcase = require("./testcase.clone.model");
const { s3LinkSigned } = require("../s3 services/s3.bucket.service");
const AWS = require("aws-sdk");
const uuid = require("uuid").v4;
const { Version3Client } = require("jira.js");

// 2 feature and version post api
exports.testCaseInfo = async ({ body = {} }, res) => {
  try {
    const { featuresName, version, module } = body;
    const result = await feature.create({
      featuresName,
      version,
      module,
    });
    res.send(result._id);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ message: err.message });
  }
};

// 5 testcase row data save
exports.testCaseUploadRowData = async ({ body = {} }, res) => {
  try {
    const {
      id,
      TestCaseID,
      Priority,
      TestcaseDescription,
      featuresName,
      version,
      Steps,
      ExpectedResult,
      ActualResult,
    } = body;

    const result = await testcase.create({
      id: id,
      TestCaseID: TestCaseID,
      Priority: Priority,
      TestcaseDescription: TestcaseDescription,
      featuresName: featuresName,
      version: version,
      Steps: Steps,
      ExpectedResult: ExpectedResult,
      ActualResult: ActualResult,
    });
    res.send(result);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

// 3 testcase excel sheet read and save
exports.testCaseUploadFile = async ({ file = {}, body = {} }, res) => {
  try {
    const { originalname } = file;
    const { id } = body;
    const featuredata = await feature.findOne({ _id: id }).lean();
    const { featuresName, version, module } = featuredata;
    xlsxFile(`./uploadfiles/${originalname}`).then(async (rows) => {
      const array = [];
      let mycollectiondata;
      const columns = rows.shift();
      rows.map((element) => {
        const object = {};
        element.map((subElement, index) => {
          const key = columns[index].replace(/ /g, "");
          if (
            key === "Steps" ||
            key === "ActualResult" ||
            key === "ExpectedResult"
          ) {
            mycollectiondata = [subElement];
          } else {
            mycollectiondata = subElement;
          }
          Object.assign(object, {
            [key]: mycollectiondata,
          });
        });
        array.push(object);
      });
      const updatedArray = [];
      array.map((e) => {
        const index = updatedArray.findIndex(
          (f) => f.TestCaseID === e.TestCaseID
        );
        if (index >= 0) {
          updatedArray[index].Steps.push(...e.Steps);
          updatedArray[index].ActualResult.push(...e.ActualResult);
          updatedArray[index].ExpectedResult.push(...e.ExpectedResult);
        } else {
          updatedArray.push(e);
        }
      });
      try {
        for (let data of updatedArray) {
          await testcase.create({
            id: id,
            TestCaseID: data.TestCaseID,
            Priority: data.Priority,
            TestcaseDescription: data.TestcaseDescription,
            featuresName: featuresName,
            version: version,
            module: module,
            Steps: data.Steps,
            ExpectedResult: data.ExpectedResult,
            ActualResult: data.ActualResult,
          });
        }
        res.status(201).json({ message: "Successfully Registered" });
      } catch (err) {
        res.status(400).send("duplicate TestCaseID data not allowed...!");
      }
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err });
  }
};

// 7 post record video and upload to s3 bucket
exports.recordVideoAdd = async ({ body = {}, file = {} }, res) => {
  try {
    // const { id } = body;
    const { originalname, buffer, mimetype } = file;
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
    console.log({ file });
    let myFile = originalname.split(".");
    const fileType = myFile[myFile.length - 1];
    const filename = `${uuid()}.${fileType}`;
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: filename,
      Body: buffer,
      ContentType: mimetype,
    };

    s3.upload(params, async (error, data) => {
      if (error) {
        res.status(500).send(error);
      }
      const bucketUrl = await s3LinkSigned(data.Location, filename);
      console.log(bucketUrl);
      // await clonetestcase.findByIdAndUpdate(
      //   { _id: id },
      //   { $push: { videolink: { RecordVideolink: bucketUrl } } }
      // );
      res.status(200).send(bucketUrl);
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

// 8 testcase states update
exports.testCaseStatus = async ({ body = {} }, res) => {
  try {
    const { status, id } = body;
    await clonetestcase.findByIdAndUpdate({ _id: id }, { status: status });
    res.json({ message: "status changed successfully.." });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

// 10 add new row with clonekey clone collection
exports.executedInsertRowAPI = async ({ body = {} }, res) => {
  try {
    const {
      id,
      TestCaseID,
      status,
      Priority,
      cloneKey,
      TestcaseDescription,
      Steps,
      featuresName,
      version,
      ExpectedResult,
      ActualResult,
    } = body;

    const result = await clonetestcase.create({
      id: id,
      cloneKey: cloneKey,
      TestCaseID: TestCaseID,
      Priority: Priority,
      TestcaseDescription: TestcaseDescription,
      Steps: Steps,
      status: status,
      featuresName: featuresName,
      version: version,
      ExpectedResult: ExpectedResult,
      ActualResult: ActualResult,
    });
    res.send(result);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

// 13 get jira project team  active members details
exports.getJiraMemberData = async (res) => {
  try {
    const getdata = await client.users.getAllUsersDefault();
    const projects = await client.projects.getProject("");
    let data = getdata
      .filter((e) => {
        return e.accountType == "atlassian" && e.active == true;
      })
      .map(({ displayName, accountId }) => ({
        userName: displayName,
        userId: accountId,
      }));
    let getProjectDetails = projects.map(({ name, id }) => ({
      projectName: name,
      projectId: id,
    }));
    res.json({ userDetails: data, projectDetails: getProjectDetails });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

// 14 create jira issue using api call
exports.createJiraIssue = async ({ body = {} }, res) => {
  try {
    const startDate = datePatch();
    const today = startDate.year + "-" + startDate.month + "-" + startDate.day;

    const { Title, AssigneeId, priority, id, projectId } = body;

    let priorityValue;

    const result = await clonetestcase.findOne(
      { _id: id },
      { TestcaseDescription: 1 }
    );

    !priority ? (priorityValue = "Medium") : (priorityValue = priority);

    const projects = await client.projects.getProject("");

    let data = projects.find((e) => {
      return e.id == projectId;
    });

    if (!data) {
      res.status(400).json({ message: "Project Not Available...!" });
    } else {
      const { id } = await client.issues.createIssue({
        fields: {
          summary: Title,
          issuetype: {
            name: "Bug",
          },
          project: {
            key: data.key,
          },
          priority: {
            name: `${priorityValue}`,
          },
          duedate: "2019-05-11",
          customfield_10015: `${today}`, //start date
          labels: ["functionality", "text"],
          timetracking: {
            originalEstimate: "30m",
          },
          assignee: {
            id: AssigneeId,
          },
          description: result.TestcaseDescription,
        },
      });

      const issue = await client.issues.getIssue({ issueIdOrKey: id });

      console.log("Issue successfully created");
      res.json({
        message: "issue created successfully",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

const client = new Version3Client({
  host: process.env.JIRA_HOST,
  authentication: {
    basic: {
      email: process.env.JIRA_EMAIL,
      apiToken: process.env.JIRA_API_TOKEN,
    },
  },
  newErrorHandling: true,
});

const datePatch = (date = new Date()) => {
  const d = new Date(date);
  let month = "" + (d.getMonth() + 1);
  let day = "" + d.getDate();
  const year = d.getFullYear();
  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  return { year, month, day };
};

//create jira issue using api
// exports.testCaseCreateIssue = async (res) => {
//   const projects = await client.projects.getAllProjects();

//   if (projects.length) {
//     const project = projects[0];

//     const { id } = await client.issues.createIssue({
//       fields: {
//         summary: "My Second issue",
//         issuetype: {
//           name: "Task",
//         },
//         project: {
//           key: project.key,
//         },
//       },
//     });

//     const issue = await client.issues.getIssue({ issueIdOrKey: id });

//     console.log(
//       `Issue '${issue.fields.summary}' was successfully added to '${project.name}' project.`
//     );
//     res.json({
//       message: "issue created successfully",
//       issue: `Issue '${issue.fields.summary}' was successfully added to '${project.name}' project.`,
//     });
//   }
// };
