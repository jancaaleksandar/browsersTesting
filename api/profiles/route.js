import express from 'express';
import FirebaseService from '../../firestore/service/firebaseService.js';  // Path to your service
import cors from "cors";

const app = express();
app.use(cors());
const PORT = 3000;

// Route to fetch profiles
app.get('/api/profiles', async (req, res) => {
    console.log("Fetching profiles...");
    try {
        // Call FirebaseService to fetch the profiles
        const profilesData = await FirebaseService.getAllProfilesWithQueue(); // ? await?
        
        // If profilesData is valid, send it to the client
        if (profilesData) {
            res.status(200).json(profilesData);
        } else {
            res.status(404).json({ message: 'No profiles found' });
        }
    } catch (error) {
        // Handle any errors that occur during fetching
        res.status(500).json({ message: 'Error fetching profiles', error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
