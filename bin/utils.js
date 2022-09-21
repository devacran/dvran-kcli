const { exec } = require("child_process");
const prompt = require("prompt-async");
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
      "      " +
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
module.exports = { showHelp, commands: { cm: cmCommand } };
