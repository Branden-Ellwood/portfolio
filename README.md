# Branden Ellwood: Portfolio

Personal portfolio site. Plain HTML, CSS and JavaScript (no build step). 3D background by three.js.

## Structure

```
index.html          Home page (all the content you see on the site)
cv.html             Your CV as a web page (edit the text in it to update the CV; use Print > Save as PDF for a PDF)
page-template.html  Copy this to make a new page
vercel.json         Hosting settings (clean URLs: /projects instead of /projects.html)
css/
  tokens.css        Colours for light and dark mode (change accent colours here)
  base.css          Reset, background, section headings
  layout.css        Container, navigation bar, footer
  components.css    Buttons, chips, cards, stat boxes, timeline
  cv.css            Styles for the CV page
  home.css          Hero, ribbon, about and contact (home page only)
  intro.css         Opening titles (home page only)
  motion.css        Scroll animation + reduced-motion fallback (keep last)
js/
  theme.js          Light/dark toggle (loads in <head> on every page)
  effects.js        Name reveal, typing line, counters, card tilt, scroll effects
  scene.js          3D flythrough background
assets/             Put images and your photo here
```

## Common edits

- **Text and links:** edit `index.html`.
- **Colours:** `css/tokens.css` for the page, the hex values inside `paint()` in `js/scene.js` for the 3D colours.
- **Typing words:** the `data-words` attribute on `#typed` in `index.html` (separate with `|`).
- **Skills ribbon:** the `data-items` attribute on `#rb` (separate with commas).
- **Stat numbers:** the `data-n` attribute on each `.stat b`.

## Add a new page

1. Copy `page-template.html` and rename it, for example `projects.html`.
2. Edit the title and content.
3. Add a link to it in the `<nav>` of each page.
4. Commit and push. It goes live at `/projects`.

## Run locally

Double-click `index.html`, or run `python3 -m http.server` in this folder and open http://localhost:8000.

## Deploy

Pushed to GitHub and imported into Vercel. Every push to `main` redeploys the site automatically.
