const fs = require("fs");
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");

// DEFINE PROJECT AND SECRETS LIST
const PROJECT = "loopgroup-dev";
const SECRETS_LIST = ["DB_URL", "BACKEND_URL", "ANOTHER_SECRET"];

// HELPER FUNCION TO CONSTRUCT PATH TO THE SECRET
const generateName = (n) => `projects/${PROJECT}/secrets/${n}/versions/latest`;

// GENERATE SECRET MANAGER CLIENT
const client = new SecretManagerServiceClient();

async function accessSecretVersion(name) {
  // FETCH SECRET VERSION
  const [version] = await client.accessSecretVersion({
    name: generateName(name),
  });

  // CONVERT VERSION INTO STRING
  const VALUE = version.payload.data.toString("utf8");

  // RETURN VALUE IN A `KEY=VALUE` FORMAT
  return `${name}=${VALUE}`;
}

async function fetchSecrets() {
  // TAKE SECRETS LIST AND FETCH SECRET VALUES
  const secrets = await Promise.all(SECRETS_LIST.map(accessSecretVersion));

  // PREPARE VALUES FOR SAVING
  const payload = secrets.join("\n");

  // CREATE ENV FILE WITH PREPARED VALUES
  fs.writeFileSync(".env.on-demand", payload);
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
