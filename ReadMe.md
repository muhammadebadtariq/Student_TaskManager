# Student Task Manager

A friendly, fast and accessible task manager for students, built with HTML5, CSS3 and vanilla JavaScript. It was created by a two-person team as a hands-on project to practise a real Git and GitHub workflow: feature branches, issues, pull requests, code reviews, merge conflicts, recovery commands, tags and releases.

**Live repository:** https://github.com/muhammadebadtariq/Student_TaskManager

---

## Features

- Add tasks with a title, subject, priority, due date and notes
- Mark tasks as done with one click and undo it just as easily
- Delete tasks, with an Undo option in case of a mistake
- Search by title, subject or notes as you type
- Filter by All, Active or Done, and sort by newest, due date or priority
- Progress ring and live counters for total, active, done and overdue tasks
- Due date reminders: "Due today", "Due tomorrow" and "Overdue since..."
- Tasks are saved in the browser, so they are still there after a refresh
- Light and dark themes that remember your choice
- Responsive layout for phones, tablets and desktops
- Keyboard friendly, with visible focus, screen reader labels and reduced motion support

## Technologies

| Area | Tools |
| --- | --- |
| Structure | HTML5 (semantic elements, ARIA labels) |
| Styling | CSS3 (custom properties, Grid, Flexbox, media queries) |
| Logic | Vanilla JavaScript (ES6+), localStorage |
| Version control | Git and GitHub |

## How to Run

1. Clone the repository:
   ```bash
   git clone https://github.com/muhammadebadtariq/Student_TaskManager.git
   ```
2. Open the project folder:
   ```bash
   cd Student_TaskManager
   ```
3. Open `index.html` in any modern browser. No build step or server is needed.

## Project Structure

```text
Student_TaskManager/
├── index.html     # Page structure and semantic layout
├── style.css      # Design tokens, layout, themes and responsive rules
├── script.js      # Task logic, search, filters, storage and theme
└── ReadMe.md      # Project documentation
```

## Team Members

| Role | Name | GitHub |
| --- | --- | --- |
| Student 1 | Muhammad Ebad Tariq | [@muhammadebadtariq](https://github.com/muhammadebadtariq) |
| Student 2 | Your partner's name | @partner-username |

## Git Workflow

1. Create the project and initialise Git
2. Make small, meaningful commits
3. Create the GitHub repository and push `main`
4. Create a feature branch for each piece of work
5. Open a Pull Request, get a code review, then merge
6. Pull the latest `main` before starting new work
7. Resolve merge conflicts together when they happen
8. Tag stable versions and publish a GitHub Release

## Branches

| Branch | Purpose | Owner |
| --- | --- | --- |
| `main` | Stable, reviewed code | Both |
| `feature/task-form` | Page structure and task form (`index.html`) | Student 1 |
| `feature/task-style` | Styling and task logic (`style.css`, `script.js`) | Student 2 |
| `feature/task-search` | Task search functionality | Both |

## Git Commands Demonstrated

`git init`, `git status`, `git add`, `git commit`, `git log`, `git branch`, `git switch`, `git diff`, `git diff --staged`, `git clone`, `git remote -v`, `git push`, `git fetch`, `git pull`, `git merge`, `git stash`, `git restore`, `git reset`, `git revert`, `git show`, `git blame`, `git tag`

## GitHub Features Demonstrated

- Public repository with a README
- Issues with descriptions and acceptance criteria
- Pull Requests with titles, descriptions and linked issues (`Closes #<number>`)
- Code reviews with comments and approvals
- Merging through Pull Requests
- Merge conflict creation and resolution
- Tags and GitHub Releases

## Screenshots

Add your screenshots to a `screenshots/` folder and link them here.

| Light theme | Dark theme |
| --- | --- |
| ![Light theme](screenshots/light.png) | ![Dark theme](screenshots/dark.png) |

## Version History

| Version | Highlights |
| --- | --- |
| v1.0.0 | First stable release: add, complete, delete and search tasks |
| v1.1.0 | Redesigned interface, filters, sorting, priorities, due dates, progress ring, saved tasks and dark theme |

## Contributors

- **Muhammad Ebad Tariq** ([@muhammadebadtariq](https://github.com/muhammadebadtariq)): project setup, page structure and task form
- **Student 2** ([@afnanfatima123](https://github.com/afnanfatima123)): styling and task logic

---

Made with care by two students learning to work together with Git and GitHub.