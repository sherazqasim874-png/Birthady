# Romantic Birthday Surprise Website

A beautiful romantic birthday adventure for your future wife. It includes an envelope surprise, birthday welcome, hidden-heart game, love quiz, memory gallery, personal letter, and final surprise celebration.

## Project structure

```text
Birthady/
├── index.html
├── style.css
├── script.js
├── README.md
└── assets/
    └── background-music.mp3   (optional)
```

## Run locally

### Option 1: open directly

Double-click `index.html` in a browser.

### Option 2: use a local server (recommended)

From the project folder, run:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Customize the experience

All the key personal details are in the configuration object at the top of `script.js`:

```js
const config = {
  herName: "[ENTER HER NAME]",
  myName: "[ENTER YOUR NAME]",
  birthdayDate: "[ENTER DATE]",
  relationship: "My future wife",
  musicPath: "",
  finalMessage: "If I could make one wish today...",
  memoryPhotos: [
    { src: "", caption: "Our first smile" },
    { src: "", caption: "A dream we both held" }
  ],
  quizQuestions: [
    { question: "What makes a day special?", options: [...], correct: 1, feedback: "Exactly." }
  ]
};
```

### Edit names and date

Update:
- `herName`
- `myName`
- `birthdayDate`
- `relationship`

Use a date in this format:

```js
birthdayDate: "2026-10-02"
```

### Edit the love letter

Update the long message in `script.js` inside the `typeLetter()` function.

### Add photos

Place your image files inside `assets/` and update the `memoryPhotos` array with image paths, for example:

```js
memoryPhotos: [
  { src: "assets/photo-1.jpg", caption: "Our first smile" },
  { src: "assets/photo-2.jpg", caption: "A dream we both held" }
]
```

If an image fails to load, the page automatically swaps in a romantic placeholder.

### Add background music

Place a local audio file in `assets/` and set:

```js
musicPath: "assets/background-music.mp3"
```

The music button is a toggle. It never starts playing automatically.

## Customize the quiz or messages

You can edit:
- the question text
- the answer options
- the correct answer index
- the encouraging feedback

This is all stored in the `quizQuestions` array in `script.js`.

## Deploy to GitHub Pages

1. Push the project folder to a GitHub repository.
2. In GitHub, open the repository.
3. Go to Settings > Pages.
4. Under Source, choose `Deploy from a branch`.
5. Select `main` and the root folder `/`.
6. Save.
7. GitHub will give you a live URL.

If your site uses a local audio file, make sure it is inside the repository and referenced with a relative path.

## Notes

- This project is static and requires no backend.
- It works offline once the files are loaded locally.
- All major interactions are built using HTML, CSS, and JavaScript only.
