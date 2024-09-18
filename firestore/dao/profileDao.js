import admin from "../config.js";

/**
 * Updates the queue number for a given profile_id.
 *
 * @param {string} profile_id - The unique identifier for the browser profile. And if there is no profile_id saved I would like to make it.
 * @param {number} queue - The new queue number to set.
 */

const db = admin.firestore();

class ProfileDao {
  static addOrUpdateProfile(profileData) {
    const allProfilesRef = db.collection("profiles").doc("all_profiles");

    console.log("Profile data insde the ProfileDao: ", profileData);

    allProfilesRef.set(profileData, { merge: true }); /// * merge true means if it exists then write it in the
  }
}

export default ProfileDao;
