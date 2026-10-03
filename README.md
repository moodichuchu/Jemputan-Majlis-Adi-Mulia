# Digital Card Moody

A reusable, moody botanical base for an English digital wedding invitation. Open `index.html` directly for a quick preview, or serve this folder with any static web server.

## Customize first

1. Replace every `[PLACEHOLDER]` value in `index.html` and `script.js`.
2. Add your own photos under `img/` and replace the repeated `img/moody-botanical-bg.png` gallery paths in `index.html`.
3. Add a licensed audio file under `music/` and restore its `<source>` in `index.html` if music is required.
4. Apply `database.rules.json` in Firebase Console → Realtime Database → Rules before using the RSVP form.
5. Add your own bank QR image and update `qrImage` in `index.html`; never publish real credentials until the card is ready.

The generated background is `img/moody-botanical-bg.png`.

## Code map

Every major block now has a numbered or `START`/`END` comment that can be searched in your editor.

- `index.html`: visible text, names, dates, venue, programme, gift details, contacts, RSVP fields, modals, and bottom navigation.
- `moody-layout.css`: active responsive layout, fonts, spacing, cards, navigation, phone breakpoints, and reveal animation.
- `style.css`: original legacy component styling. Prefer making new visual adjustments in `moody-layout.css`, which loads last.
- `script.js`: scrolling effects, opening transition, countdown, calendar, gift controls, RSVP form, guest wishes, contacts, and QR behavior.
- `firebase-rsvp.js`: Firebase configuration, confirmed RSVP writes, validation, and live guestbook updates.
- `database.rules.json`: paste into Firebase Console → Realtime Database → Rules and click Publish. Rules allow public reads of RSVP names, attendance details, guest counts, wishes, and timestamps; validated submissions can be created but cannot be edited or deleted by visitors. Other database paths are denied. These rules do not prevent automated spam; add App Check or a protected backend for abuse protection before broadly advertising the invitation.

## Firebase RSVP setup

The app connects to the `digital-card-moody` Realtime Database in Singapore. Analytics is not needed for RSVP storage. No build or npm installation is required.

After publishing the database rules, reload the invitation and submit a test RSVP. Check for the record under `rsvps` in the Firebase Data tab, then open the invitation in another browser to confirm that guest wishes and attendance totals update. Remove the test record through Firebase Console when finished. Existing local demo RSVPs are not uploaded automatically.

If rules are still locked, submissions show an error and retain the form values. Success appears only after Firebase confirms the write. An interrupted connection after submission can keep the form pending until connectivity returns.

Search for `START:` in `index.html` or for numbered comments such as `06. WEDDING COUNTDOWN` in the CSS and JavaScript files.
