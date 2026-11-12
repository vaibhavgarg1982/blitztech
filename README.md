# Blitz Tech - Implementation guide

## 1. What this project is

This project is a small interactive website prototype called **Blitz Tech**. It presents a retro-inspired landing page and a full-screen, nested navigation menu.

The user can:

1. View the landing page.
2. Open the navigation menu.
3. Choose one of five top-level sections.
4. Choose an item inside that section.
5. Either open an external destination or view a placeholder destination panel.
6. Go back one level or close the menu completely.

This is currently a **front-end prototype** served by Flask. React fetches navigation content from Flask's `/api/navigation` endpoint. Most destination panels are still previews, while selected items open external URLs configured in the server-side `navigation.json` file.

The main technologies are:

- **React**: Builds the user interface from reusable components.
- **Vite**: Runs the development server and creates the production build.
- **JavaScript/JSX**: Defines the data, components, and interactions.
- **CSS**: Defines layout, colours, typography, responsive behavior, and the illustrated background.
- **Framer Motion**: Adds entrance, exit, hover, tap, and overlay animations.
- **Lucide React**: Provides the arrow, menu, close, back, and sparkle icons.
- **Flask**: Serves the built website and navigation content from Python.

---

## 2. Project files

The project is intentionally small:

```text
retro-navigation-prototype/
├── app.py
├── navigation.json
├── test_app.py
├── vite.config.js
├── index.html
├── package.json
├── pyproject.toml
├── uv.lock
├── README.md
├── explanation.md
└── src/
    ├── main.jsx
    └── styles.css
```

### `index.html`

This is the single HTML document served by the browser. It provides:

- The page language.
- Mobile viewport settings.
- The browser tab title.
- Google Font imports.
- An empty `<div id="root"></div>` where React mounts the application.
- The entry script `/src/main.jsx`.

The important part is:

```html
<div id="root"></div>
<script type="module" src="/src/main.jsx"></script>
```

The browser initially has an empty root element. React fills it with the interface when `main.jsx` runs.

### `package.json`

This file describes the project and its dependencies.

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

The commands mean:

- `npm run dev`: Start Vite's local development server.
- `npm run build`: Create an optimized production build.
- `npm run preview`: Serve the already-built production files locally.

The important runtime dependencies are:

- `react`: The React library.
- `react-dom`: Connects React to the browser DOM.
- `framer-motion`: Adds animation components and animation props.
- `lucide-react`: Provides reusable SVG icon components.

The important development dependency is:

- `vite`: The fast development server and build tool.

### `src/main.jsx`

This is the application's JavaScript and JSX entry point. It contains:

- Fetching navigation content and handling loading or errors.
- Animation definitions.
- The `Landscape` component.
- The `CassetteCard` component.
- The `DetailCard` component.
- The main `App` component.
- The call that mounts React into `index.html`.

### `src/styles.css`

This contains all visual styling. It controls:

- Colours.
- Fonts.
- Page layout.
- Card shapes and shadows.
- The background landscape.
- The full-screen menu overlay.
- Hover and responsive styles.

There is no image file for the landscape. It is assembled from CSS elements and inline SVG in `main.jsx`.


## 3. How to run the project

### Requirements

Install **Node.js 18 or newer**. Node.js includes `npm`, the package manager used by this project.

Check that they are installed:

```bash
node --version
npm --version
```

### Install dependencies

Run this from the project directory:

```bash
npm install
```

This reads `package.json` and downloads the required packages into a `node_modules` folder. `node_modules` is generated and should not be edited manually.

### Start development mode

```bash
npm run dev
```

Vite prints a local URL, commonly:

```text
http://localhost:5173/
```

Open that URL in a browser. Vite watches the source files and refreshes the browser when files change.
Also run `uv run app.py` in a second terminal: `vite.config.js` forwards `/api`
requests to Flask at `http://127.0.0.1:5050`. Restart Vite after changing its config.

### Build for production

```bash
npm run build
```

Vite creates a `dist` folder containing the production files.

### Preview the production build

```bash
npm run preview
```

This serves the built files only. To check the complete application, including
the navigation API, use Flask as described below instead.

### Serve the website with Flask

Install **uv** as well as Node.js. From the project directory, install the locked
Python dependencies, build the frontend, and start Flask (Windows PowerShell):

```powershell
uv sync
npm run build
uv run app.py
```

Open **http://localhost:5050/**. Keep that terminal running while using the site;
press Ctrl+C to stop the server. Vite does not need to be running alongside Flask.

`app.py` serves `dist/index.html` at `/` and the generated files at `/assets/...`.
The build stays together in `dist`; nothing goes into a Flask `templates` directory.
Flask does not use Jinja templates. React separately fetches `/api/navigation`,
which reads `navigation.json` on every request and returns JSON without caching.

After editing the frontend, run `npm run build` again and refresh the browser.
Edits to `navigation.json` need only a browser refresh, not a rebuild or server
restart. For automatic frontend updates while developing, use `npm run dev`
alongside Flask. The Python server resolves `dist` relative to `app.py`, not the terminal's
working directory.

uv manages the virtual environment and can download a compatible Python runtime
if needed. Add future Python dependencies with `uv add <package>`; commit both
`pyproject.toml` and `uv.lock` to keep installations reproducible. The server
prints a clear error if the frontend has not been built. Flask's built-in server
is for local development and this demonstration, not a production deployment.

Run the backend's focused tests with `uv run python -m unittest test_app`.

---

## 4. How React is used

### What React does here

React lets the developer describe what the page should look like based on current data and state.

Instead of manually finding elements and changing their HTML, this project changes React state. React then re-renders the parts of the interface that depend on that state.

For example:

```jsx
const [menuOpen, setMenuOpen] = useState(false);
```

This creates:

- `menuOpen`: the current value.
- `setMenuOpen`: the function used to change the value.
- `false`: the initial value.

When `setMenuOpen(true)` is called, React updates the page and displays the menu.

### JSX

JSX looks like HTML but is written inside JavaScript:

```jsx
<button className="explore-button" onClick={() => setMenuOpen(true)}>
  EXPLORE THE INDEX
</button>
```

Differences from normal HTML include:

- `className` is used instead of `class`.
- JavaScript expressions are placed inside `{}`.
- Event handlers use camelCase, such as `onClick`.
- Components can be used as if they were HTML elements.

### Components

A component is a JavaScript function that returns JSX. This project has four main components:

1. `Landscape`
2. `CassetteCard`
3. `DetailCard`
4. `App`

The components are reusable pieces of the interface. For example, `CassetteCard` represents one top-level category, and React renders it once for each entry in `navigation`.

### React entry point

The final line in `main.jsx` connects React to the HTML root:

```jsx
createRoot(document.getElementById("root")).render(<App />);
```

This means:

1. Find the element whose ID is `root`.
2. Create a React root inside it.
3. Render the `App` component there.

---

## 5. The navigation data

`navigation.json` is the single source of truth for the menu content. It uses
JSON syntax (double-quoted keys and strings, with no trailing commas):

```json
[
  {
    "id": "discover",
    "number": "01",
    "title": "Discover",
    "note": "Find your next rabbit hole",
    "color": "peach",
    "items": [
      {
        "title": "What's on",
        "description": "A quick look at everything happening.",
        "tag": "OVERVIEW"
      }
    ]
  }
]
```

On page load, React calls `fetch("/api/navigation")` once and stores the result
in its `navigation` state. The menu shows a loading message while waiting and
an explicit error if the request or data is invalid; it never silently falls
back to hardcoded content. Refresh after fixing an error to try again.
The component examples below use this fetched state; older JavaScript object
snippets illustrate the data shape, not literal JSON to paste into the file.

Each top-level section has:

- `id`: A stable internal identifier.
- `number`: The displayed section number.
- `title`: The visible section title.
- `note`: The short explanatory sentence.
- `color`: A CSS colour variant name.
- `items`: The second-level menu entries.

Each item has:

- `title`: The item heading.
- `description`: Supporting text.
- `tag`: The small uppercase label.

### Changing the menu content

To change the labels or add entries, edit the array in `navigation.json`, then
refresh the browser. The landing-page text remains in `src/main.jsx`.

For a new section, copy an existing section and change its `id`, `number`, `title`, `note`, `color`, and `items`.

The `color` value must match a CSS class in `styles.css`, such as:

```css
.cassette-peach { background: #edc3a7; }
.cassette-mint { background: #c5d7bd; }
.cassette-lilac { background: #d3c6d9; }
.cassette-butter { background: #ead99d; }
```

If a new colour name is added to the data but no matching CSS class is added, the card will not receive the intended background colour.

---

## 6. The three navigation states

The menu is controlled by two pieces of selection state:

```jsx
const [menuOpen, setMenuOpen] = useState(false);
const [activeSection, setActiveSection] = useState(null);
const [selectedItem, setSelectedItem] = useState(null);
```

There are three visible content states inside the overlay:

### State 1: All sections

This is shown when:

```text
menuOpen === true
activeSection === null
selectedItem === null
```

The user sees the five large cassette-style category cards:

- Discover
- Create
- Community
- Plan your visit
- Enjoy

They are created with:

```jsx
navigation.map((section, index) => (
  <CassetteCard
    key={section.id}
    section={section}
    index={index}
    onClick={() => setActiveSection(section.id)}
  />
))
```

`map` loops over the array and returns one component for every section.

### State 2: Subsection cards

When a user clicks a category, `activeSection` is set to that category's ID:

```jsx
onClick={() => setActiveSection(section.id)}
```

The active category is found with:

```jsx
const active = navigation.find(
  (section) => section.id === activeSection
);
```

The selected category's items are rendered:

```jsx
active.items.map((item, index) => (
  <DetailCard
    key={item.title}
    item={item}
    index={index}
    onChoose={setSelectedItem}
  />
))
```

The overlay heading also changes to the active category's title and note.

### State 3: Selected-item preview

When a user clicks a subsection card without an `externalUrl`, `selectedItem` receives that item:

```jsx
{...(item.externalUrl
  ? { href: item.externalUrl, target: "_blank", rel: "noreferrer" }
  : { onClick: () => onChoose(item) })}
```

The selected item is then shown in a larger preview panel:

```jsx
{selectedItem ? (
  <motion.div className="selected-panel">
    <div className="selected-stamp">{selectedItem.tag}</div>
    <h3>{selectedItem.title}</h3>
    <p>{selectedItem.description}</p>
  </motion.div>
) : ...}
```

The preview currently includes placeholder text:

> This is a prototype destination. Replace this panel with your actual page or route.

This is the place to add real content, a link, or routing later.

### External destinations

An item can bypass the preview by adding an optional `externalUrl` property:

```jsx
{
  title: "The line-up",
  description: "Browse the full programme and schedule.",
  tag: "PROGRAMME",
  externalUrl: "https://www.google.com"
}
```

The current example links are:

| Item | Destination |
|---|---|
| The line-up | `https://www.google.com` |
| Workshops | `https://www.bing.com` |
| People | `https://www.mnit.ac.in` |

Items without `externalUrl`, such as `What's on`, continue to open the existing selected-item preview.

The `DetailCard` component chooses the correct HTML element:

```jsx
const CardElement = item.externalUrl ? motion.a : motion.button;
```

For an external item, it renders an animated anchor:

```jsx
<CardElement
  className="detail-card"
  href={item.externalUrl}
  target="_blank"
  rel="noreferrer"
>
  ...
</CardElement>
```

For a normal item, it renders an animated button and calls `onChoose(item)`:

```jsx
<CardElement
  className="detail-card"
  onClick={() => onChoose(item)}
>
  ...
</CardElement>
```

`target="_blank"` opens the external destination in a new browser tab. `rel="noreferrer"` prevents the destination from receiving the originating page URL. To use the same tab instead, remove `target` and `rel`.

This design is extensible because adding or removing a destination requires changing only the data object. The `DetailCard` component already handles both behaviors.

---

## 7. Every user interaction

### Opening the menu with the top-right button

The menu button uses conditional logic:

```jsx
onClick={() => menuOpen ? closeMenu() : setMenuOpen(true)}
```

If the menu is closed, it opens it. If the menu is open, it closes it.

The button label and icon also change:

```jsx
<span>{menuOpen ? "CLOSE" : "MENU"}</span>
{menuOpen ? <X size={22} /> : <Menu size={22} />}
```

The `Menu` and `X` components are imported from `lucide-react`.

### Opening the menu with the hero button

The main call-to-action does the same opening action:

```jsx
onClick={() => setMenuOpen(true)}
```

This button always opens the menu, even if it is already open.

### Clicking the brand

The brand is an anchor with `href="#"`, but the default browser navigation is prevented:

```jsx
onClick={(e) => {
  e.preventDefault();
  closeMenu();
}}
```

Clicking the brand therefore returns the app to its initial landing-page state without reloading the browser.

### Closing the menu

The close button calls:

```jsx
function closeMenu() {
  setMenuOpen(false);
  setActiveSection(null);
  setSelectedItem(null);
}
```

It resets all three pieces of state. This is important: reopening the menu always starts at the top-level category list instead of showing the previously selected category.

### Selecting a top-level category

Each `CassetteCard` receives an `onClick` callback from `App`.

Inside the card:

```jsx
onClick={onClick}
```

The callback sets `activeSection`, which causes the subsection cards to replace the category cards.

### Selecting a subsection

Each `DetailCard` receives `onChoose={setSelectedItem}`. The component checks whether the item has an `externalUrl`.

For a preview item, its click handler passes the clicked item:

```jsx
onClick={() => onChoose(item)}
```

This changes the content to the selected-item preview panel. For an external item, the card is an anchor and the browser follows its `href` instead; `setSelectedItem` is not called.

To add another external destination, add the property to an item:

```jsx
{
  title: "New destination",
  description: "A useful external resource.",
  tag: "LINK",
  externalUrl: "https://example.com"
}
```

### Going back from the selected-item preview

The back button calls `goBack`:

```jsx
function goBack() {
  if (selectedItem) setSelectedItem(null);
  else setActiveSection(null);
}
```

The first click from the preview clears `selectedItem`, so the user returns to the subsection cards. If no item is selected, the same function clears `activeSection`, returning to all sections.

### Going back from subsection cards

The `ALL SECTIONS` button also calls `goBack`. Since there is no selected item in this state, it clears `activeSection`.

### Hover and tap feedback

The cards are Framer Motion components. They respond to pointer interactions:

```jsx
whileHover={{
  x: 9,
  rotate: index % 2 ? 1 : -1,
  scale: 1.015
}}
whileTap={{ scale: 0.985 }}
```

This moves and slightly rotates a card on hover, then slightly compresses it while pressed.

The detail cards use a different hover movement:

```jsx
whileHover={{
  y: -5,
  rotate: index % 2 ? -0.5 : 0.5
}}
```

### Escape key

The interface displays `ESC` beside the close button, but no keyboard listener is implemented yet. Pressing Escape currently does not close the menu automatically.

To add that behavior, use a `useEffect` inside `App` and remember to clean up the event listener:

```jsx
import React, { useEffect, useState } from "react";

useEffect(() => {
  function handleKeyDown(event) {
    if (event.key === "Escape") closeMenu();
  }

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, []);
```

The existing README describes this as an easy future enhancement.

---

## 8. Framer Motion animations

Framer Motion extends normal HTML elements with animation behavior. For example:

```jsx
<motion.button
  initial="hidden"
  animate="visible"
  exit="exit"
  variants={cardVariants}
/>
```

The `motion.button` behaves like a normal button but understands animation props.

Framer Motion is imported at the top of `src/main.jsx`:

```jsx
import { AnimatePresence, motion } from "framer-motion";
```

This imports two things:

- `motion`: A collection of animated HTML and SVG elements, such as `motion.button`, `motion.div`, and `motion.section`.
- `AnimatePresence`: A component that allows an element to animate when it is removed from the React render output.

Framer Motion is only used in `src/main.jsx`. The CSS file still controls the static appearance of the elements, such as colours, dimensions, spacing, borders, and shadows.

### Where Framer Motion is used

There are five main uses in this project:

1. `CassetteCard` uses `motion.button`.
2. `DetailCard` uses either `motion.button` or `motion.a`, depending on whether the item has an `externalUrl`.
3. The full-screen menu uses `motion.section`.
4. The selected-item preview uses `motion.div`.
5. The category list and detail grid use `motion.div` containers.

The following sections explain each use.

### `CassetteCard`: top-level category cards

The top-level category cards are created in the `CassetteCard` component:

```jsx
<motion.button
  className={`cassette cassette-${section.color}`}
  custom={index}
  variants={cardVariants}
  initial="hidden"
  animate="visible"
  exit="exit"
  whileHover={{ x: 9, rotate: index % 2 ? 1 : -1, scale: 1.015 }}
  whileTap={{ scale: 0.985 }}
  onClick={onClick}
>
  ...
</motion.button>
```

This is still a real button. Framer Motion does not remove normal button behavior; it adds animation behavior to it.

The props mean:

- `custom={index}` passes the card's position to the animation definition. This is used to stagger the cards.
- `variants={cardVariants}` connects the button to the shared `hidden`, `visible`, and `exit` definitions.
- `initial="hidden"` sets the starting animation state.
- `animate="visible"` tells the card to animate into its visible state.
- `exit="exit"` defines how it leaves when its parent is removed.
- `whileHover={...}` temporarily applies movement while the pointer is over the card.
- `whileTap={...}` temporarily applies a compressed scale while the button is pressed.

The hover rotation alternates using the card index:

```jsx
rotate: index % 2 ? 1 : -1
```

Odd-indexed cards rotate one degree and even-indexed cards rotate negative one degree. JavaScript indexes start at zero, so the first card has index `0`.

### `DetailCard`: subsection cards

The second-level cards use the same shared entrance animation. `DetailCard` chooses an animated button for preview items and an animated anchor for external items:

```jsx
const CardElement = item.externalUrl ? motion.a : motion.button;

<CardElement
  className="detail-card"
  custom={index}
  variants={cardVariants}
  initial="hidden"
  animate="visible"
  exit="exit"
  whileHover={{ y: -5, rotate: index % 2 ? -0.5 : 0.5 }}
  whileTap={{ scale: 0.985 }}
  {...(item.externalUrl
    ? { href: item.externalUrl, target: "_blank", rel: "noreferrer" }
    : { onClick: () => onChoose(item) })}
>
  ...
</CardElement>
```

The behavior differs slightly from the cassette cards:

- Hover moves the card upward with `y: -5`.
- Hover rotation is smaller, at half a degree.
- Pressing the card scales it down to `0.985`.
- Preview items call the normal React callback and select the item.
- External items follow their `href` as normal links; they do not open the preview.

Framer Motion does not decide whether a destination is external. The optional `externalUrl` data field decides which element is rendered; Framer Motion only animates the resulting button or link.

### The full-screen overlay

The entire menu overlay is animated here:

```jsx
<AnimatePresence>
  {menuOpen && (
    <motion.section
      className="menu-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      ...
    </motion.section>
  )}
</AnimatePresence>
```

The important relationship is between `AnimatePresence` and the conditional expression:

```jsx
{menuOpen && <motion.section>...</motion.section>}
```

When `menuOpen` changes from `false` to `true`, React adds the section and Framer Motion fades it in. When it changes from `true` to `false`, React would normally remove the section immediately. `AnimatePresence` keeps it present long enough for the `exit` fade to complete.

The animation values mean:

- `initial={{ opacity: 0 }}`: Start completely transparent.
- `animate={{ opacity: 1 }}`: Fade to fully visible.
- `exit={{ opacity: 0 }}`: Fade out when closing.
- `transition={{ duration: 0.25 }}`: Use a quarter-second transition.

### Switching between the three menu views

The inner `AnimatePresence` controls the content inside the overlay:

```jsx
<AnimatePresence mode="wait">
  {selectedItem ? (
    <motion.div key="selected" className="selected-panel">
      ...
    </motion.div>
  ) : active ? (
    <motion.div key={active.id} className="detail-grid">
      ...
    </motion.div>
  ) : (
    <motion.div key="main" className="cassette-stack">
      ...
    </motion.div>
  )}
</AnimatePresence>
```

Only one of these three branches is rendered at a time:

- `key="main"`: The top-level cassette cards.
- `key={active.id}`: The selected category's detail cards.
- `key="selected"`: The selected-item preview.

The `key` is important because Framer Motion uses it to identify when one view has been replaced by another. When the key changes, the old view can run its exit animation and the new view can run its entrance animation.

`mode="wait"` means the replacement waits for the old view to finish exiting before the new view enters. Without it, both views could briefly appear at the same time.

### Selected-item preview

The selected-item panel is a `motion.div`:

```jsx
<motion.div
  key="selected"
  className="selected-panel"
  initial={{ opacity: 0, y: 18 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -12 }}
>
  ...
</motion.div>
```

It:

1. Starts transparent and 18 pixels lower.
2. Fades in while moving into its normal position.
3. Fades out while moving 12 pixels upward when the user goes back.

No explicit `transition` is provided here, so Framer Motion uses its default transition.

### The detail grid and its back button

The detail view uses a `motion.div` container:

```jsx
<motion.div
  key={active.id}
  className="detail-grid"
  initial="hidden"
  animate="visible"
  exit="exit"
>
  <motion.button
    className="back-tile"
    onClick={goBack}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    ...
  </motion.button>
  {active.items.map(...)}
</motion.div>
```

The grid has named animation states, while the `ALL SECTIONS` button has a simple opacity animation of its own. The detail cards inside the grid also have their own `initial`, `animate`, `variants`, and `custom` props, so each card uses the shared staggered animation.

### Shared card animation

The shared `cardVariants` object defines three named animation states:

```jsx
const cardVariants = {
  hidden: { opacity: 0, y: 24, rotate: 1.5 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: {
      delay: i * 0.075,
      duration: 0.42,
      ease: [0.22, 1, 0.36, 1]
    }
  }),
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: 0.16 }
  }
};
```

The cards begin slightly lower, transparent, and rotated. They animate into place. The index creates a small delay so cards appear one after another.

The `custom={index}` prop supplies the card index to the `visible` function.

For example, the third card has an index of `2`, so its delay is:

```text
2 * 0.075 = 0.15 seconds
```

This is why the cards appear in sequence rather than all at exactly the same time.

The animation properties use transform and opacity values:

- `opacity`: Transparency, from `0` to `1`.
- `y`: Vertical translation in pixels.
- `x`: Horizontal translation in pixels.
- `rotate`: Rotation in degrees.
- `scale`: Size multiplier, where `1` is the normal size.

Framer Motion applies these transforms efficiently without requiring separate CSS classes for every animation state.

### `AnimatePresence`

`AnimatePresence` allows components to animate while leaving the React tree:

```jsx
<AnimatePresence mode="wait">
  {selectedItem ? (
    <SelectedPanel />
  ) : active ? (
    <DetailGrid />
  ) : (
    <CassetteStack />
  )}
</AnimatePresence>
```

`mode="wait"` makes the exiting view finish before the entering view appears. This prevents the different menu states from visually colliding during the transition.

The outer `AnimatePresence` animates the full overlay opening and closing.

### Avoiding accidental animation changes

The `key` values identify each view:

```jsx
key="selected"
key={active.id}
key="main"
```

Changing these keys can change when React treats a view as a new component. Keep them stable unless you intentionally want to restart an animation.

---

## 9. The `Landscape` component

`Landscape` is a decorative component:

```jsx
function Landscape() {
  return (
    <div className="landscape" aria-hidden="true">
      ...
    </div>
  );
}
```

`aria-hidden="true"` tells assistive technology to ignore the decoration because it does not convey content or provide an action.

The landscape is made from:

- A CSS circle for the sun, positioned on a decorative arc using the browser's local time. It moves from left to right between 7 a.m. and 7 p.m., reaches its highest point at midday, and stays at the horizon endpoints outside those hours.
- CSS rounded shapes for clouds.
- Inline SVG paths for the hills.
- Text symbols for flowers and birds.

The sun's horizontal position is clamped so the whole circle stays within the viewport. This is a visual time-of-day effect, not a calculation of the sun's real position or a location-based sunrise and sunset.

The hills use SVG because SVG is good at drawing scalable shapes:

```jsx
<svg className="hills" viewBox="0 0 1440 430" preserveAspectRatio="none">
  <path d="..." fill="#c4d6bd" />
  <path d="..." fill="#91b59e" />
  <path d="..." fill="#547e6e" />
</svg>
```

The `viewBox` defines the SVG's internal coordinate system. `preserveAspectRatio="none"` lets the hills stretch to the available page width.

The background has no dependency on an image file, so there is no image asset to replace or maintain.

---

## 10. How the CSS works

### CSS variables

The `:root` selector defines reusable values:

```css
:root {
  --ink: #26352f;
  --paper: #f4ecdd;
  --red: #c86e51;
  --line: rgba(38, 53, 47, .25);
}
```

Use variables when the same colour appears in multiple places. If a colour is only used once, the stylesheet currently uses a direct value.

### Page layers

The main page uses:

```css
.page-shell {
  position: relative;
  isolation: isolate;
}

.landscape {
  position: absolute;
  inset: 0;
  z-index: -1;
}
```

The page is the positioning context. The landscape fills it and sits behind the content.

The menu overlay uses:

```css
.menu-overlay {
  position: fixed;
  inset: 0;
  z-index: 10;
}
```

`position: fixed` makes it cover the browser viewport. `inset: 0` is shorthand for setting top, right, bottom, and left to zero.

### Card colours

Top-level cassette colours are selected by the `color` property in the data:

```jsx
className={`cassette cassette-${section.color}`}
```

For example, `color: "peach"` becomes:

```html
class="cassette cassette-peach"
```

The CSS then applies:

```css
.cassette-peach { background: #edc3a7; }
.cassette-mint { background: #c5d7bd; }
.cassette-lilac { background: #d3c6d9; }
.cassette-butter { background: #ead99d; }
```

Second-level detail cards use alternating colours:

```css
.detail-card:nth-of-type(odd) {
  background: #d3dfcc;
}

.detail-card:nth-of-type(even) {
  background: #f0d4bd;
}
```

The item data does not contain its own colour.

### Responsive layout

The mobile breakpoint is:

```css
@media (max-width: 650px) {
  ...
}
```

Below 650 pixels:

- The edition label is hidden.
- Header spacing is reduced.
- The hero heading becomes smaller.
- The bottom-left note is hidden.
- The overlay gets smaller side padding.
- Cassette card columns become narrower.
- Detail cards change from two columns to one column.
- The middle overlay footer label is hidden.

The `clamp()` function is used throughout the stylesheet to make sizes adapt between a minimum and maximum:

```css
font-size: clamp(54px, 8vw, 104px);
```

This means the font will not become smaller than 54 pixels or larger than 104 pixels, while `8vw` controls the size between those limits.

---

## 11. Accessibility and semantics

The project already uses several useful accessibility patterns:

- Navigation cards are real `<button>` elements, so they are keyboard-focusable and clickable.
- The brand is a real anchor.
- Icon-only controls have `aria-label` values.
- The decorative landscape is marked `aria-hidden`.
- The overlay close button has an accessible label.

Examples:

```jsx
<button
  onClick={closeMenu}
  aria-label="Close navigation"
>
  <X size={22} />
  <span>ESC</span>
</button>
```

When extending the app:

- Keep actions as `<button>` elements rather than clickable `<div>` elements.
- Add an `aria-label` when an icon does not have visible explanatory text.
- Keep heading order logical.
- Make sure new interactive elements can be reached with the keyboard.
- Do not use colour as the only way to communicate meaning.

Potential future improvements include focus management when the overlay opens, returning focus to the button when it closes, and implementing the Escape key.

---

## 12. How to make common changes

### Change text

Edit menu text in `navigation.json`; landing-page text is inside `App` in `src/main.jsx`.

### Add a new subsection

Add another object to a section's `items` array:

```jsx
{
  title: "New item",
  description: "Explain what the user will find here.",
  tag: "NEW"
}
```

No component change is needed because the existing `.map()` renders all items automatically.

### Add a new top-level section

Add a new object to `navigation.json`. Use a unique `id` and add a matching background class if using a new colour name.

### Change a card colour

Edit the corresponding `.cassette-*` rule in `src/styles.css`.

### Change animation timing

Edit `cardVariants` in `src/main.jsx`. The `delay`, `duration`, and `ease` values control the card entrance.

### Replace the placeholder destination

The selected-item branch is inside `App`:

```jsx
{selectedItem ? (
  <motion.div className="selected-panel">
    ...
  </motion.div>
) : ...}
```

Items without an `externalUrl` use this branch. Replace the placeholder content with the real destination UI, or use a router if the application needs separate internal URLs. Items with an `externalUrl` do not enter this branch; they render as links from `DetailCard`.

### Add an external destination

Add `externalUrl` to the desired item in `navigation.json` (use double-quoted JSON keys):

```jsx
{
  title: "Research",
  description: "Visit the research resource.",
  tag: "EXTERNAL",
  externalUrl: "https://example.com"
}
```

Do not add an empty string. If the property is absent, the item intentionally remains an in-app preview. The current component opens external URLs in a new tab and preserves the same Framer Motion hover and tap animations.

### Add real routes

This prototype does not currently use a routing library. If each item needs its own URL, a future developer could:

1. Add a routing dependency.
2. Define routes for the destination pages.
3. Replace `setSelectedItem(item)` with navigation to the matching route.
4. Decide whether the overlay should remain open while navigating.

That is a larger behavior change and should be designed before implementation.

---

## 13. A complete user flow

Starting from a fresh page:

1. React renders `App`.
2. `menuOpen` is `false`, so only the landing page is visible.
3. The user clicks `EXPLORE THE INDEX`.
4. `setMenuOpen(true)` runs.
5. React renders the full-screen `.menu-overlay`.
6. Framer Motion fades the overlay in and animates the cassette cards.
7. The user clicks `Discover`.
8. `setActiveSection("discover")` runs.
9. React finds the matching section with `navigation.find(...)`.
10. The cassette stack is replaced by the detail grid.
11. The user clicks `What's on`.
12. `setSelectedItem(item)` runs.
13. React replaces the detail grid with the selected-item panel.
14. The user clicks `BACK TO DISCOVER`.
15. `goBack()` clears `selectedItem`.
16. The detail grid appears again.
17. The user clicks `ALL SECTIONS`.
18. `goBack()` clears `activeSection`.
19. The top-level category cards appear again.
20. The user clicks `CLOSE` or the brand.
21. `closeMenu()` clears all state and returns to the landing page.

---

## 13.1. End-to-end interaction session with code

The following is one complete example session. The user starts on the landing page, opens the menu, selects **Discover**, opens **What's on**, returns to the category list, and closes the menu. The code snippets are shown in the order that the browser and React use them.

### Step 1: The browser loads the application

The browser starts with the empty React mount point from `index.html`:

```html
<div id="root"></div>
<script type="module" src="/src/main.jsx"></script>
```

Vite serves `main.jsx` as a JavaScript module. At the bottom of `src/main.jsx`, React mounts `App`:

```jsx
createRoot(document.getElementById("root")).render(<App />);
```

When `App` first runs, all three state values receive their initial values:

```jsx
const [menuOpen, setMenuOpen] = useState(false);
const [activeSection, setActiveSection] = useState(null);
const [selectedItem, setSelectedItem] = useState(null);
```

The initial state is therefore:

```text
menuOpen       = false
activeSection  = null
selectedItem   = null
```

Because `menuOpen` is false, this conditional does not render the overlay:

```jsx
<AnimatePresence>
  {menuOpen && (
    <motion.section className="menu-overlay">
      ...
    </motion.section>
  )}
</AnimatePresence>
```

The user sees the landing page, including the `EXPLORE THE INDEX` button.

### Step 2: The user clicks `EXPLORE THE INDEX`

The landing-page button is defined in `App`:

```jsx
<button
  className="explore-button"
  onClick={() => setMenuOpen(true)}
>
  EXPLORE THE INDEX
  <ArrowUpRight size={17} />
</button>
```

The browser fires the button's click event. The inline callback runs:

```jsx
setMenuOpen(true);
```

React updates the state:

```text
menuOpen       = true
activeSection  = null
selectedItem   = null
```

React renders `App` again. The `menuOpen && (...)` condition is now true, so the overlay is added to the rendered output:

```jsx
{menuOpen && (
  <motion.section
    className="menu-overlay"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.25 }}
  >
    ...
  </motion.section>
)}
```

`AnimatePresence` and `motion.section` make the overlay fade from opacity `0` to opacity `1`. The inner conditional sees that both `selectedItem` and `active` are empty, so it renders the main cassette stack:

```jsx
{selectedItem ? (
  ...
) : active ? (
  ...
) : (
  <motion.div key="main" className="cassette-stack">
    {navigation.map((section, index) => (
      <CassetteCard
        key={section.id}
        section={section}
        index={index}
        onClick={() => setActiveSection(section.id)}
      />
    ))}
  </motion.div>
)}
```

`navigation.map(...)` creates one `CassetteCard` component per section. Each card receives an `onClick` callback that remembers that card's section ID.

### Step 3: Framer Motion animates the cassette cards

Each `CassetteCard` returns a `motion.button`:

```jsx
<motion.button
  className={`cassette cassette-${section.color}`}
  custom={index}
  variants={cardVariants}
  initial="hidden"
  animate="visible"
  exit="exit"
  whileHover={{ x: 9, rotate: index % 2 ? 1 : -1, scale: 1.015 }}
  whileTap={{ scale: 0.985 }}
  onClick={onClick}
>
  ...
</motion.button>
```

The shared variants define the initial and visible states:

```jsx
const cardVariants = {
  hidden: { opacity: 0, y: 24, rotate: 1.5 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: {
      delay: i * 0.075,
      duration: 0.42,
      ease: [0.22, 1, 0.36, 1]
    }
  }),
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: 0.16 }
  }
};
```

The first card uses `index = 0`, so its delay is `0` seconds. The second uses `index = 1`, so its delay is `0.075` seconds. This produces the staggered entrance.

While the user moves the pointer over a card, `whileHover` temporarily changes its position, rotation, and scale. While the pointer is pressing the card, `whileTap` temporarily scales it down.

### Step 4: The user clicks `Discover`

The `Discover` card was given this callback by `App`:

```jsx
onClick={() => setActiveSection(section.id)}
```

For this card, `section.id` is `"discover"`, so the callback is equivalent to:

```jsx
setActiveSection("discover");
```

React updates state:

```text
menuOpen       = true
activeSection  = "discover"
selectedItem   = null
```

During the next render, `App` finds the selected section:

```jsx
const active = navigation.find(
  (section) => section.id === activeSection
);
```

`active` now contains the complete Discover object:

```jsx
{
  id: "discover",
  number: "01",
  title: "Discover",
  note: "Find your next rabbit hole",
  color: "peach",
  items: [...]
}
```

The inner conditional now chooses the `active` branch:

```jsx
{selectedItem ? (
  ...
) : active ? (
  <motion.div
    key={active.id}
    className="detail-grid"
    initial="hidden"
    animate="visible"
    exit="exit"
  >
    <motion.button className="back-tile" onClick={goBack}>
      <ArrowLeft size={17} />
      ALL SECTIONS
    </motion.button>
    {active.items.map((item, index) => (
      <DetailCard
        key={item.title}
        item={item}
        index={index}
        onChoose={setSelectedItem}
      />
    ))}
  </motion.div>
) : (
  ...
)}
```

The old `key="main"` cassette stack exits, and the new `key="discover"` detail grid enters. Because the inner `AnimatePresence` uses `mode="wait"`, the transition is coordinated instead of showing both views at once.

The overlay heading also reads the new state:

```jsx
<h2>
  {selectedItem
    ? selectedItem.title
    : active
      ? active.title
      : "Pick a direction."}
</h2>
```

It now displays `Discover`, and the supporting paragraph displays `active.note`.

### Step 5: The user clicks `What's on`

The first detail item is rendered with:

```jsx
<DetailCard
  item={item}
  index={index}
  onChoose={setSelectedItem}
/>
```

Inside `DetailCard`, the click handler passes the entire item object to the callback:

```jsx
onClick={() => onChoose(item)}
```

For this click, the callback is effectively:

```jsx
setSelectedItem({
  title: "What's on",
  description: "A quick look at everything happening.",
  tag: "OVERVIEW"
});
```

React state is now:

```text
menuOpen       = true
activeSection  = "discover"
selectedItem   = {
  title: "What's on",
  description: "A quick look at everything happening.",
  tag: "OVERVIEW"
}
```

The `selectedItem` condition has the highest priority, so React renders the preview branch:

```jsx
{selectedItem ? (
  <motion.div
    key="selected"
    className="selected-panel"
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -12 }}
  >
    <div className="selected-stamp">{selectedItem.tag}</div>
    <h3>{selectedItem.title}</h3>
    <p>{selectedItem.description}</p>
    <p className="selected-placeholder">
      This is a prototype destination. Replace this panel with your actual page or route.
    </p>
    <button className="back-button" onClick={goBack}>
      <ArrowLeft size={16} />
      BACK TO {active?.title.toUpperCase()}
    </button>
  </motion.div>
) : ...}
```

The user sees:

```text
OVERVIEW
What's on
A quick look at everything happening.
```

The optional chaining in `active?.title` safely reads the active section title. In this session, it produces `BACK TO DISCOVER`.

### Step 6: The user clicks `BACK TO DISCOVER`

The preview button calls the shared `goBack` function:

```jsx
function goBack() {
  if (selectedItem) setSelectedItem(null);
  else setActiveSection(null);
}
```

Because `selectedItem` currently exists, only this line runs:

```jsx
setSelectedItem(null);
```

The resulting state is:

```text
menuOpen       = true
activeSection  = "discover"
selectedItem   = null
```

React therefore stops rendering the selected preview and returns to the `active` branch. The Discover detail cards appear again, and the selected preview runs its `exit` animation.

### Step 7: The user clicks `ALL SECTIONS`

The detail-grid back button is wired to the same function:

```jsx
<motion.button
  className="back-tile"
  onClick={goBack}
>
  <ArrowLeft size={17} />
  ALL SECTIONS
</motion.button>
```

This time `selectedItem` is already `null`, so `goBack` runs its other branch:

```jsx
setActiveSection(null);
```

State becomes:

```text
menuOpen       = true
activeSection  = null
selectedItem   = null
```

The `active` lookup now returns `undefined`, so the inner conditional returns to:

```jsx
<motion.div key="main" className="cassette-stack">
  ...
</motion.div>
```

The cassette cards re-enter with their staggered animation.

### Step 8: The user clicks `CLOSE`

The overlay close button calls:

```jsx
<button
  className="close-button"
  onClick={closeMenu}
  aria-label="Close navigation"
>
  <X size={22} />
  <span>ESC</span>
</button>
```

The `closeMenu` function resets every navigation value:

```jsx
function closeMenu() {
  setMenuOpen(false);
  setActiveSection(null);
  setSelectedItem(null);
}
```

The final state is:

```text
menuOpen       = false
activeSection  = null
selectedItem   = null
```

The `menuOpen && (...)` condition becomes false. `AnimatePresence` detects that the `motion.section` is leaving and runs:

```jsx
exit={{ opacity: 0 }}
```

After the 0.25-second fade-out, the overlay is removed. The landing page is visible again, ready for a new session.

---

## 14. Development guidelines for the next developer

### Keep content and presentation separate

Put menu content in `navigation.json`. Put visual rules in `styles.css`. Avoid embedding a one-off colour or layout rule inside a component when the stylesheet can express it.

### Prefer existing components

If a new top-level card is needed, reuse `CassetteCard`. If a new subsection card is needed, reuse `DetailCard`.

### Keep state minimal

The current state represents the user's position in the menu:

- `menuOpen`: whether the overlay is visible.
- `activeSection`: which top-level section is open.
- `selectedItem`: which subsection is being previewed.

Avoid adding duplicate state that can be calculated from these values.

### Preserve stable keys

Use unique, stable keys when rendering lists:

```jsx
key={section.id}
key={item.title}
```

If titles can repeat, add a separate unique ID to the data and use that instead.

### Test each interaction after changes

After changing the code, check:

- The page loads without console errors.
- The top-right menu button opens and closes the overlay.
- The hero button opens the overlay.
- Every top-level section opens.
- Every subsection opens its preview.
- Both back buttons return to the correct level.
- The brand closes the menu.
- Hover and tap animations still work.
- The layout works below and above 650 pixels.

---

## 15. Build and handover checklist

Before handing this project to another developer:

1. Run `npm install` if dependencies are not installed.
2. Run `npm run dev` and test the complete user flow.
3. Check the browser console for errors.
4. Run `npm run build`.
5. If the production build succeeds, optionally run `npm run preview`.
6. Confirm that changes to `navigation` appear in the correct card.
7. Confirm that any new CSS colour class matches the value used in the data.
8. Confirm that new interactive elements remain keyboard-accessible.

---

## 16. Important current limitations

These are intentional prototype limitations, not missing setup steps:

- Most destination panels are placeholders rather than real pages; three example items currently link to Google, Bing, and MNIT.
- Flask serves the built website and a read-only navigation API backed by a JSON file.
- There is no database.
- There is no routing library.
- The Escape key is displayed but not wired up.
- There is no automated test suite in `package.json`.
- Fonts are loaded from Google Fonts in `index.html`, so the final visual appearance depends on network access unless fonts are later self-hosted.

The safest next extension is to add an `externalUrl` only to items that should leave the prototype, or replace the selected-item placeholder with real internal content. Add routing only when the desired URL and browser-history behavior have been agreed.
