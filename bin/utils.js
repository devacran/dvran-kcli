const { exec } = require("child_process");
const prompt = require("prompt-async");
<<<<<<< HEAD
=======

>>>>>>> 5592fc5 (add branch command)
const usage = "\nUsage: tran <lang_name> sentence to be translated";
const jiraTicketRegex = /[A-Z]{2,}-\d+/g;
function showHelp() {
  console.log(usage);
  console.log("\nOptions:\r");
  console.log(
    "\t--version\t      " + "Show version number." + "\t\t" + "[boolean]\r"
  );
  console.log(
    "    -l, --languages\t" +
      "     " +
      "List all languages." +
      "\t\t" +
      "[boolean]\r"
  );
  console.log("\t--help\t\t      " + "Show help." + "\t\t\t" + "[boolean]\n");
}

async function cmCommand(message) {
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
      cb(stdout.slice(2).match(jiraTicketRegex)[0]);
    } catch (error) {
      console.log(
        `error: unable to commit, did you create this branch with kcli?`
      );
    }
  });
}
<<<<<<< HEAD
module.exports = { showHelp, commands: { cm: cmCommand } };
=======

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
  //console.log("enter branch description: ");
  //console.log("git checkout master && git pull && git branch -d ");
  return;
}
module.exports = {
  showHelp,
  commands: { cm: cmCommand, branch: branchCommand },
};
>>>>>>> 5592fc5 (add branch command)
