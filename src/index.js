const players = [
    { NOME: "Mario", VELOCIDADE: 4, MANOBRABILIDADE: 3, PODER: 3, PONTOS: 0 },
    { NOME: "Luigi", VELOCIDADE: 3, MANOBRABILIDADE: 4, PODER: 4, PONTOS: 0 },
    { NOME: "Peach", VELOCIDADE: 3, MANOBRABILIDADE: 4, PODER: 2, PONTOS: 0 },
    { NOME: "Bowser", VELOCIDADE: 5, MANOBRABILIDADE: 2, PODER: 5, PONTOS: 0 },
    { NOME: "Yoshi", VELOCIDADE: 2, MANOBRABILIDADE: 4, PODER: 3, PONTOS: 0 },
    { NOME: "Donkey Kong", VELOCIDADE: 2, MANOBRABILIDADE: 2, PODER: 5, PONTOS: 0 }
];

async function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

async function getRandomBlock() {
    let random = Math.random();
    return random < 0.33 ? "RETA" : random < 0.66 ? "CURVA" : "CONFRONTO";
}

async function logRollResult(characterName, block, diceResult, attribute) {
    console.log(`${characterName} 🎲 rolou ${block} ${diceResult} + ${attribute} = ${diceResult + attribute}`);
}

async function getConfrontoItem() {
    return Math.random() < 0.5 ? "CASCO" : "BOMBA";
}

async function getTurboBonus() {
    return Math.random() < 0.5;
}

async function playRaceEngine(character1, character2) {
    for (let round = 1; round <= 5; round++) {
        console.log(`🏁 Rodada ${round}`);

        const block = await getRandomBlock();
        console.log(`Bloco: ${block}`);

        let diceResult1 = await rollDice();
        let diceResult2 = await rollDice();

        let totalTestSkill1 = 0;
        let totalTestSkill2 = 0;

        // RETA
        if (block === "RETA") {
            totalTestSkill1 = diceResult1 + character1.VELOCIDADE;
            totalTestSkill2 = diceResult2 + character2.VELOCIDADE;

            await logRollResult(character1.NOME, "velocidade", diceResult1, character1.VELOCIDADE);
            await logRollResult(character2.NOME, "velocidade", diceResult2, character2.VELOCIDADE);
        }

        // CURVA
        if (block === "CURVA") {
            totalTestSkill1 = diceResult1 + character1.MANOBRABILIDADE;
            totalTestSkill2 = diceResult2 + character2.MANOBRABILIDADE;

            await logRollResult(character1.NOME, "manobrabilidade", diceResult1, character1.MANOBRABILIDADE);
            await logRollResult(character2.NOME, "manobrabilidade", diceResult2, character2.MANOBRABILIDADE);
        }

        // CONFRONTO
        if (block === "CONFRONTO") {
            let powerResult1 = diceResult1 + character1.PODER;
            let powerResult2 = diceResult2 + character2.PODER;

            console.log(`${character1.NOME} confrontou com ${character2.NOME}! 🥊`);
            await logRollResult(character1.NOME, "poder", diceResult1, character1.PODER);
            await logRollResult(character2.NOME, "poder", diceResult2, character2.PODER);

            if (powerResult1 > powerResult2) {
                const item = await getConfrontoItem();
                const perda = item === "CASCO" ? 1 : 2;
                character2.PONTOS = Math.max(0, character2.PONTOS - perda);

                console.log(`${character1.NOME} venceu o confronto! ${character2.NOME} perdeu ${perda} ponto(s) com ${item}`);

                if (await getTurboBonus()) {
                    character1.PONTOS++;
                    console.log(`${character1.NOME} ganhou um TURBO! (+1 ponto) 🚀`);
                }
            } 
            else if (powerResult2 > powerResult1) {
                const item = await getConfrontoItem();
                const perda = item === "CASCO" ? 1 : 2;
                character1.PONTOS = Math.max(0, character1.PONTOS - perda);

                console.log(`${character2.NOME} venceu o confronto! ${character1.NOME} perdeu ${perda} ponto(s) com ${item}`);

                if (await getTurboBonus()) {
                    character2.PONTOS++;
                    console.log(`${character2.NOME} ganhou um TURBO! (+1 ponto) 🚀`);
                }
            } 
            else {
                console.log("Confronto empatado! Nenhum ponto foi perdido");
            }
        }

        // Vencedor da rodada (reta ou curva)
        if (block !== "CONFRONTO") {
            if (totalTestSkill1 > totalTestSkill2) {
                console.log(`${character1.NOME} marcou um ponto!`);
                character1.PONTOS++;
            } else if (totalTestSkill2 > totalTestSkill1) {
                console.log(`${character2.NOME} marcou um ponto!`);
                character2.PONTOS++;
            }
        }

        console.log("-----------------------------");
    }
}

async function declareWinner(character1, character2) {
    console.log("Resultado final:");
    console.log(`${character1.NOME}: ${character1.PONTOS} ponto(s)`);
    console.log(`${character2.NOME}: ${character2.PONTOS} ponto(s)`);

    if (character1.PONTOS > character2.PONTOS)
        console.log(`\n${character1.NOME} venceu a corrida! 🏆`);
    else if (character2.PONTOS > character1.PONTOS)
        console.log(`\n${character2.NOME} venceu a corrida! 🏆`);
    else 
        console.log("A corrida terminou em empate");
}

(async function main() {
    // Sortear aleatoriamente 2 jogadores diferentes
    const indices = [];
    while (indices.length < 2) {
        const idx = Math.floor(Math.random() * players.length);
        if (!indices.includes(idx)) indices.push(idx);
    }

    const player1 = JSON.parse(JSON.stringify(players[indices[0]]));
    const player2 = JSON.parse(JSON.stringify(players[indices[1]]));

    console.log(`🏁🚩 Corrida entre ${player1.NOME} e ${player2.NOME} começando...\n`);
    await playRaceEngine(player1, player2);
    await declareWinner(player1, player2);
})();