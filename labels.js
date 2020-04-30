const fs = require("fs");
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");

// DEFINE PROJECT AND REQUIRED LABELS
const PROJECT = `loopgroup-dev`;
const LABELS = { app: "backend" };

// GENERATE SECRET MANAGER CLIENT
const client = new SecretManagerServiceClient();

async function accessSecretVersion({ name }) {
  // FETCH SECRET VERSION
  const [version] = await client.accessSecretVersion({
    name: name + "/versions/latest",
  });

  // GET SECRET NAME
  const NAME = name.match(/\w+$/i)[0];
  // CONVERT VERSION INTO STRING
  const VALUE = version.payload.data.toString("utf8");

  // RETURN VALUE IN A `KEY=VALUE` FORMAT
  return `${NAME}=${VALUE}`;
}

// COMPARE SECRET LABELS WITH REQUIRED LABELS
function filterSecret(secret) {
  return Object.entries(LABELS).every(
    ([key, val]) => secret.labels[key] === val
  );
}

async function fetchSecrets() {
  // FETCH LIST OF PROJECT SECRETS
  const [secrets] = await client.listSecrets({
    parent: `projects/${PROJECT}`,
  });

  // FILTER ONES WITH REQUIRED LABELS
  const filteredSecrets = secrets.filter(filterSecret);

  // FETCH SECRETS VALUES
  const values = await Promise.all(filteredSecrets.map(accessSecretVersion));

  // PREPARE VALUES FOR SAVING
  const payload = values.join("\n");

  // CREATE ENV FILE WITH PREPARED VALUES
  fs.writeFileSync(".env.labels", payload);
}

fetchSecrets()
  .then(() => {
    console.log("Successfully fetched credentials");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
