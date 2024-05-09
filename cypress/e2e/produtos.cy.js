/// <reference types='cypress' />

import contrato from '../contracts/produtos.contracts.js'

describe('Teste da funcionalidade Produtos', () => {

   let token

   before(() => {
      cy.token('fulano@qa.com.br', 'teste').then(tkn => {
         token = tkn
      })
   })

   it('Deve validar contrato de produtos', () => {
      cy.request('produtos').then( response => {
         return contrato.validateAsync(response.body)
      })
   }); 
   it('Listar produtos', () => { 
      cy.request({
        method: 'GET',
        url: 'produtos'
      })
      .then( response => {
        expect(response.status).to.equal(200)
        expect(response.body).to.have.property('produtos')
        expect(response.duration).to.be.lessThan(200)
    })
   
   });  

   it('Cadastrar produto', () => {
   
      let produto = `Produto Anderson ${Math.floor(Math.random() * 1000000)}`
      
      cy.request({
          method: 'POST',
          url: 'produtos',
          body:
            {
               "nome": produto,
               "preco": 1000,
               "descricao": "Produto novo",
               "quantidade": 500
            },              
          headers: {authorization: token}
        })
        .then((response) =>{
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal('Cadastro realizado com sucesso')
        }) 
        
   });

   it('Deve exibir um erro ao tentar cadastrar um produto repetido', () => {
      cy.cadastrarProduto(token, 'Produto novo 1', 250, 'Descrição do produto novo', 500)
       .then((response) =>{
           expect(response.status).to.equal(400)
           expect(response.body.message).to.equal('Já existe produto com esse nome')
           
       }) 
   });

   it('Deve editar um produto ja cadastrado', () => {
      cy.request('produtos').then(response => {
         let produto = `Produto Anderson ${Math.floor(Math.random() * 1000000)}`
         let id = response.body.produtos[0]._id

         cy.log(response.body.produtos[0]._id)
         cy.request({
            method: 'PUT',
            url: `produtos/${id}`,
            headers: {authorization: token},
            body:
            {
               "nome": produto,
               "preco": 100,
               "descricao": "Produto novo",
               "quantidade": 500
             }
         })
         .then( response =>{
            expect(response.status).to.equal(200)
            expect(response.body.message).to.equal('Registro alterado com sucesso')
         })
      })
   })

   it('Deve editar um produto cadastrado previamente', () => {
      let produto = `Produto Anderson ${Math.floor(Math.random() * 1000000)}`
      cy.cadastrarProduto(token, produto, 1000, 'Produto novo', 500)
      .then(response =>{
         let id = response.body._id

         cy.request({
            method: 'PUT',
            url: `produtos/${id}`,
            headers: {authorization: token}, 
            body:
            {
               "nome": produto,
               "preco": 500,
               "descricao": "Mouse",
               "quantidade": 1000
             }
         })
         .then ( response =>{
            expect(response.status).to.equal(200)
            expect(response.body.message).to.equal('Registro alterado com sucesso')
         })
      })
   })

   it('Deve deletar um produto previamente cadastrado', () => {
      let produto = `Produto Anderson ${Math.floor(Math.random() * 1000000)}`
      cy.cadastrarProduto(token, produto, 250, 'Produto Novo', 500)
      .then(response => {
         let id = response.body._id
         cy.request({
            method: 'DELETE',
            url: `produtos/${id}`,
            headers: {authorization: token},
         }).then(response => {
            expect(response.body.message).to.equal('Registro excluído com sucesso')
            expect(response.status).to.equal(200)
         })
      })
   });  
})