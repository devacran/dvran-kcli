const { exec } = require("child_process");
const prompt = require("prompt-async");

const usage = "\nUsage: tran <lang_name> sentence to be translated";

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

function cmCommand(message, ticketNumber) {
  exec(`git commit -m"${message} ${ticketNumber}"`, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
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
  //console.log("enter branch description: ");
  //console.log("git checkout master && git pull && git branch -d ");
  return;
}
module.exports = {
  showHelp,
  commands: { cm: cmCommand, branch: branchCommand },
};
