const { exec } = require("child_process");
const prompt = require("prompt-async");

const JIRA_TICKET_REGEX = /[A-Z]{2,}-\d+/g;

async function cmCommand({ message, isTemp }) {
  exec(
    'git rev-list --format=%B --max-count=1 HEAD | grep "Work in progress"',
    (error, stdout, stderr) => {
      if (!stdout) {
        commitChanges(isTemp, message);
      } else {
        console.log("A temp commit already exists");
      }
    }
  );
}

async function commitChanges(isTemp, message) {
  if (isTemp) {
    exec(
      `git commit --no-verify -m"Work in progress, don´t fork this branch"`,
      (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }
        console.log(
          "Changes Commited, Don´t forget ammend this commit before create new one ;)"
        );
      }
    );
    return;
  }

  let commitMsg = message;
  const commitMsgInput = {
    name: "commitMsg",
    description: "Enter a commit message",
    type: "string",
    message: "Message is required",
    required: true,
  };
  if (!commitMsg) {
    commitMsg = (await prompt.get(commitMsgInput)).commitMsg;
  }

  getJiraTicket((jiraTicketNumber) => {
    exec(
      `git commit -m"${commitMsg} [${jiraTicketNumber}]"`,
      (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }
      }
    );
  });
}

function getJiraTicket(cb) {
  exec(`git branch | grep "*"`, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    try {
      cb(stdout.slice(2).match(JIRA_TICKET_REGEX)[0]);
    } catch (error) {
      console.log(
        `error: unable to commit, did you create this branch with kcli?`
      );
    }
  });
}

async function branchCommand(options) {
  let ticketNumber = options.ticket;
  let branchName = options.name;

  const ticketInput = {
    name: "ticket",
    description: "Enter your jira ticket",
    type: "string",
    message: "Ticket is required",
    required: true,
  };
  const branchNameInput = {
    name: "branchName",
    description: "Enter a branch description",
    type: "string",
    message: "Branch name description is required",
    required: true,
  };
  if (!branchName) {
    branchName = (await prompt.get(branchNameInput)).branchName;
  }

  if (!ticketNumber) {
    ticketNumber = (await prompt.get(ticketInput)).ticket;
  }
  branchName = branchName.split(" ").join("-");
  const command = `git checkout develop && git pull --ff-only && git checkout -b ${ticketNumber}-${branchName}`;
  exec(command, (error, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
  });
  return;
}

module.exports = {
  commands: { cm: cmCommand, branch: branchCommand },
};
