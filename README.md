# abdul-wadud-nai-portfolio
Portfolio website for Abdul Wadud Nayi, a male fashion model from Ghana. Photo gallery, designed comp card, booking form, tap-to-call and WhatsApp buttons. Built with HTML, CSS and JavaScript, hosted on Netlify.

## Add your photos

Add ten optimized JPGs to `images/` with the exact filenames listed in [images/README.md](images/README.md). Photo 01 is the hero and about portrait. Keep each file below 300 KB. Missing photos show neutral placeholders, never another person's image. The social share image is photo 01.

## Edit model details

Update the `MODEL` object at the top of `script.js`. Set the city, bio, measurements, contact details, and socials there. Replace `[CITY]` with the correct city and keep the bio in a polished, truthful tone. Add only confirmed shows, shoots, or brands to `experience`; its section stays hidden while the list is empty. Review `comp-card.pdf` and replace it if the details or portrait need updating.

## Deploy to Netlify

1. Make sure `index.html`, `style.css`, `script.js`, `images/`, and `comp-card.pdf` are all in the folder.
2. Sign in at [Netlify](https://app.netlify.com/), choose **Add new site**, then **Deploy manually** (or open Netlify Drop).
3. Drag the `abdul-wadud-nai-portfolio` folder into the drop area. Netlify publishes the site and gives you a URL.
4. Visit the deployed site and submit the booking form once. Then open the site's **Forms** area and confirm `booking` was detected. Under **Forms > Notifications**, add an email notification to `wadudnayi@gmail.com`.

## Test

- Submit a test booking on the deployed site and confirm the thank-you message appears. Confirm the submission is listed in **Forms**, then check the inbox after adding the notification.
- On a phone, tap **Call** and verify the dialer opens with `+233503917926`.
- Tap **WhatsApp** and confirm the chat opens with the booking message pre-filled. WhatsApp Web also works on desktop.
- Try the gallery filters and lightbox. Missing-photo placeholders are expected until you add photos.

Netlify detects static HTML forms when it scans a deploy. Redeploy after adding or changing the form markup. No backend service is used.
