const axios = require('axios');
const uri = "rhresponde.mg.gov.br/api/getchamadosbydate";
const uri2 = "preencher.com.br/api";

class ApiMonitoramento {
    constructor() {
        this.api = {};
        this.api.send = async (endpoint, data, method) => {
            const request = {
                method: method,
                url: endpoint,
                data: data,
                headers: {
                    Cookie: "Service=" + this.jwt
                },
                proxy: {
                    host: '200.198.51.238',
                    port: 8080
                }
            }
            return await axios.request(
                request
            ).catch(error => {
                console.log(request);
                return error;
            });
        }
    }

    async getApi1() {
        return await this.api.send(uri, null, 'get'); 
    }

 
    async getApi2() {
        return await this.api.send(uri2, null, 'get'); 
    }



    
}

module.exports = ApiMonitoramento;