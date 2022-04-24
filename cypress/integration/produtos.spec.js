///<reference types="cypress"/>

describe('Testes da Funcionalidade Produtos', ()=>{

    let token
    before(()=>{
        cy.token('fulano@qa.com', 'teste').then(tkn =>{ token = tkn})

    });

    it('Listar Produtos', ()=>{

        cy.request({
            method: 'GET',
            url: 'produtos'

        }).then((response)=>{
            expect(response.body.produtos[1].nome).to.equal('Samsung 60 polegadas')
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('produtos')
            expect(response.duration).to.be.lessThan(50)
        })


    });

    
    it('Cadastrar produto',()=>{
        let produto = `Produto EBAC ${Math.floor(Math.random()*100000000)}`
        cy.request({
           
            method:'POST',
            url: 'produtos',
            body:{
                "nome": produto,
                "preco": 200,
                "descricao": "Produto novo",
                "quantidade": 100
              },
              headers: {authorization:token}
              

        }).then((response) =>{
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal('Cadastro realizado com sucesso')
        })

    })


    it.only('Deve validar mensagem de erro ao cadastrar produto repitido', ()=>{

        cy.request({
           
            method:'POST',
            url: 'produtos',
            headers: {authorization:token},
            body:{
                "nome": 'Produto EBAC Novo 1',
                "preco": 200,
                "descricao": "Produto novo",
                "quantidade": 100
              },
              failOnStatusCode: false
              
              

        }).then((response) =>{
            expect(response.status).to.equal(400)
            expect(response.body.message).to.equal('Já existe produto com esse nome')
        })
    })
});

