/*
import fs from "fs";
import readline from "readline";

const rl = readline.createInterface({input: process.stdin, output: process.stdout
});

if (fs.existsSync('.env')) {
    console.log('.env ya existe, borrarlo si quieres crear uno nuevo');
    process.exit(0);
}

rl.question('¿Cuál es tu DB_NAME? ', (dbName) => {
    rl.question('¿Cuál es tu JWT_SECRET? ', (jwtSecret) => {
        rl.question('¿Cuál es tu JWT_EXP?', (jwtExp) => {
            rl.question('¿Cuál es tu MONGODB_URI? ', (mongoUri) => {
                const envContent = `MONGODB_URI=${mongoUri}
DB_NAME=${dbName}
JWT_SECRET=${jwtSecret}
JWT_EXP=${jwtExp || '7d'}`;
                
                fs.writeFileSync('.env', envContent);
                console.log('.env creado exitosamente!');
                
                rl.close();
                process.exit(0);
            });
        });
    });
});
*/


import fs from "fs";
import readline from "readline";

const rl = readline.createInterface({input: process.stdin, output: process.stdout});

if (fs.existsSync('.env')) {
    console.log('.env ya existe, borrarlo si quieres crear uno nuevo');
    process.exit(0);
}

const variablesEntorno = [
    { key: 'DB_NAME', pregunta: '¿Cuál es tu DB_NAME? ' },
    { key: 'JWT_SECRET', pregunta: '¿Cuál es tu JWT_SECRET? ' },
    { key: 'JWT_EXP', pregunta: '¿Cuál es tu JWT_EXP?' },
    { key: 'MONGODB_URI', pregunta: '¿Cuál es tu MONGODB_URI? ' }
];

const respuestas = {};
let indiceRecursivo = 0;

function siguientePregunta() {
    if (indiceRecursivo >= variablesEntorno.length) {
        const envContenido = `MONGODB_URI=${respuestas.MONGODB_URI}
DB_NAME=${respuestas.DB_NAME}
JWT_SECRET=${respuestas.JWT_SECRET}
JWT_EXP=${respuestas.JWT_EXP}`;
        
        fs.writeFileSync('.env', envContenido);
        console.log('.env creado exitosamente!');
        
        rl.close();
        process.exit(0);
        return;
    }

    const actual = variablesEntorno[indiceRecursivo];
    rl.question(actual.pregunta, (respuesta) => {
        respuestas[actual.key] = respuesta;
        indiceRecursivo++;
        siguientePregunta();
    });
}

siguientePregunta();