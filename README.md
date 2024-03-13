## Node version

12
`nvm use 12`

## Development

`NODE_ENV=productionx`
In `client/.env` set `REACT_APP_NODE_ENV=productionx`

`npm run dev`

## To Deploy

In the variables.env file set `NODE_ENV=production`
In `client/.env` set `REACT_APP_NODE_ENV=production`

(`git pull heroku master`)

Then `git push heroku master`

## Semantic Commit Messages

feat: add hat wobble
^--^ ^------------^
| |
| +-> Summary in present tense.
|
+-------> Type: chore, docs, feat, fix, refactor, style, or test.

More Examples:

    feat: (new feature for the user, not a new feature for build script)
    fix: (bug fix for the user, not a fix to a build script)
    docs: (changes to the documentation)
    style: (formatting, missing semi colons, etc; no production code change)
    refactor: (refactoring production code, eg. renaming a variable)
    test: (adding missing tests, refactoring tests; no production code change)
    chore: (updating grunt tasks etc; no production code change)
