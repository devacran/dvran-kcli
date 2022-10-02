#! /usr/bin/env node
const yargs = require("yargs");
const { commands } = require("./utils.js");
const utils = require("./utils.js");
const usage = "\nUsage: kcli [branch] [cm]";

const options = yargs.usage(usage).help(true).argv;

if (!yargs.argv._[0]) {
  utils.showHelp();
  return;
}

if (yargs.argv._[0] === "branch") {
  commands.branch({ name: options.ticket, ticket: options.name });
}

if (yargs.argv._[0] === "cm") {
  const isTemp = options.temp;
  const message = options.message;
  commands.cm({ isTemp, message });
  return;
}
