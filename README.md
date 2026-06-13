# FoodBridge Setup Guide

Follow these steps to run the application:

## 1. Backend Setup
1. Open a terminal in the `backend` directory.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the Flask server:
   ```bash
   python app.py
   ```
   The backend will run on `http://localhost:5000`.

## 2. Frontend Setup
1. Open a new terminal in the `frontend` directory.
2. Install dependencies (if not already done):
   ```bash
   npm install
   ```
3. Run the React development server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`.

## 3. Using the App
1. Visit `http://localhost:5173`.
2. Sign up as a **Donor** to post food.
3. Sign up as an **NGO** to claim food.
4. Sign up as a **Volunteer** to deliver food.
5. The system uses real-time polling, so changes will appear across dashboards automatically within a few seconds.

### Troubleshooting
- **Maps not showing?** Ensure you have an internet connection to load OpenStreetMap tiles.
- **API Errors?** Make sure the Flask server is running on port 5000.
