Social Media for Music lovers who move fast and want to share their music with the world without worrying about technicalities and costs, also dont have to worry about signing up to a label to publish music

Features:
- Fully typesafe with TypeScript
- Frontend in React
- Backend connects to a hosted Postgres database integrated through an orm (drizzle typescript orm)
- Userbase for creating users who can sign up and create their unqiue profile with username, name, description and profile picture
- Any user can upload their music files under their account to share with anyone who has access to the internet
- Authentication with NextAuth.js
- Audio files are validated and compressed using wasm ffmpeg to normalise files to the same bitrate and format (optimised for streaming over the internet and effecient storage means less costs)
- File uploads with cloudflare R2 object storage
- Custom Music Player with custom useMusicPlayer hook and music custom provider for global context (persistent state across all routes and components)
- Songs can be played in the background with a music player
- Songs can be favorited and saved to a playlist
- Authenticated and secured audio streaming (file url never exposed to the client)