if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            let reg;
            reg = await navigator.serviceWorker.register('/sw.js', { type: "module" });

            console.log('Service worker registrada! 😎', reg);
        } catch (err) {
            console.log('😥 Service worker registro falhou: ', err);
        }
    });
}

let posicaoInicial;//variavel para capturar a posicao
const capturarLocalizacao = document.getElementById('localizacao');
const latitude = document.getElementById('latitude');
const longitude = document.getElementById('longitude');
const mapa = document.getElementById('gmap_canvas');

const sucesso = (posicao) => {//callback de sucesso para captura da posicao
    posicaoInicial = posicao;
    latitude.innerHTML = posicaoInicial.coords.latitude;
    longitude.innerHTML = posicaoInicial.coords.longitude;
    mapa.src = "https://maps.google.com/maps?q=" + posicaoInicial.coords.latitude; + "," + posicaoInicial.coords.longitude; + "2880%20Broadway,%20New%20York&t=&z=13&ie=UTF8&iwloc=&output=embed" ;
};

const erro = (error) => {//callback de error (falha para captura de localizacao)
    let errorMessage;
    switch (error.code) {
        case 0:
            errorMessage = "Erro desconhecido"
            break;
        case 1:
            errorMessage = "Permissão negada!"
            break;
        case 2:
            errorMessage = "Captura de posição indisponível!"
            break;
        case 3:
            errorMessage = "Tempo de solicitação excedido!"
            break;
    }
    console.log('Ocorreu um erro: ' + errorMessage);
};

capturarLocalizacao.addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition(sucesso, erro);
});