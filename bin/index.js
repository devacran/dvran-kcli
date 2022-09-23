#! /usr/bin/env node
const yargs = require("yargs");
const prompt = require("prompt-async");
const { commands, getGitBranchName } = require("./utils.js");
const utils = require("./utils.js");
const usage = "\nUsage: tran <lang_name> sentence to be translated";

const options = yargs
  .usage(usage)
  .option("l", {
    alias: "languages",
    describe: "List all supported languages.",
    type: "boolean",
    demandOption: false,
  })
  .option("t", {
    alias: "ticket",
    describe: "set ticket number",
    type: "string",
  })
  .help(true).argv;

if (yargs.argv._[0] === null) {
  utils.showHelp();
  return;
}

if (yargs.argv._[0] === "branch") {
  commands.branch({ name: options.ticket, ticket: options.name });
}

if (yargs.argv._[0] === "cm") {
  if (options._) {
    console.log(options._);
  }
  commands.cm();
  return;
}
