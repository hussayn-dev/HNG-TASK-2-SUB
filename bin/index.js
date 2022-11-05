#!/usr/bin/env node
const callProcess = require("../helpers/controller")
const path = require("path")
console.log("input file")
process.stdin.on("data", (data) => {
    let fileDir = data.toString().trim();
  
    //check if user entered a path
    return  fileDir ?   callProcess( path.resolve(fileDir)) : callProcess();
  
  });
