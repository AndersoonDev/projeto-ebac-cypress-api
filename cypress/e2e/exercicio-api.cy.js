/// <reference types="cypress" />


import produtosSchema from "../contracts/produtos.contracts";

describe('Testes da Funcionalidade Usuários', () => {

  it('Deve validar contrato de usuários', () => {
    cy.request('produtos').then( response => {
      return produtosSchema.validateAsync(response.body)
    })
  });

  it('Deve listar usuários cadastrados', () => {
    cy.request({
      method: 'GET',
      url: 'usuarios'
    }).then(response =>{
      expect(response.status).to.equal(200)
    })
  });

  // it('Deve cadastrar um usuário Anderson com sucesso', () => {
  //   // let nome = `Usuario ${Math.random().toString(20).substring(10)}`
  //   // let email = `email-${Math.random().toString(20).substring(10)}@qa.com`
  //   cy.request({
  //     method: 'POST',
  //     url: 'usuarios',
  //     body: {
  //       "nome": 'Anderson Silva',
  //       "email": 'teste@qa.com',
  //       "password": "teste",
  //       "administrador": "true"  
  //     }
  //     }).then(response => {
  //       expect(response.status).to.equal(201)
  //       expect(response.body.message).to.equal('Cadastro realizado com sucesso')
  //     })
  // }); 

  it('Deve cadastrar um usuário com sucesso', () => {
    let nome = `Usuario ${Math.random().toString(20).substring(10)}`
    let email = `email-${Math.random().toString(20).substring(10)}@qa.com`
    cy.request({
      method: 'POST',
      url: 'usuarios',
      body: {
        "nome": nome,
        "email": email,
        "password": "teste",
        "administrador": "true"  
      }
      }).then(response => {
        expect(response.status).to.equal(201)
        expect(response.body.message).to.equal('Cadastro realizado com sucesso')
      })
  });   

  it('Deve validar um usuário com email inválido', () => {
    let nome = `Usuario ${Math.random().toString(20).substring(10)}`
    
    cy.request({
      method: 'POST',
      url: 'usuarios',
      failOnStatusCode: false,
      body: {
        "nome": nome,
        "email": 'fulano@qa.com',
        "password": "teste",
        "administrador": "true"  
      }
      }).then(response => {
        expect(response.status).to.equal(400)
        expect(response.body.message).to.equal('Este email já está sendo usado')
      })
  });

  it('Deve editar um usuário previamente cadastrado', () => {

    let nome = `Fulano da Silva ${Math.random().toString(20).substring(10)}`
    let email = `email-${Math.random().toString(20).substring(10)}@qa.com`

    cy.request('usuarios').then(response =>{
      let id = response.body.usuarios[0]._id

      cy.request({
        method: 'PUT',
        url: `usuarios/${id}`,
        body: {
          "nome": nome,
          "email": email,
          "password": "teste",
          "administrador": "true"  
        }
      }).then(response => {
        expect(response.status).to.equal(200)
        expect(response.body.message).to.equal('Registro alterado com sucesso')
        
      })
    })
  });

  it('Deve deletar um usuário previamente cadastrado', () => {
    let nome = `Usuario ${Math.random().toString(20).substring(10)}`
    let email = `email-${Math.random().toString(20).substring(10)}@qa.com`

    cy.cadastrarUsuarios(nome, email, 'teste', 'true')
    .then(response =>{
      let id = response.body._id
      cy.request({
        method: 'DELETE',
        url: `usuarios/${id}`,
        failOnStatusCode: false
      }).then(response =>{
        expect(response.status).to.equal(200)
        expect(response.body.message).to.equal('Registro excluído com sucesso')
      })
    })
  })
});



