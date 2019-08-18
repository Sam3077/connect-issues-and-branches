# connect-issues-and-branches

> A GitHub App built with [Probot](https://github.com/probot/probot) that A bot that creates workflow connections between branches and issues they are created for.

## Features

### Implemented

- Whenever a branch is created for work regarding an issue, a comment will be left on the issue that links to the branch.
  - The branch name must match a specified pattern to reference the issue.
  - You may create a custom branch name pattern by following the instructions in the [Configuration](#configuration) section.

### Planned

- If an issue is part of a project, its status should be updated to "In-Progress" when a branch is created.
- When the branch is merged, the issue should receive an update.
  - If the issue is part of a project, its status should be updated to "Done".

## Configuration

_Note that you do not need to create a config file. If one is not created, it is assumed that your branch names follow the format: `optional-string/#-branch-name` where # is the issue number the branch is created for._
If you want to create a custom branch name pattern for this bot, you must add a `.github/config.yml` as shown below:

```yaml
# Change this value to define a custom branch name pattern that will activate this bot.
branchNameRegex: "^[A-Za-z/_-]*[0-9]+[A-Za-z0-9/_-]*$"

# Change this value to define how to extract the issue number from a branch name.
# Note that the first part of the string that matches this pattern will be used as the issue number.
issueReferenceRegex: "[0-9]+"
```

## Installation

You can install directly from [this page](https://github.com/apps/connect-issues-and-branches)

## Running your own instance

```sh
# Install dependencies
npm install

# Run typescript
npm run build

# Run the bot
npm start
```

## Contributing

If you have suggestions for how connect-issues-and-branches could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2019 Sam Hirsch <sam.hirsch66@gmail.com>
