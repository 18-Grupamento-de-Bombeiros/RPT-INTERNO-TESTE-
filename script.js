// ======================================================
// URL DA API DO GOOGLE APPS SCRIPT
// ======================================================

const API_URL = "https://script.google.com/macros/s/AKfycbwSFAClKtAahYoFylvNuYH2ZPr03pPpQMakrmsVgr6gHnFxpgUkcr6ic0LZylrhY8_m/exec";


// ======================================================
// ANIMAÇÃO - CARREGANDO INSCRIÇÕES
// ======================================================

const carregando = document.querySelector(".carregando");

let pontos = 0;

const animacao = setInterval(() => {

    pontos = (pontos + 1) % 4;

    carregando.textContent =
        "Carregando inscrições" + ".".repeat(pontos);

}, 400);


// ======================================================
// BUSCAR OS DADOS
// ======================================================

fetch(API_URL)

    .then(response => response.json())

    .then(dados => {

        clearInterval(animacao);

        console.log("Dados recebidos:", dados);

        gerarRPT(dados);

    })

    .catch(erro => {

        clearInterval(animacao);

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
    // CRIAR CADA DESTINO
    // ==================================================

    destinos.forEach(destino => {

        const inscritos = grupos[destino];


        // ==================================================
        // SEPARAR POR GRADUAÇÃO
        // ==================================================

        const superiores = [];

        const cabosSoldados = [];

        const outrasGraduacoes = [];


        inscritos.forEach(inscrito => {

            const graduacao = normalizarGraduacao(inscrito.graduacao);


            // ----------------------------------------------
            // SUBTENENTES E SARGENTOS
            // ----------------------------------------------

            if (

                graduacao.includes("SUBTEN") ||

                graduacao.includes("S TEN") ||

                graduacao.includes("SGT") ||

                graduacao.includes("SARGENTO")

            ) {

                superiores.push(inscrito);

            }


            // ----------------------------------------------
            // CABOS E SOLDADOS
            // ----------------------------------------------

            else if (

                graduacao.includes("CB") ||

                graduacao.includes("CABO") ||

                graduacao.includes("SD") ||

                graduacao.includes("SOLDADO")

            ) {

                cabosSoldados.push(inscrito);

            }


            // ----------------------------------------------
            // OUTRAS GRADUAÇÕES
            // ----------------------------------------------

            else {

                outrasGraduacoes.push(inscrito);

            }

        });


        // ==================================================
        // CONTAINER DO DESTINO
        // ==================================================

        const grupo = document.createElement("div");

        grupo.className = "grupo";


        // ==================================================
        // TÍTULO DO DESTINO
        // ==================================================

        const titulo = document.createElement("h2");

        titulo.textContent = `Destino: ${destino}`;

        grupo.appendChild(titulo);


        // ==================================================
        // SARGENTOS E SUBTENENTES
        // ==================================================

        if (superiores.length > 0) {

            criarTabelaGraduacao(

                grupo,

                "Subtenentes e Sargentos",

                superiores

            );

        }


        // ==================================================
        // CABOS E SOLDADOS
        // ==================================================

        if (cabosSoldados.length > 0) {

            criarTabelaGraduacao(

                grupo,

                "Cabos e Soldados",

                cabosSoldados

            );

        }


        // ==================================================
        // OUTRAS GRADUAÇÕES
        // ==================================================

        if (outrasGraduacoes.length > 0) {

            criarTabelaGraduacao(

                grupo,

                "Outras graduações",

                outrasGraduacoes

            );

        }


        resultado.appendChild(grupo);

    });


    // ==================================================
    // ATUALIZAÇÃO
    // ==================================================

    document.getElementById("data-atualizacao").textContent =
        new Date().toLocaleDateString("pt-BR");

}


// ======================================================
// CRIAR TABELA DE CADA GRUPO
// ======================================================

function criarTabelaGraduacao(container, tituloGrupo, inscritos) {


    // ==================================================
    // ORDENAR POR DATA DE INSCRIÇÃO
    // ==================================================

    inscritos.sort((a, b) => {

        return converterData(a.data) - converterData(b.data);

    });


    // ==================================================
    // TÍTULO DO GRUPO
    // ==================================================

    const subtitulo = document.createElement("h3");

    subtitulo.className = "subgrupo-titulo";

    subtitulo.textContent = tituloGrupo;

    container.appendChild(subtitulo);


    // ==================================================
    // CRIAR TABELA
    // ==================================================

    const tabela = document.createElement("table");


    // ==================================================
    // CABEÇALHO
    // ==================================================

    tabela.innerHTML = `

        <thead>

            <tr>

                <th>Class.</th>

                <th>Post/Grad</th>

                <th>RE</th>

                <th>QRA</th>

                <th>EB Atual</th>

                <th>Data de Inscrição</th>

            </tr>

        </thead>

        <tbody></tbody>

    `;


    const tbody = tabela.querySelector("tbody");


    // ==================================================
    // INSCRITOS
    // ==================================================

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


    container.appendChild(tabela);


    // ==================================================
    // TOTAL DO GRUPO
    // ==================================================

    const total = document.createElement("div");

    total.className = "total-inscritos";

    total.innerHTML = `

        Total de inscritos:
        <strong>${inscritos.length}</strong>

    `;


    container.appendChild(total);

}


// ======================================================
// NORMALIZAR GRADUAÇÃO
// ======================================================

function normalizarGraduacao(graduacao) {

    return String(graduacao || "")

        .normalize("NFD")

        .replace(/[\u0300-\u036f]/g, "")

        .toUpperCase()

        .trim();

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
