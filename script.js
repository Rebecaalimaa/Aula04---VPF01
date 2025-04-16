const uri = "http://localhost:5000";
const dadosFront = "./assets/produtos.json";
var produtos = [];
var pedidos = [];

fetch(uri + "/pedidos")
    .then(resp => {
        if (!resp.ok) throw new Error("Erro ao buscar pedidos");
        return resp.json();
    })
    .then(dados => {
        pedidos = dados;
        preencherPedidos();
    })
    .catch(error => console.error(error));

document.querySelector("footer p").textContent = new Date().toLocaleDateString();

fetch(dadosFront)
    .then(resp => {
        if (!resp.ok) throw new Error("Erro ao buscar produtos");
        return resp.json();
    })
    .then(dados => {
        produtos = dados;
        const main = document.querySelector("main");
        dados.forEach(produto => {
            const card = document.createElement("div");
            card.className = "card";
            const total = produto.preco + produto.frete;

            card.innerHTML = `
                <h2>${produto.nome}</h2>
                <img src="${produto.imagem}" alt="${produto.nome}">
                <p>${produto.descricao}</p>
                <p>Preço: R$ ${produto.preco.toFixed(2)}</p>
                <p>Peso: ${produto.peso.toFixed(2)} Kg</p>
                <p>Frete: R$ ${produto.frete.toFixed(2)}</p>
                <p>Total: R$ ${total.toFixed(2)}</p>
                <button onclick="abrirModalPedido(${produto.id})">Adicionar Ao Carrinho</button>
            `;
            main.appendChild(card);
        });
    })
    .catch(error => console.error(error));

function preencherPedidos() {
    const tbody = document.querySelector("#listarPedidos tbody");
    tbody.innerHTML = "";
    pedidos.forEach(pedido => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td data-label="Id">${pedido.id}</td>
            <td data-label="Data">${new Date(pedido.data).toLocaleDateString()}</td>
            <td data-label="Hora">${new Date(pedido.data).toLocaleTimeString()}</td>
            <td data-label="Produto">${pedido.produto}</td>
            <td data-label="Quantidade">${pedido.qtd}</td>
            <td data-label="Preço">R$ ${pedido.preco.toFixed(2)}</td>
            <td data-label="Subtotal">R$ ${(pedido.preco * pedido.qtd).toFixed(2)}</td>
            <td data-label="Excluir"><button onclick="removePedido(${pedido.id})">-</button></td>
        `;
        tbody.appendChild(tr);
    });
}

function abrirModalPedido(id) {
    const produto = produtos.find(produto => produto.id == id);
    const body = document.querySelector("body");
    const modal = document.createElement("section");
    modal.id = "novoPedido";
    modal.className = "modal";
    const janela = document.createElement("div");
    janela.className = "janela";
    janela.innerHTML = `
        <div>
            <h2>Adicionar Produto ao Carrinho</h2>
            <button onclick="fecharModal()">X</button>
        </div>
        <form>
            <label for="produto">Produto</label>
            <input type="text" name="produto" value="${produto.nome}" disabled>
            <label for="preco">Preço</label>
            <input type="text" name="preco" value="${produto.preco.toFixed(2)}" disabled>
            <label for="qtd">Quantidade</label>
            <input type="number" name="qtd" value="1" required>
            <button type="submit">Adicionar Ao Carrinho</button>
        </form>
    `;
    modal.appendChild(janela);
    body.appendChild(modal);

    const cadPedido = document.querySelector("#novoPedido form");
    cadPedido.addEventListener("submit", e => {
        e.preventDefault();
        const dados = {
            id: produto.id,
            nome: produto.nome,
            preco: Number(cadPedido.preco.value),
            qtd: Number(cadPedido.qtd.value),
            subTotal: (Number(cadPedido.preco.value) * Number(cadPedido.qtd.value)).toFixed(2)
        };

        let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
        const itemExistente = carrinho.find(item => item.id === dados.id);
        if (itemExistente) {
            itemExistente.qtd += dados.qtd;
            itemExistente.subTotal = (itemExistente.qtd * itemExistente.preco).toFixed(2);
        } else {
            carrinho.push(dados);
        }
        localStorage.setItem("carrinho", JSON.stringify(carrinho));

        alert("Produto adicionado ao carrinho!");
        fecharModal();
    });
}

function fecharModal() {
    const modal = document.querySelector("#novoPedido");
    if (modal) {
        modal.remove();
    }
}

function removePedido(id) {
    fetch(uri + "/pedidos/" + id, {
        method: "DELETE"
    })
    .then(resp => {
        if (!resp.ok) throw new Error("Erro ao remover pedido");
        return resp.status;
    })
    .then(status => {
        if (status == 204) {
            alert("Pedido removido com sucesso!");
            pedidos = pedidos.filter(pedido => pedido.id !== id);
            preencherPedidos();
        }
    })
    .catch(error => {
        alert("Erro ao remover pedido!");
        console.error(error);
    });
}