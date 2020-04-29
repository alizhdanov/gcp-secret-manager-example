const fs = require("fs");
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");

const PROJECT = "loopgroup-dev";
const SECRET = "simple";

const name = `projects/${PROJECT}/secrets/${SECRET}/versions/latest`;

const client = new SecretManagerServiceClient();

async function accessSecretVersion() {
  const [version] = await client.accessSecretVersion({
    name,
  });

  const payload = version.payload.data.toString("utf8");

  fs.writeFileSync(".env.simple", payload);
}

accessSecretVersion()
  .then(() => {
    console.log("Successfully fetched credentials");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
