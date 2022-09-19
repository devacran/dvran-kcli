#! /usr/bin/env node
const yargs = require("yargs");
const prompt = require("prompt-async");
const { commands } = require("./utils.js");
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
  .help(true).argv;

if (yargs.argv._[0] === null) {
  utils.showHelp();
  return;
}

if (yargs.argv._[0] === "branch") {
  if (options._) {
    console.log(options._);
  }
    const ticket = {
    name: "ticket",
    description: "Enter your jira ticket", 
    type: "string", 
    message: "Ticket is required",
    required: true,
  };
  console.log("enter your ticket: ");
    prompt.get([ticket], function (err, result) {
    console.log("result", result.ticket);
  });
  console.log("enter branch description: ");
  console.log("git checkout master && git pull && git branch -d ");
  return;
}


