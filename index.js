#!/usr/bin.env node

import inquirer from 'inquirer';
import asciichart from 'asciichart';



const weights = {
    2022: {
        jan: [
            {weight: 172 ,  date: new Date()},
            {weight: 169 ,  date: new Date()},
            {weight: 177 ,  date: new Date()},
            {weight: 157 ,  date: new Date()},
            {weight: 197 ,  date: new Date()},
            {weight: 127 ,  date: new Date()}
        ],
        feb: [
            {weight: 172 ,  date: new Date()},
            {weight: 169 ,  date: new Date()},
            {weight: 177 ,  date: new Date()},
            {weight: 157 ,  date: new Date()},
            {weight: 197 ,  date: new Date()},
            {weight: 127 ,  date: new Date()}
        ]
    }
}



let weightArr = [];

for (const month of mock_weights){
    weightArr.push(weight.weight)
}

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
        await input_weight();
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
        console.log(asciichart.plot(weightArr, {height: 10}))
    }
    else if (parsed_choice === "l"){
        console.log(mock_weights)
    }
}

async function input_weight(){
    
}

// What is top level await

await welcome_message();
await command_interface();