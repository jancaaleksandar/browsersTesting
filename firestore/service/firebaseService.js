import FirebaseDao from "../dao/firebaseDao.js";

class FirebaseService {
  static async getAllProfilesWithQueue() {
    try {
      const allProfiles = await FirebaseDao.getAllProfilesWithQueue();
      return allProfiles;
    } catch (error) {
      console.error("Error getting all profiles with queue:", error);
      return false;
    }
  }
}

export default FirebaseService;
