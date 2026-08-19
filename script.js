const API_URL = "https://script.google.com/macros/s/AKfycbwSFAClKtAahYoFylvNuYH2ZPr03pPpQMakrmsVgr6gHnFxpgUkcr6ic0LZylrhY8_m/exec";

fetch(API_URL)
    .then(response => response.json())
    .then(dados => {

        console.log("Dados recebidos:", dados);

    })
    .catch(erro => {

        console.error("Erro ao carregar os dados:", erro);

    });
