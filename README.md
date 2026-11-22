# Vels Indoor Sports Academy - Badminton Court Booking

A web application for booking time slots at a badminton court in Chennai. Users select a date and one or more available slots, pay through Google Pay (UPI), and confirm the booking over WhatsApp. Booked slots are stored in Supabase so that availability is consistent for every visitor.

## Authors

- Jayaraj
- Surya

## Features

- 7-day date selector with real-time slot availability
- Separate operating hours for weekdays and weekends
- Multi-slot selection with a running total
- Persistent bookings in Supabase, with booked slots blocked for all users
- UPI / Google Pay QR code payment
- Booking details sent to the owner via WhatsApp
- Embedded Google Maps location with directions

## Operating Hours and Pricing

| Days | Hours |
|---|---|
| Monday - Friday | 7:00 PM - 11:00 PM |
| Saturday - Sunday | 11:00 AM - 8:00 PM |

Price: Rs. 400 per hour

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, Vanilla JavaScript |
| Database | Supabase (PostgreSQL) |
| Fonts | Google Fonts (Teko, Work Sans, Space Mono) |
| Hosting | GitHub Pages |

## Project Structure

```
.
├── index.html     # Page structure and booking modal
├── styles.css     # Styling
├── script.js      # Slot logic, Supabase integration, WhatsApp redirect
├── qr.png         # Google Pay QR code
└── README.md
```

## Database Setup

Create a table named `bookings` in Supabase with the following columns:

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key, default `gen_random_uuid()` |
| `name` | text | Customer name |
| `phone` | text | 10-digit mobile number |
| `date` | date | Booking date |
| `slots` | text | Comma-separated times, e.g. `19:00,20:00` |
| `total` | int4 | Total amount in rupees |

Enable Row Level Security and allow the public (anon) role to read and insert only:

```sql
alter table bookings enable row level security;

create policy "anon can read" on bookings
  for select to anon using (true);

create policy "anon can insert" on bookings
  for insert to anon with check (true);
```

Add the project URL and anon public key in `script.js`:

```js
const SUPABASE_URL = 'https://YOUR-PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR-ANON-PUBLIC-KEY';
```

Note: The anon key is safe to expose only when Row Level Security is enabled. Never use the `service_role` key in client-side code.

## Running Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR-USERNAME/vels-badminton-booking.git
   cd vels-badminton-booking
   ```
2. Open `index.html` in a browser, or serve the folder with a tool such as the VS Code Live Server extension.

## Deployment (GitHub Pages)

1. Open the repository **Settings** and select **Pages**.
2. Under **Branch**, choose `main` and the `/ (root)` folder, then save.
3. The site will be available at `https://YOUR-USERNAME.github.io/vels-badminton-booking/`.

## Configuration

| Item | Location |
|---|---|
| Price, court name, tags | `COURT` object in `script.js` |
| Operating hours | `slotTimesFor()` and `renderCourtCard()` in `script.js` |
| WhatsApp number | `wa.me` link in `script.js` |
| UPI ID and QR code | Booking modal in `index.html`, and `qr.png` |
| Colors and fonts | CSS variables at the top of `styles.css` |

## Contact

For queries, call or WhatsApp +91 78678 79173.
