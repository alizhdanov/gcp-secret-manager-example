const fs = require("fs");
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");

const PROJECT = "loopgroup-dev";
const SECRETS_LIST = ["DB_URL", "BACKEND_URL"];

const generateName = (n) => `projects/${PROJECT}/secrets/${n}/versions/latest`;

const client = new SecretManagerServiceClient();

async function accessSecretVersion(name) {
  const [version] = await client.accessSecretVersion({
    name: generateName(name),
  });

  const VALUE = version.payload.data.toString("utf8");

  return `${name}=${VALUE}`;
}

async function fetchSecrets() {
  const secrets = await Promise.all(SECRETS_LIST.map(accessSecretVersion));

  const payload = secrets.join("\n");

  fs.writeFileSync(".env.on-demand", payload);
}

fetchSecrets()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
