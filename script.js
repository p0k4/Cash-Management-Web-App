
let contadorOperacao = 1;

function setarDataAtual() {
  const dataInput = document.getElementById("data");
  const hoje = new Date().toISOString().split('T')[0];
  dataInput.value = hoje;
}

function registar() {
  const valor = parseFloat(document.getElementById('valor').value);
  if (!isNaN(valor)) {
    const operacao = "Operação " + contadorOperacao;
    const data = document.getElementById('data').value;
    const numDoc = document.getElementById('num-doc').value;
    const pagamento = document.getElementById('pagamento').value;

    const tabela = document.getElementById('tabelaRegistos').querySelector('tbody');
    const novaLinha = tabela.insertRow();
    novaLinha.insertCell(0).textContent = operacao;
    novaLinha.insertCell(1).textContent = data;
    novaLinha.insertCell(2).textContent = numDoc;
    novaLinha.insertCell(3).textContent = pagamento;
    novaLinha.insertCell(4).textContent = valor.toFixed(2) + ' €';

    const cellOpcoes = novaLinha.insertCell(5);
    const btn = document.createElement('button');
    btn.innerHTML = '<i class="fas fa-trash"></i> Apagar';
    btn.className = "btn-apagar-linha";
    btn.onclick = function() {
      novaLinha.remove();
      contadorOperacao++;
    atualizarTotalTabela();
    };
    cellOpcoes.appendChild(btn);

    apagar();
    contadorOperacao++;
    atualizarTotalTabela();
  } else {
    alert("Insira um valor válido!");
  }
}

function apagar() {
  document.getElementById('operacao').value = 'Operação ' + contadorOperacao;
  setarDataAtual();
  document.getElementById('num-doc').value = '';
  document.getElementById('pagamento').value = 'Dinheiro';
  document.getElementById('valor').value = '';
}

function filtrarTabela() {
  const input = document.getElementById("filtroTabela");
  const filtro = input.value.toLowerCase();
  const tabela = document.getElementById("tabelaRegistos");
  const linhas = tabela.getElementsByTagName("tr");

  for (let i = 1; i < linhas.length; i++) {
    const celulas = linhas[i].getElementsByTagName("td");
    let corresponde = false;

    for (let j = 0; j < celulas.length; j++) {
      const texto = celulas[j].textContent || celulas[j].innerText;
      if (texto.toLowerCase().indexOf(filtro) > -1) {
        corresponde = true;
        break;
      }
    }

    linhas[i].style.display = corresponde ? "" : "none";
  }
  contadorOperacao++;
    atualizarTotalTabela();
}

function atualizarTotalTabela() {
  const tabela = document.getElementById("tabelaRegistos");
  const linhas = tabela.querySelectorAll("tbody tr");
  let total = 0;

  linhas.forEach(linha => {
    if (linha.style.display !== "none") {
      const valorTexto = linha.cells[4].textContent.replace('€', '').trim();
      const valor = parseFloat(valorTexto.replace(',', '.'));
      if (!isNaN(valor)) {
        total += valor;
      }
    }
  });

  document.getElementById("totalTabela").textContent = "Total: " + total.toFixed(2) + " €";
  document.getElementById("total").textContent = total.toFixed(2) + " €";
}


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
        if (index === 5) return;  // Ignora a coluna de Opções
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

  const blobFinal = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const urlFinal = URL.createObjectURL(blobFinal);
  const link = document.createElement("a");
  link.setAttribute("href", urlFinal);
  link.setAttribute("download", "relatorio_caixa.csv");
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}



function validarFormulario() {
  const campos = {
    data: document.getElementById('data'),
    numDoc: document.getElementById('num-doc'),
    pagamento: document.getElementById('pagamento'),
    valor: document.getElementById('valor')
  };

  let valido = true;

  Object.values(campos).forEach(campo => {
    if (!campo.value.trim()) {
      campo.classList.add('campo-invalido');
      valido = false;
    } else {
      campo.classList.remove('campo-invalido');
    }
  });

  document.getElementById('btnRegistar').disabled = !valido;
}

// Adicionar escutadores aos campos
['data', 'num-doc', 'pagamento', 'valor'].forEach(id => {
  document.getElementById(id).addEventListener('input', validarFormulario);
});
