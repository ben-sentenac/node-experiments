#!/usr/bin/env node
const { printTreeRecursive,printTree } = require('../lib/tree');
const { resolve } = require('node:path');
const process = require('node:process');
const { start } = require('node:repl');
const colors = require('../lib/colors');
const { Command } = require('commander');


const program = new Command('nodetree')
.argument('[dir]','Directory to print',process.cwd())
.description('Print the directorry structure of a given directory (default:current working directory)')
.version('1.0.0');

/*
TODO: modify generator to oinly print untracked when untracked is true ?
*/

program
.option('-t, --untracked','display directory with current git tracked status',false)
.option('-d, --node-dep','print the tree structure of the node_modules dir if any',false)
.option('-i, --indent <number>', 'set indentation space of printed tree',0)
.option('-o, --output <file>','Print the output into the given file')
.option('-f, --fast', false)
.action(async (dir,{ untracked,nodeDep,indent,output,fast}) => {
        if(fast) {
            const message ='WARNING: [Git tracking not available with --fast options]';
            console.log(message);
            printTreeRecursive(dir,{
                indent:' '.repeat(indent),
                ignoreNodeModules:!nodeDep,
            });
            process.exit(0);
        }
        return printTree(dir,{
            gitTracking:untracked,
            ignoreNodeModules:!nodeDep,
            indent:' '.repeat(indent)
        });
});

program.parse();
//

/**
 * TODO
 * commands
 * 
 * nodetree -n alias to nodetree node_modules -> print treedir of node_modules
 * nodetree --git -g <sourcedir> show untrackfile
 * nodetree  <sourcedir> -o <file> print output to a file 
 * nodetree --json print output on json format
 * nodetree -e regex find file by regex and return the path ?
 */




//const sourceDir = resolve(process.cwd(),(process.argv.slice(2)[0]) || '');

//nodetree <sourceDir> --ignore=file1,file2,file3




//printTreeRecursive(sourceDir);
//printTree(sourceDir,{gitTracking:true});
