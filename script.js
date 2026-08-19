const API_URL = "https://script.google.com/macros/s/AKfycbwSFAClKtAahYoFylvNuYH2ZPr03pPpQMakrmsVgr6gHnFxpgUkcr6ic0LZylrhY8_m/exec";

fetch(API_URL)
    .then(response => response.json())
    .then(dados => {

        console.log("Dados recebidos:", dados);

        const resultado = document.getElementById("resultado");

        resultado.innerHTML = "";

        dados.forEach(inscrito => {

            const linha = document.createElement("p");

            linha.textContent =
                `${inscrito.qra} — ${inscrito.destino}`;

            resultado.appendChild(linha);

        });

    })
    .catch(erro => {

        console.error("Erro ao carregar os dados:", erro);

        document.getElementById("resultado").textContent =
            "Erro ao carregar os inscritos.";

    });
