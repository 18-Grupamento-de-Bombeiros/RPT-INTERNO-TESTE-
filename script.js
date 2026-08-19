const API_URL = "https://script.google.com/macros/s/AKfycbwSFAClKtAahYoFylvNuYH2ZPr03pPpQMakrmsVgr6gHnFxpgUkcr6ic0LZylrhY8_m/exec";

fetch(API_URL)
    .then(response => response.json())
    .then(dados => {

        console.log("Dados recebidos:", dados);

        const resultado = document.getElementById("resultado");

        resultado.innerHTML = "";

        // ================================
        // AGRUPAR OS INSCRITOS POR DESTINO
        // ================================

        const grupos = {};

        dados.forEach(inscrito => {

            const destino = inscrito.destino;

            if (!grupos[destino]) {
                grupos[destino] = [];
            }

            grupos[destino].push(inscrito);

        });


        // ================================
        // CRIAR OS GRUPOS NA PÁGINA
        // ================================

        Object.keys(grupos).forEach(destino => {

            const grupo = document.createElement("div");

            const titulo = document.createElement("h2");

            titulo.textContent = `Destino: ${destino}`;

            grupo.appendChild(titulo);


            // ================================
            // LISTAR INSCRITOS DO DESTINO
            // ================================

            grupos[destino].forEach(inscrito => {

                const linha = document.createElement("p");

                linha.textContent =
                    `${inscrito.qra} — ${inscrito.graduacao} — ${inscrito.re} — ${inscrito.origem}`;

                grupo.appendChild(linha);

            });


            resultado.appendChild(grupo);

        });

    })
    .catch(erro => {

        console.error("Erro ao carregar os dados:", erro);

        document.getElementById("resultado").textContent =
            "Erro ao carregar os inscritos.";

    });
