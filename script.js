const slider = document.getElementById("slider");
const toneladas = document.getElementById("toneladas");
const biogas = document.getElementById("biogas");
const energia = document.getElementById("energia");
const economia = document.getElementById("economia");
const bioGasKpi = document.getElementById("bioGasKpi");
const energiaKpi = document.getElementById("energiaKpi");
const economiaKpi = document.getElementById("economiaKpi");
const co2Kpi = document.getElementById("co2Kpi");

function formatar(numero){return numero.toLocaleString("pt-BR");}
function irPara(id){document.getElementById(id).scrollIntoView({behavior:"smooth"});}

function atualizarSimulador(){
  const t = Number(slider.value);
  const gas = t * 60;
  const kwh = gas * 2;
  const valor = gas * 1.5;
  const co2 = t * 0.08;
  toneladas.textContent = t;
  biogas.textContent = formatar(gas) + " m³";
  energia.textContent = formatar(kwh) + " kWh";
  economia.textContent = "R$ " + formatar(Math.round(valor));
  bioGasKpi.textContent = formatar(gas) + " m³";
  energiaKpi.textContent = formatar(kwh) + " kWh";
  economiaKpi.textContent = "R$ " + formatar(Math.round(valor));
  co2Kpi.textContent = co2.toFixed(1).replace(".", ",") + " t";
}
slider.addEventListener("input", atualizarSimulador);
atualizarSimulador();

const elementos = document.querySelectorAll(".reveal");
function revelarAoRolar(){
  elementos.forEach(el => {
    const topo = el.getBoundingClientRect().top;
    if(topo < window.innerHeight - 80) el.classList.add("active");
  });
}
window.addEventListener("scroll", revelarAoRolar);
revelarAoRolar();

function atualizarSensores(){
  const temp = 35 + Math.random() * 4.5;
  const ph = 6.6 + Math.random() * 1.2;
  const pressao = 1.45 + Math.random() * 0.95;
  const nivel = 60 + Math.random() * 33;
  document.getElementById("temp").textContent = temp.toFixed(1);
  document.getElementById("ph").textContent = ph.toFixed(1);
  document.getElementById("pressao").textContent = pressao.toFixed(2);
  document.getElementById("nivel").textContent = Math.round(nivel);

  const lista = document.getElementById("listaAlertas");
  const status = document.getElementById("statusSistema");
  const luz = document.getElementById("statusLight");
  const alertas = [];
  if(temp > 38) alertas.push(["warn","Temperatura acima da faixa ideal. Verificar controle térmico."]);
  if(ph < 6.8 || ph > 7.6) alertas.push(["warn","pH fora da faixa ideal. Recomenda-se ajuste do processo."]);
  if(pressao > 2.15) alertas.push(["danger","Pressão elevada no sistema de gás. Verificar válvulas e segurança."]);
  if(nivel > 88) alertas.push(["warn","Nível do tanque próximo da capacidade máxima."]);

  lista.innerHTML = "";
  if(alertas.length === 0){
    lista.innerHTML = "<li class='ok'>Sistema operando dentro dos parâmetros ideais.</li>";
    status.textContent = "Operação Normal";
    luz.style.background = "#22c55e";
    luz.style.boxShadow = "0 0 22px #22c55e";
  }else{
    alertas.forEach(a => {
      const li = document.createElement("li");
      li.className = a[0];
      li.textContent = a[1];
      lista.appendChild(li);
    });
    const critico = alertas.some(a => a[0] === "danger");
    status.textContent = critico ? "Atenção Crítica" : "Atenção Operacional";
    luz.style.background = critico ? "#ef4444" : "#facc15";
    luz.style.boxShadow = critico ? "0 0 22px #ef4444" : "0 0 22px #facc15";
  }
  atualizarIA(temp, ph, pressao);
}

function atualizarIA(temp, ph, pressao){
  const previsao = 8800 + Math.random() * 950;
  document.getElementById("previsaoIA").textContent =
    "Produção estimada: " + formatar(Math.round(previsao)) + " m³ de biogás.";

  let recomendacao = "Manter temperatura próxima de 37 °C para maior estabilidade.";
  if(temp > 38) recomendacao = "Reduzir a temperatura para evitar queda de eficiência microbiológica.";
  if(ph < 6.8 || ph > 7.6) recomendacao = "Corrigir o pH para manter a biodigestão estável.";
  if(pressao > 2.15) recomendacao = "Verificar válvulas e linha de gás por aumento de pressão.";

  document.getElementById("recomendacaoIA").textContent = recomendacao;
  document.getElementById("manutencaoIA").textContent =
    pressao > 2.15 || temp > 38.5 ? "Risco moderado detectado. Recomenda-se inspeção preventiva." : "Sem risco de falha identificado no momento.";
}
setInterval(atualizarSensores, 2500);
atualizarSensores();

new Chart(document.getElementById("graficoBiogas"), {
  type: "line",
  data: {
    labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
    datasets: [{label: "Produção de Biogás (m³)", data: [7800, 8200, 8500, 8700, 9100, 8900, 9200], tension: 0.35}]
  }
});
new Chart(document.getElementById("graficoESG"), {
  type: "bar",
  data: {
    labels: ["Resíduo", "Energia", "CO₂", "Economia"],
    datasets: [{label: "Indicadores ESG normalizados", data: [88, 82, 74, 79]}]
  }
});
