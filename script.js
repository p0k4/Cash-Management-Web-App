let contadorOperacao = 1;

function setarDataAtual() {
  const dataInput = document.getElementById("data");
  const hoje = new Date().toISOString().split("T")[0];
  dataInput.value = hoje;
}

function registar() {
  const valor = parseFloat(document.getElementById("valor").value);
  if (!isNaN(valor)) {
    const operacao = "Operação " + contadorOperacao;
    const data = document.getElementById("data").value;
    const numDoc = document.getElementById("num-doc").value;
    const pagamento = document.getElementById("pagamento").value;

    const tabela = document
      .getElementById("tabelaRegistos")
      .querySelector("tbody");
    const novaLinha = tabela.insertRow();
    novaLinha.insertCell(0).textContent = operacao;
    novaLinha.insertCell(1).textContent = data;
    novaLinha.insertCell(2).textContent = numDoc;
    novaLinha.insertCell(3).textContent = pagamento;
    novaLinha.insertCell(4).textContent = valor.toFixed(2) + " €";

    const cellOpcoes = novaLinha.insertCell(5);
    cellOpcoes.classList.add("col-opcoes");

    const btn = document.createElement("button");
    btn.innerHTML = '<i class="fas fa-trash"></i> Apagar';
    btn.className = "btn-apagar-linha";
    btn.onclick = function () {
      novaLinha.remove();
      salvarDadosLocal();
      atualizarTotalTabela();
    };
    cellOpcoes.appendChild(btn);

    const btnEditar = document.createElement("button");
    btnEditar.innerHTML = '<i class="fas fa-edit"></i> Editar';
    btnEditar.className = "btn-editar-linha";
    cellOpcoes.appendChild(btnEditar);

    salvarDadosLocal();
    apagar();
    contadorOperacao++;
    atualizarTotalTabela();
  } else {
    alert("Insira um valor válido!");
  }
}

function apagar() {
  document.getElementById("operacao").value = "Operação " + contadorOperacao;
  setarDataAtual();
  document.getElementById("num-doc").value = "";
  document.getElementById("pagamento").value = "Dinheiro";
  document.getElementById("valor").value = "";
}

function filtrarTabela() {
  const input = document.getElementById("filtroTabela");
  const filtro = input.value.toLowerCase();
  const tabela = document.getElementById("tabelaRegistos").getElementsByTagName("tbody")[0];
  const linhas = tabela.getElementsByTagName("tr");
  for (let i = 0; i < linhas.length; i++) {
    let mostrar = false;
    const celulas = linhas[i].getElementsByTagName("td");
    for (let j = 0; j < celulas.length - 1; j++) {
      if (celulas[j].textContent.toLowerCase().indexOf(filtro) > -1) {
        mostrar = true;
        break;
      }
    }
    linhas[i].style.display = mostrar ? "" : "none";
  }
}

function atualizarTotalTabela() {
  const tabela = document.getElementById("tabelaRegistos");
  const linhas = tabela.querySelectorAll("tbody tr");
  let total = 0;

  linhas.forEach((linha) => {
    if (linha.style.display !== "none") {
      const valorTexto = linha.cells[4].textContent.replace("€", "").trim();
      const valor = parseFloat(valorTexto.replace(",", "."));
      if (!isNaN(valor)) {
        total += valor;
      }
    }
  });

  document.getElementById("totalTabela").textContent =
    "Total: " + total.toFixed(2) + " €";
  document.getElementById("total").textContent = total.toFixed(2) + " €";
}

function salvarDadosLocal() {
  const tabela = document.getElementById("tabelaRegistos").querySelector("tbody");
  const linhas = tabela.querySelectorAll("tr");
  const dados = [];

  linhas.forEach(linha => {
    const celulas = linha.querySelectorAll("td");
    if (celulas.length >= 5) {
      dados.push({
        operacao: celulas[0].textContent,
        data: celulas[1].textContent,
        numDoc: celulas[2].textContent,
        pagamento: celulas[3].textContent,
        valor: celulas[4].textContent.replace(" €", "")
      });
    }
  });

  localStorage.setItem("caixaPiscinaDados", JSON.stringify(dados));
  localStorage.setItem("contadorOperacao", contadorOperacao.toString());
}

function carregarDadosLocal() {
  const dados = JSON.parse(localStorage.getItem("caixaPiscinaDados"));
  const contadorSalvo = parseInt(localStorage.getItem("contadorOperacao"));

  if (dados && Array.isArray(dados)) {
    dados.forEach(reg => {
      const tabela = document.getElementById("tabelaRegistos").querySelector("tbody");
      const novaLinha = tabela.insertRow();
      novaLinha.insertCell(0).textContent = reg.operacao;
      novaLinha.insertCell(1).textContent = reg.data;
      novaLinha.insertCell(2).textContent = reg.numDoc;
      novaLinha.insertCell(3).textContent = reg.pagamento;
      novaLinha.insertCell(4).textContent = parseFloat(reg.valor).toFixed(2) + " €";

      const cellOpcoes = novaLinha.insertCell(5);
      cellOpcoes.classList.add("col-opcoes");

      const btnApagar = document.createElement("button");
      btnApagar.innerHTML = '<i class="fas fa-trash"></i> Apagar';
      btnApagar.className = "btn-apagar-linha";
      btnApagar.onclick = function () {
        novaLinha.remove();
        salvarDadosLocal();
        atualizarTotalTabela();
      };
      cellOpcoes.appendChild(btnApagar);

      const btnEditar = document.createElement("button");
      btnEditar.innerHTML = '<i class="fas fa-edit"></i> Editar';
      btnEditar.className = "btn-editar-linha";
      cellOpcoes.appendChild(btnEditar);
    });
  }

  if (!isNaN(contadorSalvo)) {
    contadorOperacao = contadorSalvo;
  }

  atualizarTotalTabela();
}

function validarFormulario() {
  const campos = {
    data: document.getElementById("data"),
    numDoc: document.getElementById("num-doc"),
    pagamento: document.getElementById("pagamento"),
    valor: document.getElementById("valor"),
  };

  let valido = true;

  Object.values(campos).forEach((campo) => {
    if (!campo.value.trim()) {
      campo.classList.add("campo-invalido");
      valido = false;
    } else {
      campo.classList.remove("campo-invalido");
    }
  });

  document.getElementById("btnRegistar").disabled = !valido;
}

window.addEventListener("DOMContentLoaded", () => {
  ["data", "num-doc", "pagamento", "valor"].forEach((id) => {
    document.getElementById(id).addEventListener("input", validarFormulario);
  });
  carregarDadosLocal();
  setarDataAtual();
  validarFormulario();
});

function exportarRelatorio() {
  const tabela = document.getElementById("tabelaRegistos");
  let csv = "";
  let total = 0;
  const linhas = tabela.querySelectorAll("tr");

  linhas.forEach((linha, idx) => {
    if (linha.style.display !== "none") {
      const celulas = linha.querySelectorAll("th, td");
      let linhaCSV = [];
      celulas.forEach((celula, index) => {
        if (index === 5) return; // Ignora a coluna Opções
        let texto = celula.textContent.replace(/\n/g, "").trim();
        linhaCSV.push(texto);
        if (idx > 0 && index === 4) {
          let valor = parseFloat(texto.replace("€", "").replace(",", "."));
          if (!isNaN(valor)) total += valor;
        }
      });
      csv += linhaCSV.join(";") + "\n";
    }
  });

  csv += "\n------------------------------";
  csv += "\nTotal;;;;" + total.toFixed(2) + " €";

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `relatorio_caixa_${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
};

function exportarPDF() {
  const doc = new jspdf.jsPDF();
  const data = [];
  let total = 0;

  const linhas = document.querySelectorAll("#tabelaRegistos tbody tr");

  linhas.forEach(linha => {
    if (linha.style.display !== "none") {
      const tds = linha.querySelectorAll("td");
      const row = [];
      for (let i = 0; i < 5; i++) {
        let texto = tds[i].textContent.trim().replace(" €", "");
        if (i === 4) {
          const num = parseFloat(texto.replace(",", "."));
          if (!isNaN(num)) total += num;
          row.push(num.toFixed(2) + " €");
        } else {
          row.push(texto);
        }
      }
      data.push(row);
    }
  });

  doc.text("Relatório de Caixa", 14, 15);
  doc.autoTable({
    head: [["Operação", "Data", "Nº Documento", "Pagamento", "Valor"]],
    body: data,
    startY: 20
  });

  doc.text(`Total: ${total.toFixed(2)} €`, 14, doc.autoTable.previous.finalY + 10);

  doc.save(`relatorio_caixa_${new Date().toISOString().split("T")[0]}.pdf`);
};

