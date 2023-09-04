const fs = require("fs");
const path = require("path");

const composeMetadata = (description, files) => {
  const metadata = {
    desc: description,
    imgs: [],
    vids: [],
    txt: [],
    pdf: [],
    other: [],
  };

  files.forEach((file) => {
    const fileExtension = path.extname(file.name).toLowerCase();

    if (fileExtension === ".jpg" || fileExtension === ".png") {
      metadata.imgs.push(file.name);
    } else if (fileExtension === ".mp4") {
      metadata.vids.push(file.name);
    } else if (fileExtension === ".txt") {
      metadata.txt.push(file.name);
    } else if (fileExtension === ".pdf") {
      metadata.pdf.push(file.name);
    } else {
      metadata.other.push(file.name);
    }
  });

  return metadata;
};

function composeUpdates() {
  const currentDirectory = process.cwd(); // Get the current working directory

  var data = {};

  let files = fs.readdirSync(currentDirectory, {
    withFileTypes: true,
  });

  const stepDirectories = files.filter((file) => file.isDirectory());

  stepDirectories.forEach((stepDirectory) => {
    data[stepDirectory.name] = [];
    const stepDirectoryPath = path.join(currentDirectory, stepDirectory.name);

    files = fs.readdirSync(stepDirectoryPath, { withFileTypes: true });

    const stepUpdates = files.filter((file) => file.isDirectory());

    stepUpdates.forEach((stepUpdate) => {
      const updateName = stepUpdate.name;
      const stepUpdatePath = path.join(stepDirectoryPath, stepUpdate.name);

      data[stepDirectory.name].push({ name: updateName, path: stepUpdatePath });

      files = fs.readdirSync(stepUpdatePath, { withFileTypes: true });

      const description = stepUpdate.name.replace(/^\d+_/, "");
      // console.log(description);

      const filesToProcess = files.filter(
        (file) => file.isFile() && file.name !== "index.json"
      );

      const updateMetadata = composeMetadata(description, filesToProcess);

      // write metadata to file
      fs.writeFileSync(
        path.join(stepUpdatePath, "index.json"),
        JSON.stringify(updateMetadata)
      );
    });
  });
  return data;
}

async function upload(directoryPath) {
  // Step 1: Read the Directory and Get File Paths
  const fileNames = fs.readdirSync(directoryPath);
  const filePaths = fileNames.map((fileName) =>
    path.join(directoryPath, fileName)
  );

  // Step 2: Create FormData and Append Files
  const formData = new FormData();
  for (const filePath of filePaths) {
    const fileContent = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);
    formData.append("files", new Blob([fileContent]), fileName);
  }

  // request
  const requestUrl = `http://127.0.0.1:5001/api/v0/add?wrap-with-directory=true`;

  const res = await fetch(requestUrl, {
    method: "POST",
    body: formData,
  }).catch((e) => {
    throw new Error("Error interacting with storage server");
  });

  if (!res.ok)
    throw new Error(
      `Received error from storage server: ${res.status} ${res.statusText}`
    );

  const data = await res.text();
  console.log(data);
  for (const jsonString of data.split("\n")) {
    if (!jsonString) continue;
    const json = JSON.parse(jsonString);
    // CID for directory
    if (json.Name == "") {
      return json.Hash;
    }
  }
}

function cleanJSON(json) {
  const cleanedJSON = {};

  for (const key in json) {
    if (json.hasOwnProperty(key)) {
      cleanedJSON[key] = json[key].map((entry) => {
        // Create a new object without the 'path' property
        const { path, ...cleanedEntry } = entry;
        return cleanedEntry;
      });
    }
  }
  return cleanedJSON;
}

const updates = composeUpdates();

console.log(updates);

let promises = [];
for (const topLevelKey in updates) {
  const subArray = updates[topLevelKey];

  for (const item of subArray) {
    promises.push(
      upload(item.path).then((hash) => {
        console.log(hash);
        item.uri = hash;
      })
    );
  }
}

Promise.all(promises).then(() => {
  const cleanUpdates = cleanJSON(updates);
  fs.writeFileSync("mockUpload.json", JSON.stringify(cleanUpdates, null, 2));

  console.log(cleanUpdates);
});
