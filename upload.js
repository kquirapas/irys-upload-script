const Irys = require("@irys/sdk");
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config({ path: ".env" });

async function getIrys() {
  const providerUrl = "https://api.devnet.solana.com";
  const token = "solana";

  const irys = new Irys({
    network: "devnet",
    token,
    key: process.env.SOLANA_PRIVATE_KEY, // Private key
    config: { providerUrl }, // Optional provider URL, only required when using Devnet
  });
  return irys;
}

async function main() {
  // get path from arg
  const [, , pathToFile] = process.argv;
  // upload sample token image

  // upload sample token metadata
  const irys = await getIrys();

  // Add a custom tag that tells the gateway how to serve this file to a browser
  const tags = [{ name: "Content-Type", value: "image/png" }];

  const { size } = await fs.promises.stat(pathToFile);
  const price = await irys.getPrice(size);
  await irys.fund(price);

  const { id } = await irys.uploadFile(pathToFile, tags);
  const gateway = `https://gateway.irys.xyz/${id}`;
  console.log(`${pathToFile} --> Uploaded to ${gateway}`);
  return id;
}

main()
  .then((val) => {
    console.log(val);
  })
  .catch((err) => {
    console.error(err);
  });
