/**
 * *this is the function to create a profile, we can call up to 500 per time
 *
 */

import fetch from "node-fetch";

async function createProfile() {
  var myHeaders = new Headers();
  myHeaders.append("User-Agent", "Apidog/1.0.0 (https://apidog.com)");
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    args: {
      property1: "string",
      property2: "string",
    },
    fingerprint: {
      deviceMemory: 2,
      disableImageLoading: true,
      doNotTrack: true,
      flags: {
        audio: "None",
        battery: "None",
        canvas: "None",
        clientRect: "None",
        fonts: "None",
        geolocation: "None",
        geolocationPopup: "None",
        gpu: "None",
        localization: "None",
        screen: "None",
        speech: "None",
        timezone: "None",
        webgl: "None",
        webrtc: "None",
      },
      fonts: ["string"],
      geolocation: {
        accuracy: "string",
        latitude: "string",
        longitude: "string",
      },
      hardwareConcurrency: 2,
      localization: {
        basedOnProxy: false,
        languages: ["en-US", "en"],
        locale: "zh-CN",
        timezone: "Europe/Berlin",
      },
      restoreLastSession: true,
      screen: {
        height: 0,
        width: 0,
      },
      userAgent: "string",
      webrtc: {},
    },
    groupId: "1e455935-3e3e-4e3e-8e3e-3e3e3e3e3e3e",
    groupName: "Default",
    kernel: "chromium",
    kernelMilestone: "124",
    name: "Profile",
    note: "string",
    platform: "windows",
    proxy: "http://username:password@ip:port",
    proxyGroupName: "string",
    remoteDebuggingPort: 0,
    startupUrls: ["string"],
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("http://localhost:8848/api/agent/profile", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
}
export default createProfile;
