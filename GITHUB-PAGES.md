# Publish this invitation on GitHub Pages

Publish the contents of this project folder at the repository root. The sibling backup folders are separate restore points and should not be uploaded.

In the repository's Settings → Pages, choose Deploy from a branch, then main and / (root), and save. This is a static website and needs no build command.

Firebase handles RSVP data separately. Publish database.rules.json in the Firebase Realtime Database console for digital-card-moodi before testing submissions. Do not import the old database if starting fresh.

GitHub Pages publishes the invitation on a public URL. The Firebase web configuration in firebase-rsvp.js is client configuration; database security is controlled by Firebase rules.
