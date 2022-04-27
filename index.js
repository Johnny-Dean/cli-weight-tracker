#!/usr/bin.env node

// imports and global variable declartions

import sqlite3    from 'sqlite3';
import inquirer   from 'inquirer';
import asciichart from 'asciichart';

const date = new Date;
const day = date.getDate();
const month = date.toLocaleDateString(undefined, {month: 'short'});
const year = date.getFullYear().toString();
let weight_logs = []
let weight_plottable = []
let calories_plottable = []

// connect to database and create if it does not exist

const db = new sqlite3.Database('weight_log',(err) => {
    if (err) console.log(err.message)
    console.log("connected to database")
})

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS "${year}"(month text, day text, weight integer, calories integer)`, (err) => {
        if (err) {
            console.log(err.message);
            throw err;
        }
    })
})


// database functions

const database_weight_insert = (weight, calories) => {
        db.run(`INSERT INTO '${year}'(month, day, weight, calories)
        VALUES('${month}', '${day}', ${weight}, ${calories})`, 
        (err) => {
            if (err) {
                console.log(err.message)
                throw err;
            }});
}

async function retrieve_database_weight(){
    return new Promise ((resolve, reject) => {
        db.all(`SELECT * FROM '${year}'`, (err, rows) => {
            if (err) {
                console.log(err.message)
                throw err;
            }
                resolve(rows);
            })
    })
}

// cli interface functions

async function welcome_message() {
    console.log(`Hello Johnny`)
}

async function command_interface(){
    const choice = await inquirer.prompt({
        name:    "interface_choice",
        type:    "list",
        message: "What would you like to do?",
        choices: [
            "w : view your weight",
            "i : input your daily weight",
            "q : quit"
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
        console.log(`Inserted: ${month} ${day} ${weight} ${calories}`)
        command_interface()
    }
    else {
        return;
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
        command_interface()
    }
    else if (parsed_choice === "l"){
        print_formatted_logs(weight_logs)
        command_interface()
    }
}

// input functions

async function input_weight(){
    const input = await inquirer.prompt({
        name:    "weight_input",
        type:    "input",
        message: "Enter your weight for today: ",
    })

    return input.weight_input; 
}

async function input_calories(){
    const input = await inquirer.prompt({
        name:    "calories_input",
        type:    "input",
        message: "Enter your calories consumed today: "
    })

    return input.calories_input;
}

// formatting functions

const print_formatted_logs = (logs) => {
    for (const log of logs){
        console.log(`${log.month} ${log.day} Weight: ${log.weight} Calories: ${log.calories}`)
    }
} 

// main


retrieve_database_weight().then(logs => {
    weight_logs = logs;
    for (const log of logs){
        weight_plottable.push(log.weight)
        calories_plottable.push(log.calories)
    }
})

await welcome_message();
await command_interface();