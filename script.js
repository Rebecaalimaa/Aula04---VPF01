const produtos = [
    {
      id: 1,
      nome: "Tênis lindão",
      descricao: "O tênis mais lindo do mundo",
      preco: 200.0,
      peso: 0.5,
      frete: 0.1,
      imagem: "https://wellifabio.github.io/produtos-cards/assets/tenis1.png",
    },
    {
      id: 2,
      nome: "Tênis bunitinho",
      descricao: "O tênis mais bunitinho de hoje",
      preco: 180.0,
      peso: 0.5,
      frete: 0.1,
      imagem: "https://wellifabio.github.io/produtos-cards/assets/tenis2.png",
    },
    {
      id: 3,
      nome: "Bruzinha",
      descricao: "Camiseta branca simples",
      preco: 49.9,
      peso: 0.3,
      frete: 0.1,
      imagem: "https://wellifabio.github.io/produtos-cards/assets/camiseta1.png",
    },
    {
      id: 4,
      nome: "Camiseta Preta",
      descricao: "Camiseta pretinha básica",
      preco: 59.9,
      peso: 0.3,
      frete: 0.1,
      imagem: "https://wellifabio.github.io/produtos-cards/assets/camiseta2.png",
    },
    {
      id: 5,
      nome: "Calsa jeans masculino",
      descricao: "Calsa jeans masculino, azul básico",
      preco: 49.9,
      peso: 1.2,
      frete: 0.2,
      imagem: "https://wellifabio.github.io/produtos-cards/assets/calsa1.png",
    },
    {
      id: 6,
      nome: "Calsa jeans feminino",
      descricao: "Calsa jeans feminino, azul básico",
      preco: 49.9,
      peso: 0.9,
      frete: 0.2,
      imagem: "https://wellifabio.github.io/produtos-cards/assets/calsa2.png",
    },
  ];
  
  // Verifica qual página está sendo exibida
  const isIndex = document.location.pathname.includes("index");
  const isCarrinho = document.location.pathname.includes("carrinho");
  
  // Funções para index.html
  if (isIndex) {
    const container = document.getElementById("produtos");
    const modal = document.getElementById("modal");
  
    produtos.forEach((produto) => {
      const card = document.createElement("div");
      card.className = "produto";
      card.innerHTML = `
        <img src="${produto.imagem}" alt="${produto.nome}">
        <div class="produto-info">
          <h3>${produto.nome}</h3>
          <p>R$ ${produto.preco.toFixed(2).replace(".", ",")}</p>
          <button onclick="mostrarDetalhes(${produto.id})">Detalhes</button>
        </div>
      `;
      container.appendChild(card);
    });
  
    window.mostrarDetalhes = function (id) {
      const produto = produtos.find((p) => p.id === id);
      document.getElementById("modal-nome").textContent = produto.nome;
      document.getElementById("modal-imagem").src = produto.imagem;
      document.getElementById("modal-descricao").textContent = produto.descricao;
      document.getElementById("modal-preco").textContent = `R$ ${produto.preco.toFixed(2).replace(".", ",")}`;
      document.getElementById("modal-peso").textContent = produto.peso;
      document.getElementById("modal-frete").textContent = `R$ ${(produto.peso * 0.1).toFixed(2).replace(".", ",")}`;
      document.getElementById("adicionar-carrinho").onclick = () => adicionarAoCarrinho(produto);
      modal.style.display = "flex";
    };
  
    document.getElementById("fechar-modal").onclick = () => {
      modal.style.display = "none";
    };
  }
  
  function adicionarAoCarrinho(produto) {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const index = carrinho.findIndex((p) => p.id === produto.id);
    if (index >= 0) {
      carrinho[index].quantidade += 1;
    } else {
      carrinho.push({ ...produto, quantidade: 1 });
    }
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    alert("Produto adicionado ao carrinho!");
    document.getElementById("modal").style.display = "none";
  }
  
  // Funções para carrinho.html
  if (isCarrinho) {
    const container = document.getElementById("itens-carrinho");
    const totalSpan = document.getElementById("total");
  
    function renderCarrinho() {
      container.innerHTML = "";
      let total = 0;
      const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  
      carrinho.forEach((item, index) => {
        total += item.preco * item.quantidade;
        const div = document.createElement("div");
        div.className = "item-carrinho";
        div.innerHTML = `
          <img src="${item.imagem}" width="100">
          <h3>${item.nome}</h3>
          <p>R$ ${item.preco.toFixed(2).replace(".", ",")}</p>
          <input type="number" min="0" value="${item.quantidade}" onchange="atualizarQuantidade(${index}, this.value)">
          <hr/>
        `;
        container.appendChild(div);
      });
  
      totalSpan.textContent = total.toFixed(2).replace(".", ",");
    }
  
    window.atualizarQuantidade = function (index, valor) {
      let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
      valor = parseInt(valor);
      if (valor <= 0) {
        carrinho.splice(index, 1);
      } else {
        carrinho[index].quantidade = valor;
      }
      localStorage.setItem("carrinho", JSON.stringify(carrinho));
      renderCarrinho();
    };
  
    document.getElementById("enviar-pedido").onclick = () => {
      localStorage.removeItem("carrinho");
      alert("Pedido enviado com sucesso!");
      window.location.href = "index.html";
    };
  
    renderCarrinho();
  }
  