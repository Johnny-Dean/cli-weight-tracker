#!/usr/bin.env node

import sqlite3    from 'sqlite3';
import inquirer   from 'inquirer';
import asciichart from 'asciichart';

const db = new sqlite3.Database('weight_log',(err) => {
    if (err) console.log(err.message)
    console.log("connected to database")
})

let date = new Date;

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS "${date.getFullYear().toString()}"(month text, day text, weight integer, calories integer)`, (err) => {
        if (err) {
            console.log(err.message);
            throw err;
        }
    })
})

const database_weight_insert = (weight, calories) => {
        db.run(`INSERT INTO '${date.getFullYear().toString()}'(month, day,  weight, calories)
        VALUES('${date.getMonth()}', '${date.getDay()}', ${weight}, ${calories})`, 
        (err) => {
            if (err) {
                console.log(err.message)
                throw err;
            }
            console.log(`Inserted: '${date.getMonth()}', '${date.getDay()}', ${weight}, ${calories})`)
            });
}

async function database_weight_retrieve(){
    return new Promise ((resolve, reject) => {
        db.all(`SELECT * FROM '${date.getFullYear().toString()}'`, (err, rows) => {
            if (err) {
                console.log(err.message)
                throw err;
            }
                resolve(rows);
            })
    })
}


let weight_logs = []
let weight_plottable = []
let calories_plottable = []
database_weight_retrieve().then(logs => {
    weight_logs = logs;
    for (const log of logs){
        weight_plottable.push(log.weight)
        calories_plottable.push(log.calories)
    }
})



async function welcome_message() {
    console.log(`
        Hello Johnny
    `)
}

async function command_interface(){
    const choice = await inquirer.prompt({
        name:    "interface_choice",
        type:    "list",
        message: "What would you like to do?",
        choices: [
            "w : view your weight",
            "i : input your daily weight"
        ]
    });

    return handle_command_input(choice.interface_choice.charAt(0))
}

async function handle_command_input(command){
    if (command === 'w'){
        await view_weight_prompt();
    }
    else if (command === 'i') {
        const weight   = await input_weight();
        const calories = await input_calories();
        database_weight_insert(weight, calories);
    }
}

async function view_weight_prompt(){
    const choice = await inquirer.prompt({
        name:    "view_weight_choice",
        type:    "list",
        message: "Do you want to view: ",
        choices: [
            "c : your recorded weight as a chart",
            "l : your recorded weight as a list"
        ]
    })
    const parsed_choice = choice.view_weight_choice.charAt(0);
    if (parsed_choice === "c"){
        console.log(asciichart.plot(weight_plottable, {height: 10}))
    }
    else if (parsed_choice === "l"){
        console.log(weight_logs)
    }
}

async function input_weight(){
    const input = await inquirer.prompt({
        name:    "weight_input",
        type:    "input",
        message: "enter your weight for today",
    })

    return input.weight_input; 
}

async function input_calories(){
    const input = await inquirer.prompt({
        name:    "calories_input",
        type:    "input",
        message: "enter your calories consumed today"
    })

    return input.calories_input;
}

// What is top level await

await welcome_message();
await command_interface();