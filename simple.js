const fs = require("fs");
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");

// DEFINE PROJECT AND SECRET NAME
const PROJECT = "loopgroup-dev";
const SECRET = "simple";

// CONSTRUCT PATH TO THE SECRET
const name = `projects/${PROJECT}/secrets/${SECRET}/versions/latest`;

// GENERATE SECRET MANAGER CLIENT
const client = new SecretManagerServiceClient();

async function fetchSecrets() {
  // FETCH SECRET VERSION
  const [version] = await client.accessSecretVersion({
    name,
  });

  // CONVERT VERSION INTO STRING
  const value = version.payload.data.toString("utf8");

  // CREATE ENV FILE WITH FETCHED SECRET
  fs.writeFileSync(".env.simple", value);
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
