const fs = require("fs");
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");

const PROJECT = `loopgroup-dev`;
const LABELS = { app: "backend" };

const client = new SecretManagerServiceClient();

async function accessSecretVersion({ name }) {
  const [version] = await client.accessSecretVersion({
    name: name + "/versions/latest",
  });

  const NAME = name.match(/\w+$/i)[0];
  const VALUE = version.payload.data.toString("utf8");

  return `${NAME}=${VALUE}`;
}

function filterSecret(secret) {
  return Object.entries(LABELS).every(
    ([key, val]) => secret.labels[key] === val
  );
}

async function fetchSecrets() {
  const [secrets] = await client.listSecrets({
    parent: `projects/${PROJECT}`,
  });

  const filteredSecrets = secrets.filter(filterSecret);

  const values = await Promise.all(filteredSecrets.map(accessSecretVersion));

  const payload = values.join("\n");

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
