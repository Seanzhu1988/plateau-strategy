# Connecting Your Square Account, Step by Step

The booking app works **right now in demo mode** (it simulates invoices). When
you're ready to send real invoices to clients, follow these steps to get your
two Square keys. **You do this yourself** so your secret token stays private, 
never paste it into chat.

---

## Step 1, Open the Square Developer Dashboard
1. Go to **https://developer.squareup.com/apps**
2. Sign in with the **same login as your Square business account**.

## Step 2, Create an application
1. Click **"+"** / **Create your first application**.
2. Name it e.g. `Plateau Strategy Booking`. Agree and continue.

## Step 3, Get your test (Sandbox) keys first
> Always test in Sandbox before going live, Sandbox invoices are fake and safe.

1. In your app, open the **Sandbox** tab (toggle near the top).
2. Copy the **Sandbox Access Token**.
3. Open **Sandbox** → **Locations** (or the Sandbox Test Account dashboard) and
   copy the **Location ID** (looks like `L1A2B3C4D5E6F`).

## Step 4, Put the keys in the app
1. In the project folder, copy `.env.example` to a new file named `.env`.
2. Fill in:
   ```
   SQUARE_ACCESS_TOKEN=<your sandbox access token>
   SQUARE_LOCATION_ID=<your sandbox location id>
   SQUARE_ENV=sandbox
   ```
3. Restart the app. The booking page badge will change from **"demo mode"** to
   **"Square sandbox"**.

## Step 5, Test a booking
- Book a ride on the booking page. A real **Sandbox invoice** is created and
  emailed to the test client. Nothing is charged.

## Step 6, Go live (when ready)
1. In the Developer Dashboard, switch the app to **Production**.
2. Copy the **Production Access Token** and your **real Location ID**
   (Square Dashboard → **Account & Settings → Business → Locations**).
3. In `.env` set:
   ```
   SQUARE_ACCESS_TOKEN=<production access token>
   SQUARE_LOCATION_ID=<production location id>
   SQUARE_ENV=production
   ```
4. Restart. Now invoices are **real** and clients can pay by card.

---

## Optional, Driver email + text alerts
- **Email (Resend):** create a key at https://resend.com → put it in
  `RESEND_API_KEY`, set `DRIVER_EMAIL`.
- **SMS (Twilio):** from https://twilio.com get Account SID, Auth Token, and a
  phone number → fill `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM`,
  and `DRIVER_PHONE`.

Until these are set, the driver still sees every booking on the **live driver
dashboard** at `/driver`.

---

## Running the app
```
cd "Plateau Strategy"
pip3 install -r requirements.txt      # first time only
python3 app.py                        # -> http://localhost:8080
```
- Landing page:   http://localhost:8080/
- Book a ride:    http://localhost:8080/book
- Driver board:   http://localhost:8080/driver
