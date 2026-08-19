// ======================================================
// URL DA API DO GOOGLE APPS SCRIPT
// ======================================================

const API_URL = "https://script.google.com/macros/s/AKfycbwSFAClKtAahYoFylvNuYH2ZPr03pPpQMakrmsVgr6gHnFxpgUkcr6ic0LZylrhY8_m/exec";

// ======================================================
// BUSCAR OS DADOS
// ======================================================

fetch(API_URL)

    .then(response => response.json())

    .then(dados => {

        console.log("Dados recebidos:", dados);

        gerarRPT(dados);

    })

    .catch(erro => {

        console.error("Erro ao carregar os dados:", erro);

        document.getElementById("resultado").innerHTML = `

            <p class="carregando">
                Erro ao carregar os dados.
            </p>

        `;

    });


// ======================================================
// GERAR O RPT
// ======================================================

function gerarRPT(dados) {

    const resultado = document.getElementById("resultado");

    resultado.innerHTML = "";


    // ==================================================
    // AGRUPAR POR DESTINO
    // ==================================================

    const grupos = {};


    dados.forEach(inscrito => {

        const destino = inscrito.destino;

        if (!grupos[destino]) {

            grupos[destino] = [];

        }

        grupos[destino].push(inscrito);

    });


    // ==================================================
    // ORDENAR OS DESTINOS ALFABETICAMENTE
    // ==================================================

    const destinos = Object.keys(grupos).sort();


    // ==================================================
    // CRIAR CADA GRUPO
    // ==================================================

    destinos.forEach(destino => {

        const inscritos = grupos[destino];


        // ----------------------------------------------
        // ORDENAR POR DATA DE INSCRIÇÃO
        // ----------------------------------------------

        inscritos.sort((a, b) => {

            return converterData(a.data) - converterData(b.data);

        });


        // ----------------------------------------------
        // CRIAR CONTAINER DO DESTINO
        // ----------------------------------------------

        const grupo = document.createElement("div");

        grupo.className = "grupo";


        // ----------------------------------------------
        // TÍTULO
        // ----------------------------------------------

        const titulo = document.createElement("h2");

        titulo.textContent = `Destino: ${destino}`;

        grupo.appendChild(titulo);


        // ----------------------------------------------
        // CRIAR TABELA
        // ----------------------------------------------

        const tabela = document.createElement("table");


        // ----------------------------------------------
        // CABEÇALHO
        // ----------------------------------------------

        tabela.innerHTML = `

            <thead>

                <tr>

                    <th>Class.</th>

                    <th>Post/Grad</th>

                    <th>RE</th>

                    <th>Nome</th>

                    <th>EB Atual</th>

                    <th>Data de Inscrição</th>

                </tr>

            </thead>

            <tbody></tbody>

        `;


        const tbody = tabela.querySelector("tbody");


        // ----------------------------------------------
        // INSCRITOS
        // ----------------------------------------------

        inscritos.forEach((inscrito, indice) => {

            const linha = document.createElement("tr");


            linha.innerHTML = `

                <td>${indice + 1}º</td>

                <td>${escaparHTML(inscrito.graduacao)}</td>

                <td>${escaparHTML(inscrito.re)}</td>

                <td>${escaparHTML(inscrito.qra)}</td>

                <td>${escaparHTML(inscrito.origem)}</td>

                <td>${formatarData(inscrito.data)}</td>

            `;


            tbody.appendChild(linha);

        });


        grupo.appendChild(tabela);


        // ----------------------------------------------
        // TOTAL DE INSCRITOS
        // ----------------------------------------------

        const total = document.createElement("div");

        total.className = "total-inscritos";

        total.innerHTML = `

            Total de inscritos:
            <strong>${inscritos.length}</strong>

        `;


        grupo.appendChild(total);


        resultado.appendChild(grupo);

    });


    // ==================================================
    // ATUALIZAÇÃO
    // ==================================================

    document.getElementById("data-atualizacao").textContent =
        new Date().toLocaleDateString("pt-BR");

}


// ======================================================
// CONVERTER DATA PARA ORDENAÇÃO
// ======================================================

function converterData(data) {

    const partes = data.split(" ")[0].split("/");

    return new Date(

        partes[2],

        partes[1] - 1,

        partes[0]

    );

}


// ======================================================
// FORMATAR DATA
// ======================================================

function formatarData(data) {

    return data.split(" ")[0];

}


// ======================================================
// PROTEÇÃO CONTRA HTML
// ======================================================

function escaparHTML(texto) {

    const div = document.createElement("div");

    div.textContent = texto;

    return div.innerHTML;

}
