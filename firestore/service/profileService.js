import ProfileDao from "../dao/profileDao.js";

class ProfileService {
  // * this checks if the dao worked for each method
  static addOrUpdateProfile(profileId, queueNumber) {
    const profileData = {
      [profileId]: {
        queue: queueNumber,
      },
    };

    console.log(profileData);

    try {
      ProfileDao.addOrUpdateProfile(profileData);
      return true;
    } catch (error) {
      console.error("Error adding/updating profile:", error);
      return false;
    }
  }
}

// export default ProfileService;
ProfileService.addOrUpdateProfile("44394949", 44656999); // * this is how we are going to call it (api or not)
