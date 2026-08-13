# Campus Beats

Campus Beats is a Flask web application for discovering music and managing playlists. After signing in, users can search songs and artists, browse the most-played songs, add or remove playlist tracks, and get genre-based recommendations.

## Features

- Account sign-up, login, logout, and session-protected music page
- Song and artist search
- Top three songs ranked by play count
- Add songs to, view, and remove songs from playlists
- Genre-based song recommendations
- Match users with overlapping preferred genres through an API endpoint

## Tech stack

- Python and Flask
- MongoDB with PyMongo
- HTML, CSS, and vanilla JavaScript
- Bootstrap and Font Awesome (loaded from CDNs)

## Run locally

1. Clone the repository and enter it.

   ```bash
   git clone https://github.com/willsu42/CampusBeat.git
   cd CampusBeat
   ```

2. Create and activate a virtual environment.

   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```

3. Install the Python dependencies.

   ```bash
   pip install Flask pymongo python-dotenv
   ```

4. Configure MongoDB. `config.py` supports these environment variables:

   ```bash
   export MONGO_URI='mongodb+srv://<user>:<password>@<cluster>/'
   export DB_NAME='CampusBeat'
   ```

   You can also place them in a local `.env` file:

   ```dotenv
   MONGO_URI=mongodb+srv://<user>:<password>@<cluster>/
   DB_NAME=CampusBeat
   ```

   > **Note:** The current `db.py` contains a direct MongoDB connection and does not yet use these configuration variables. Before deploying or sharing the project, update it to use `Config.MONGO_URI` and `Config.DB_NAME`, and rotate any credential that was committed to source control.

5. Start the development server.

   ```bash
   python app.py
   ```

6. Open <http://127.0.0.1:5000>. The root page redirects to the login screen.

## MongoDB collections

The application expects these collections:

| Collection | Purpose | Key fields used |
| --- | --- | --- |
| `USER` | User accounts and music preferences | `Name`, `Email`, `Password`, `PreferredGenres` |
| `SONG` | Music catalog | `Title`, `Detail.Artist`, `Detail.Genre`, `Detail.Album`, `Detail.Duration`, `PlayCount` |
| `PLAYLIST` | Available playlists | `Name` |
| `CONTAINS` | Playlist-to-song links | `PlaylistID`, `SongID`, `created_at` |
| `RECOMMENDATION` | Per-user song recommendations | `UserID`, `SongID`, `RelevanceScore` |

`PlaylistID`, `SongID`, and user identifiers are MongoDB `ObjectId` values.

## Routes and API

| Method | Route | Description |
| --- | --- | --- |
| `GET`, `POST` | `/signup` | Display or submit the registration form |
| `GET`, `POST` | `/login` | Display or submit the login form |
| `GET` | `/music` | Authenticated music dashboard |
| `GET` | `/logout` | End the current session |
| `GET` | `/songs` | Return all songs |
| `GET` | `/search?search=<query>` | Search song titles and artists |
| `GET` | `/top_songs` | Return the three most-played songs |
| `GET` | `/get-playlists` | Return playlist names and IDs |
| `GET` | `/playlist/<playlist_id>` | Return tracks in a playlist |
| `POST` | `/add-to-playlist` | Add a song to a playlist |
| `POST` | `/remove-from-playlist` | Remove a song from a playlist |
| `GET` | `/recommend-by-genre?genre=<genre>` | Return up to ten popular songs in a genre |
| `POST` | `/match_preferences` | Find users with overlapping preferred genres |
| `POST` | `/recommendations` | Return stored recommendations for a user |

For playlist mutations, send JSON such as:

```json
{
  "playlist_id": "<playlist ObjectId>",
  "song_id": "<song ObjectId>"
}
```

## Project structure

```text
app.py                   Flask routes and application startup
db.py                    MongoDB connection helper
config.py                Environment-based configuration values
templates/login.html     Login and registration page
templates/music.html     Music dashboard
static/script/modal.js   Dashboard interactions and API calls
static/style/            Page styles
```

## Security note

This repository is a course-project style application. Passwords are currently stored and compared as plain text, and the Flask session secret is hard-coded. For production use, move all secrets to environment variables, hash passwords with Werkzeug’s password helpers, use HTTPS, and disable Flask debug mode.
