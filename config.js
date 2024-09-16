import "dotenv/config";

const apiKeyEnv = process.env.NST_API_KEY;

function getConfig(profileId) {
  const host = "localhost:8848";
  const apiKey = apiKeyEnv;
  const config = {
    headless: false, // support: true or false
    autoClose: true,
  };
  const query = new URLSearchParams({
    "x-api-key": apiKey, // required
    config: encodeURIComponent(JSON.stringify(config)),
  });
  const browserWSEndpoint = `ws://${host}/devtool/launch/${profileId}?${query.toString()}`;
  return {browserWSEndpoint, profileId};
}

export default getConfig;
