function getConfig(profileId) {
  const host = "localhost:8848";
  const apiKey = "66ef1444-c2c7-4841-8365-aa4bbfedd502";
  const config = {
    headless: false, // support: true or false
    autoClose: true,
  };
  const query = new URLSearchParams({
    "x-api-key": apiKey, // required
    config: encodeURIComponent(JSON.stringify(config)),
  });
  const browserWSEndpoint = `ws://${host}/devtool/launch/${profileId}?${query.toString()}`;
  return browserWSEndpoint;
}

export default getConfig;
