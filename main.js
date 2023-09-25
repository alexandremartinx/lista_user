document.addEventListener('DOMContentLoaded', function () {
    const userTable = document.getElementById('userTable');
    const createUserButton = document.getElementById('createUser');

    // Função para listar os usuários
    function listUsers() {
        fetch('https://api-login-painel-comentarios.nappsolutions.io/get_all')
            .then(response => response.json())
            .then(data => {
                // Limpa a tabela de usuários existente
                userTable.innerHTML = '';

                for (const username in data) {
                    const password = data[username];
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${username}</td>
                        <td>${password}</td>
                        <td>
                            <button class="edit-button" data-username="${username}">Editar</button>
                            <button class="delete-button" data-username="${username}">Excluir</button>
                        </td>
                    `;
                    userTable.appendChild(row);
                }
            })
            .catch(error => console.error('Erro ao buscar usuários:', error));
    }

    // Event listener para listar os usuários quando a página carrega
    listUsers();

    // Event listener para o botão de criação de usuário
    createUserButton.addEventListener('click', () => {
        // Implemente aqui a lógica para criar um novo usuário
    });

    // Event listener para os botões de edição e exclusão
    userTable.addEventListener('click', (event) => {
        if (event.target.classList.contains('edit-button')) {
            const username = event.target.getAttribute('data-username');
            const newPassword = prompt(`Nova senha para ${username}:`);

            if (newPassword !== null) {
                // Enviar solicitação para a rota de edição com o novo password
                fetch(`https://api-login-painel-comentarios.nappsolutions.io/edit/${username}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ new_password: newPassword }),
                })
                    .then(response => response.json())
                    .then(data => {
                        alert(data.message);
                        // Atualizar a lista de usuários após a edição
                        listUsers();
                    })
                    .catch(error => console.error('Erro ao editar usuário:', error));
            }
        } else if (event.target.classList.contains('delete-button')) {
            const username = event.target.getAttribute('data-username');
            const confirmDelete = confirm(`Você deseja excluir o usuário ${username}?`);

            if (confirmDelete) {
                // Enviar solicitação para a rota de exclusão
                fetch(`https://api-login-painel-comentarios.nappsolutions.io/delete/${username}`, {
                    method: 'DELETE',
                })
                    .then(response => response.json())
                    .then(data => {
                        alert(data.message);
                        // Atualizar a lista de usuários após a exclusão
                        listUsers();
                    })
                    .catch(error => console.error('Erro ao excluir usuário:', error));
            }
        }
    });
});