const Ajv2019 = require("ajv/dist/2019");
const ajv = new Ajv2019({
    allErrors: true
})
const glob = require("glob");

function error(err) {
    console.error(err);
    process.exit(1);
}

const globOpts = {
    absolute: true
};

let schema = {};
let dataArray = [];

console.log("Searching for schemas...");

var files = glob.sync("**/*.schema.json", globOpts);

if (files.length == 0) error("No schema file found");

schema = require(files[0]);
schema["$schema"] = "";
schema["$id"] = "";

console.log(`Using schema: ${files[0]}`);

console.log("Searching for JSON files...");

var files = glob.sync("**/*.!(schema).json", globOpts);

if (files.length == 0) error("No JSON files found");

dataArray = files.map(e => {
    return {
        path: e,
        json: require(e)
    }
});

console.log(`Found ${dataArray.length} JSON files!`);

const validate = ajv.compile(schema);
let valid = true;

dataArray.forEach(data => {
    console.log(`Validating file: ${data.path}`);
    valid = validate(data.json);
    if (!valid) console.error(validate.errors);
})

if (!valid) error("Validation failed");
else console.log("All valid!");
