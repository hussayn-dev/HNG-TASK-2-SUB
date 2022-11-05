const { parse } = require("csv-parse");
const crypto = require("crypto");
const readline = require("readline");
const converter = require("json-2-csv");
const fs = require("fs");
const path = require("path");

const hash = (val) => {
  return new Promise((resolve) =>
    setTimeout(
      () => resolve(crypto.createHash("sha256").update(val).digest("hex")),
      0
    )
  );
};

const convertCsvToJson = async (csvPath) => {
  return new Promise((resolve, reject) => {
    let results = [];
   

    //parse csv and convert to json
    const read = fs.createReadStream(csvPath);
    read
      .pipe(
        parse({
          columns: true,    
        })
      )
      .on("error", (err) => {
        console.log(err);
        reject("failed");
      })
      .on("data", async (data) => {
        // Create the new format for storing the files
        const format = {
          format: "CHIP-0007",
          name: data.Filename,
          description: data.Description,
          minting_tool: "",
          sensitive_content: "false",
          series_number: data["Series Number"],
          series_total: 380,
          attributes: [
            {
              trait_type: "Gender",
              value: data?.Gender,
            },
          ],
          collection: {
            name: "Zuri NFT Tickets for Free lunch",
            id: data?.UUID,
            attributes: [
              {
                type: "description",
                value: "Rewards for accomplishments during HNGi9",
              },
            ],
          },
        };
         //get hash
        const hashed = await hash(JSON.stringify(format));
        format["Hash-value"] = hashed;
        results = results.concat(format);
        resolve(results);
      })
      .on("end", () => {
        resolve(results);
      });
  });
};

const convertJsonToCsv = (json) => {
  return new Promise((resolve, reject) => {
    converter.json2csv(json, (err, csv) => {
      if (err) {
        reject(err);
      }
      resolve(csv);
    });
  });
};
const writeCsvToFile = (path, csv) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, csv, (err) => {
      if (err) {
        reject(err);
      }
      resolve("File written successfully");
    });
  });
};

const defaultPath = path.resolve(
  "/home/hussayn/Desktop/Big Projects/HNG9-TASK2/inputs/NFT Naming csv - All Teams.csv"
);
const callProcess = async (filePath = defaultPath) => {
  // check file in the directory  to work on
  try {
    filePath = path.resolve(filePath);
    const getJson = await convertCsvToJson(filePath);
    //create a csv file
    const createCsv = await convertJsonToCsv(getJson);
    let file = path.parse(filePath);
    let newPath = path.join(file.dir, `${file.name}.output.csv`);

    await writeCsvToFile(newPath, createCsv);

    console.log(`Csv Writing Successful`);

    process.exit();
  } catch (error) {
    return console.log(error.message);
  }
};

module.exports = callProcess;
