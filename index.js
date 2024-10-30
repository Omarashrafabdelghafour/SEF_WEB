const fs = require("fs");
const yargs = require("yargs");


const loadData = () => {
    try {
        const loaded_data = fs.readFileSync("Data.json").toString();
        return JSON.parse(loaded_data);
    } catch (error) {
        return [];
    }
};

const saveData = (data) => {
    fs.writeFileSync("Data.json", JSON.stringify(data, null, 2));
};

const addPerson = (id, firstName, lastName, age, city) => {
    const allData = loadData();
    if (allData.length < 10) {
        allData.push({ id, firstName, lastName, age, city });
        saveData(allData);
        console.log(`Added: ${firstName} ${lastName}`);
    } else {
        console.log("Maximum number of people reached.");
    }
};


const viewPeople = (id) => {
    const allData = loadData();
    if (id) {
        const person = allData.find(p => p.id === id);
        if (person) {
            console.log(person);
        } else {
            console.log("Person not found.");
        }
    } else {
        console.log(allData);
    }
};

const deletePeople = (id) => {
    const allData = loadData();
    if (id) {
        const newData = allData.filter(p => p.id !== id);
        if (newData.length < allData.length) {
            saveData(newData);
            console.log(`Deleted person with ID: ${id}`);
        } else {
            console.log("Person not found.");
        }
    } else {
        saveData([]); 
        console.log("All people deleted.");
    }
};

// Set up yargs commands
yargs
    .command({
        command: 'add',
        describe: 'Add a person',
        builder: {
            id: {
                describe: 'Person ID',
                demandOption: true,
                type: 'string'
            },
            firstName: {
                describe: 'First name',
                demandOption: true,
                type: 'string'
            },
            lastName: {
                describe: 'Last name',
                demandOption: true,
                type: 'string'
            },
            age: {
                describe: 'Age',
                demandOption: true,
                type: 'number'
            },
            city: {
                describe: 'City',
                demandOption: true,
                type: 'string'
            }
        },
        handler(argv) {
            addPerson(argv.id, argv.firstName, argv.lastName, argv.age, argv.city);
        }
    })
    .command({
        command: 'view',
        describe: 'View people',
        builder: {
            id: {
                describe: 'Person ID',
                type: 'string'
            }
        },
        handler(argv) {
            viewPeople(argv.id);
        }
    })
    .command({
        command: 'delete',
        describe: 'Delete people',
        builder: {
            id: {
                describe: 'Person ID',
                type: 'string'
            }
        },
        handler(argv) {
            deletePeople(argv.id);
        }
    })
    .command({
        command: 'delete-all',
        describe: 'Delete all people',
        handler() {
            deletePeople();
        }
    })
    .help()
    .argv;
