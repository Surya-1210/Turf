# Vels Indoor Sports Academy - Badminton Court Booking

A web app for booking badminton court slots in Chennai. Users pick a date and slots, pay via Google Pay (UPI), and confirm the booking on WhatsApp. Bookings are stored in Supabase so availability is the same for everyone.

## Authors

- [Jayaraj](https://github.com/Jayaraj-G)
- [Surya](https://github.com/Surya-1210)

## Contributors

<a href="https://github.com/surya-vec12/vels-badminton-booking/graphs/contributors">
  <img src="https://avatars.githubusercontent.com/u/351752823?v=4" />
</a>

## Features

- 7-day date selector with live slot availability
- Different hours for weekdays and weekends
- Multi-slot selection with running total
- Booked slots blocked for all users (Supabase)
- UPI / Google Pay QR payment
- Booking details sent to owner via WhatsApp
- Embedded Google Maps location

## Hours and Pricing

| Days      | Hours              |
| --------- | ------------------ |
| Mon - Fri | 7:00 PM - 11:00 PM |
| Sat - Sun | 11:00 AM - 8:00 PM |

Price: Rs. 400 per hour

## Tech Stack

HTML, CSS, Vanilla JavaScript, Supabase (PostgreSQL), GitHub Pages

## Database Setup

Create a bookings table in Supabase:

| Column | Type                                          |
| ------ | --------------------------------------------- |
| id     | uuid (primary key, default gen_random_uuid()) |
| name   | text                                          |
| phone  | text                                          |
| date   | date                                          |
| slots  | text (e.g. 19:00,20:00)                       |
| total  | int4                                          |

Enable Row Level Security:

alter table bookings enable row level security;

create policy "anon can read" on bookings
for select to anon using (true);

create policy "anon can insert" on bookings
for insert to anon with check (true);
Add your keys in script.js:

const SUPABASE_URL = 'https://YOUR-PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR-ANON-PUBLIC-KEY';

## Run Locally

git clone https://github.com/YOUR-USERNAME/vels-badminton-booking.git
cd vels-badminton-booking
Open index.html in a browser (or use VS Code Live Server).

## Deploy

Repo Settings → Pages → Branch: main / (root) → Save.

## Contact

Call or WhatsApp +91 78678 79173.
