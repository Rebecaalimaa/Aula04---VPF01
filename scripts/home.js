const main = document.querySelector('main');
var produtos = [];

//Verificar se há algo no localStorage
var carrinho = JSON.parse(localStorage.getItem('carrinho'));
if (carrinho == null) {
    carrinho = [];
}

//Carregar os dados do arquivo JSON
fetch('../assets/dados.json')
    .then(response => response.json())
    .then(data => {
        produtos = data;
    }).
    then(() => {
        exibirCards();
    });

function exibirCards() {
    produtos.forEach((produto, indice) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.nome}">
            <h2>${produto.nome}</h2>
            <p>R$ ${produto.preco.toFixed(2)}</p>
            <button onclick="mostrarDetalhes(${indice})">Detalhes</button>
        `;
        main.appendChild(card);
    });
}

function mostrarDetalhes(indice) {
    const detalhes = document.getElementById('detalhes');
    const titulo = document.querySelector('#detalhes h2');
    const imagem = document.querySelector('#detalhes img');
    const descricao = document.querySelector('#detalhes .descricao p');
    const preco = document.querySelector('#detalhes .preco p');
    const frete = document.querySelector('#detalhes .frete p');
    const total = document.querySelector('#detalhes .total p');
    const botao = document.querySelector('#detalhes .rodape button');
    detalhes.classList.remove('oculto');
    titulo.innerHTML = produtos[indice].nome;
    imagem.src = produtos[indice].imagem;
    descricao.innerHTML = produtos[indice].descricao;
    preco.innerHTML = `R$ ${produtos[indice].preco.toFixed(2)}`;
    let valorFrete = produtos[indice].frete * produtos[indice].peso * produtos[indice].preco;
    frete.innerHTML = `R$ ${valorFrete.toFixed(2)}`;
    let valorTotal = produtos[indice].preco + valorFrete;
    total.innerHTML = `R$ ${valorTotal.toFixed(2)}`;
    botao.setAttribute('onclick', `adicionarCarrinho(${indice})`);
}

function adicionarCarrinho(indice) {
    const produto = produtos[indice];
    //Verifica se o produto já está no carrinho
    const produtoExistente = carrinho.find(item => item.id === produto.id);
    let frete = produto.frete * produto.peso * produto.preco;
    if (produtoExistente) {
        produtoExistente.quantidade += 1; // Incrementa a quantidade
        produtoExistente.total = produtoExistente.quantidade * (produto.preco + frete); // Atualiza o total
        // Atualiza o total do produto existente no carrinho
        const index = carrinho.indexOf(produtoExistente);
        if (index > -1) {
            carrinho[index] = produtoExistente; // Atualiza o produto existente no carrinho
        }
    } else {
        produto.quantidade = 1; // Define a quantidade inicial como 1
        produto.total = produto.preco + frete; // Define o total inicial
        carrinho.push(produto);
    }
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    window.location.href = 'carrinho.html';
    const detalhes = document.getElementById('detalhes');
}