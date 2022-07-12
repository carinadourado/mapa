
let url = "https://raw.githubusercontent.com/carinadourado/mapa/main/result.geojson"

fetch (url)
  .then(resposta => resposta.json())
  .then(dados => mostrar (dados))

function mostrar(dados){
  console.log(dados)


//lista com os valores da qde do geojson 
const valores_qde = dados.features.map(d => d.properties.qde); 
// calcula a qde mínima (para usar nas bolhas no mapa)
const min_qde = Math.min(...valores_qde); 
// calcula a qde máxima (para usar nas bolhas no mapa)
const max_qde = Math.max(...valores_qde);  

//token de acesso ao mapa no mapbox
mapboxgl.accessToken = 'pk.eyJ1IjoiY2FyaW5hZG91cmFkbyIsImEiOiJjbDR6b3hxYjEzYWZiM2JxY2RqNGNwMnJuIn0.Hceotfxx7AomJceWsde1JA';

//função do mapbox que chama o mapa e definie ponto central e zoom
let map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/carinadourado/cl4xg6nwv004p15q9kqmzbziw',
  center: [-23.4, 8.8], 
  zoom: 2,
  pitch: 0,
 });

//desabilita o scroll zoom do mapa
// map.scrollZoom.disable();

//insere as bolhas no mapa
map.on('load', () => {
  map.addSource('src-bolhas', {
    'type': 'geojson',
    'data': dados,
  });
  
  map.addLayer({
    'id': 'bolhas',
    'type': 'circle',
    'source': 'src-bolhas',
    'paint': { 
      'circle-color': 'red',
      'circle-opacity': 0.3,
      'circle-radius': [
        
        'let', // declara uma variável da expressão
        'raiz_quadrada_qde',
        ['sqrt', ['get', 'qde']], // que vai ser a raiz quadrada do valor de 'qde', uma propriedade/variável presente nos dados
        
        [
          'interpolate', // declara a interpolação
          ['linear'], // do tipo linear
          ['var', 'raiz_quadrada_qde'], // com base na "variável" 'raiz_quadrada_qde', que declaramos acima
          min_qde, 5, // valor-minimo-dado, valor-minimo-raio
          max_qde, 100 // valor-maximo-dado, valor-maximo-raio
        ]
      ]
     }
  })
})

//Criar função para escutar gatilho chegar no topo da página
function escutaScroll(){


  //Pega a lista de gatilhos
  let gatilhos = document.querySelectorAll('.gatilhos > div');

  //Fazer o loop
  for (let gatilho of gatilhos){
    
    //para cada um deles, pegar a posição atual
    let posicao = gatilho.getBoundingClientRect();

    //para cada um deles pegar o valor da propriedade
    let alvo = gatilho.dataset.alvo;
   
    //verifique se o gatilho está acima do topo da página
    if(posicao.top <= 0 && posicao.top > -posicao.height){
      
      //se sim, torna a opacidade visível
      gatilho.style.opacity = 1
      
      //Se o alvo estiver passando pela classe "passo-1"
      if (alvo == "passo-1"){ 
                map.flyTo({
          center: [-23.4, 8.8], //mapa permanece onde está
          zoom: 2,
          pitch: 0
        })
      }
      
      //Se o alvo estiver passando pela classe "passo-2"
      if(alvo == "passo-2"){
        //faça o mapa viajar até Resende-RJ
        map.flyTo({
          center: [-44.4463494, -22.4683626],
            zoom: 13,
            pitch: 20
        })

      //Se o alvo estiver passando pela classe "passo-3"
      }else if(alvo == "passo-3"){  
        //faça o mapa viajar até São Francisco do Sul-SC
        map.flyTo({
          center: [-48.6308087, -26.2495087], 
          zoom: 13,
          pitch: 20
        })
        
      //Se o alvo estiver passando pela classe "passo-4"
      }else if(alvo == "passo-4"){ 
        //faça o mapa viajar até Abu Dhabi - Emirados Árabes
        map.flyTo({
          center: [54.3774014, 24.4538352],
          zoom: 11,
          pitch: 20
        })
      }else{
        //Volte para a configuração original
        map.flyTo({
          center: [-23.4, 8.8],
          zoom: 2,
          pitch: 0
        })
      }
    }
  }
}


window.addEventListener('scroll', escutaScroll);
}