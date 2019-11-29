const jwt = require('jsonwebtoken');
const Secret = "vXZsEWMm6NrUpfD8JdsCxynawRMpnnay12DGfxWgSLmUgxZpHeg3yD3FqQMQSwJUKR2FUAC5Vqy13r5YpJDPSfNKdYeabGepBcEnmACUXf4EuQcH8C7JYdHbvCnLw3g";

class Token {

    constructor() {

        const config = {
            expiresIn: 60 * 60,
            audience: "rhresponde.mg.gov.br",
            issuer: "RHChat",
        }
        
        this.token = jwt.sign({}, Secret, config);
    }
}

module.exports = Token;