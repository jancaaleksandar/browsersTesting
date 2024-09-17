import admin from "../config.js";

const db = admin.firestore();

class FirebaseDao {
    static async getAllProfilesWithQueue() {
        const allProfilesRef = db.collection("profiles").doc("all_profiles");
        const snapshot = await allProfilesRef.get();
        // console.log(snapshot);
        return snapshot.exists ? snapshot.data() : {};
    }
}

export default FirebaseDao;
