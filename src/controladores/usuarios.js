const knex = require('../conexao');
const bcrypt = require('bcrypt');

const cadastrarUsuario = async (req, res) => {
  const { nome, email, senha, nome_loja } = req.body;

  if (!nome || !email || !senha || !nome_loja) {
      return res.status(400).json("Todos os campos são obrigatórios.");
  }

  try {
      const { rowCount: quantidadeUsuarios } = await knex('usuarios').where('email', email);

      if (quantidadeUsuarios > 0) {
          return res.status(409).json("O email já está em uso.");
      }
      
      const senhaCriptografada = await bcrypt.hash(senha, 10);

      const [usuario] = await knex('usuarios').insert({ nome, email, senha: senhaCriptografada, nome_loja }).returning('*');

      if (!usuario) {
          return res.status(400).json("Falha ao cadastrar o usuário.");
      }
      
      return res.status(200).json("Usuário cadastrado com sucesso!");
  } catch (error) {
      return res.status(500).json("Erro interno do servidor");
  }
}


const obterPerfil = async (req, res) => {
    return res.status(200).json(req.usuario);
}

const atualizarPerfil = async (req, res) => {
    const { nome, email, senha, nome_loja } = req.body;
  
    if (!nome && !email && !senha && !nome_loja) {
      return res.status(400).json('É obrigatório informar ao menos um campo para atualização');
    }
  
    try {
      const body = {};
      const params = [];
      let n = 1;
  
      if (nome) {
        body.nome = nome;
        params.push(`nome = $${n}`);
        n++;
      }
  
      if (email) {
        if (email !== req.usuario.email) {
          const { rowCount: quantidadeUsuarios } = await knex('usuarios').where('email', email);
  
          if (quantidadeUsuarios > 0) {
            return res.status(400).json('O email já existe');
          }
        }
  
        body.email = email;
        params.push(`email = $${n}`);
        n++;
      }
  
      if (senha) {
        body.senha = await bcrypt.hash(senha, 10);
        params.push(`senha = $${n}`);
        n++;
      }
  
      if (nome_loja) {
        body.nome_loja = nome_loja;
        params.push(`nome_loja = $${n}`);
        n++;
      }
  
      const valores = Object.values(body);
      valores.push(req.usuario.id);
  
      const query = `update usuarios set ${params.join(', ')} where id = $${n}`;
      const usuarioAtualizado = await knex.raw(query, valores);
  
      if (usuarioAtualizado.rowCount === 0) {
        return res.status(400).json('O usuário não foi atualizado');
      }
  
      return res.status(200).json('Usuário foi atualizado com sucesso.');
    } catch (error) {
      return res.status(500).json(error.message);
    }
  };


module.exports = {
    cadastrarUsuario,
    obterPerfil,
    atualizarPerfil
}