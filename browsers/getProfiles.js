import fetch from "node-fetch";
import "dotenv/config";
import fs from "fs";

const apiKey = process.env.NST_API_KEY;

async function getProfiles() {
  let profileIds = [];
  var myHeaders = new Headers();
  //   myHeaders.append("User-Agent", "Apidog/1.0.0 (https://apidog.com)");
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("x-api-key", apiKey);

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  const response = await fetch(
    "http://localhost:8848/api/agent/profile/list?page=&pageSize=10&s=&tags&groupId=",
    requestOptions
  );

  const data = await response.json();
  const profiles = data.data.docs;
  profiles.forEach((profile) => {
    const id = profile.profileId;
    profileIds.push(id);
  });

  return profileIds;
}
// getProfiles();
export default getProfiles;