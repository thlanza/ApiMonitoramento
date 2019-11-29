const axios = require('axios');
const uri = "http://rhresponde.mg.gov.br/api/getchamados";

const uri2 = "http://homologacao.planejamento.mg.gov.br/api/endpoint";

const Token = require('./Auth/tokenGenerator')

const jwt = new Token().token;
const path = require("path");
const hbs = require('hbs');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

//Uso da Api:
// localhost:3007/?mes=11&ano=2019    analisa os chamados do mês 11 de 2019

app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('views', './views')

app.use('/assets',express.static(__dirname + '/views'));

app.get('/', function(req, res){

let mes = req.query.mes;
let ano = req.query.ano;


axios.all([axios.get(uri, {
    params: {
        // mes: process.argv[2],
        mes: `${mes? mes : 11}`,
        ano: `${ano? ano : 2019}`
    },
    headers: {
        Cookie: "Service=" + jwt
    },
    proxy: {
        host: '200.198.51.238',
        port: 8080
    }
}),
axios.get(uri2, {
    params: {
        // mesInicio: `${process.argv[2]}/2019`,
        // mesFinal: `${process.argv[2]}/2019`
        mesInicio: `${mes? `${mes}/2019` : '11/2019'}`,
        mesFinal: `${mes? `${mes}/2019` : '11/2019'}`,
    },
    headers: {
        Cookie: "Service=" + jwt
    },
    proxy: {
        host: '200.198.51.238',
        port: 8080
    }
})
]).then(axios.spread(function (api1, api2){

    const dadosDaApi1 = api1.data;
    const dadosDaApi2 = api2.data;   
    const stringify2 = JSON.stringify(dadosDaApi2);
    const dadosDaApi1Parseado = JSON.parse(dadosDaApi1);
    const dadosDaApi2Parseado = JSON.parse(stringify2);
    const tamanho1 = dadosDaApi1Parseado.length;
    const tamanho2 = dadosDaApi2Parseado.length;

    console.log("número de chamados na api1: ", tamanho1);
    console.log("número de chamados na api2: ", tamanho2);

    Array.prototype.diff = function(a) {
        return this.filter(function(i) {
            return a.indexOf(i) < 0;})
        };
 

   function compareKeys(a, b){
    let arrayDados1 = [];   
    let arrayDados2 = []; 
    let arrayDatas = [];
    a.forEach(pushToArray);
    function pushToArray(element) {
        let property = "Id";
        let data = "HoraEnviada"
        if(element[`${property}`] === null) return;
        arrayDados1.push(parseInt(element[`${property}`]));
        let IdDate = { "Id": element[`${property}`], "HoraEnviada": element[`${data}`] }
        arrayDatas.push(IdDate);
    }
 
    b.forEach(pushToSecondArray)
    function pushToSecondArray(element){
        let property = "idChat"
        if(element[`${property}`] === null) return;
        arrayDados2.push(parseInt(element[`${property}`]));  
    }
    Array.prototype.diff = function(a) {
        return this.filter(function(i) {return a.indexOf(i) < 0;});
    };
    var diffArrays1 = arrayDados1.diff(arrayDados2);
    let arrayFinal = [];
    arrayDatas.forEach(createObject)
    function createObject(element) {
        let Id = "Id"
        let HoraEnviada = "HoraEnviada"
        if (diffArrays1.includes(element[`${Id}`]) === true) {
             arrayFinal.push({"Id": element[`${Id}`], "HoraEnviada": element[`${HoraEnviada}`]})
        }
    }
    return arrayFinal;

   }
   
   
   var arrayFinal = compareKeys(dadosDaApi1Parseado, dadosDaApi2Parseado);
    

    let comparacao = dadosDaApi1Parseado.length === dadosDaApi2Parseado.length && dadosDaApi1Parseado.sort().every(function(value, index) { return value === dadosDaApi2Parseado.sort()[index]});



    if(comparacao === true) {
        console.log("Os resultados das duas Api's são iguais no período selecionado.");  
    } else {
        console.log("Os resultados das duas Api's não são iguais no período selecionado.")
    }
  
    let tamanhoDiferenca = arrayFinal.length

    arraysId = [];
    arraysHoraEnviada = [];
    arrayFinal.forEach(funcId);
    function funcId(element) {
     let Id = "Id";
      arraysId.push(parseInt(element[`${Id}`]))
    }
    arrayFinal.forEach(funcHora);
    function funcHora(element) {
        let HoraEnviada = "HoraEnviada";
        if (element[`${HoraEnviada}`] === null) {
            element[`${HoraEnviada}`] = ''
        }

        let string = "'";
        stringMaior = string + element[`${HoraEnviada}`] + string;
        arraysHoraEnviada.push(stringMaior);
    }
    console.log(arraysHoraEnviada);

    
    console.log("tamanho", tamanhoDiferenca);
    res.render('index', {mes: mes, ano: ano, arrayFinal: arrayFinal, arraysHoraEnviada: arraysHoraEnviada, arraysId: arraysId, tamanho1: tamanho1, tamanho2: tamanho2, tamanhoDiferenca: tamanhoDiferenca})
 
})).catch((error) => {
    console.log("Erro => ", error)
})




});


app.listen(3007, function() {
    console.log("Rodando")
});





