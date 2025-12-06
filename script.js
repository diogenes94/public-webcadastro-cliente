// IMPORTS DO FIREBASE (via módulo ES6)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    addDoc,
    onSnapshot,
    updateDoc,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

let idEdicao = null;
// -------------------------------------------------------------------
// 🔥 CONFIGURAR FIREBASE AQUI DURANTE A AULA
// -------------------------------------------------------------------
const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// -------------------------------------------------------------------
// 🟦 SALVAR CLIENTE (CREATE)
// -------------------------------------------------------------------
document.getElementById("formCliente").addEventListener("submit", async (e) => {
    e.preventDefault();

    const cliente = {
        nome: document.getElementById("nome").value,
        email: document.getElementById("email").value,
        telefone: document.getElementById("telefone").value
    };

    // 🟦 CADASTRAR
    if (!idEdicao) {
        await addDoc(collection(db, "clientes"), cliente);
        mostrarMensagem("Cliente cadastrado com sucesso!");
    } 
    // 🟧 ATUALIZAR
    else {
        const ref = doc(db, "clientes", idEdicao);
        await updateDoc(ref, cliente);

        // ⚠️ LIMPA O MODO EDIÇÃO ANTES DE RESETAR
        idEdicao = null;

        // Volta label do botão
        document.querySelector("button[type='submit']").textContent = "Salvar Cliente";

        mostrarMensagem("Cliente atualizado com sucesso!", "warning");
    }

    // ⭐ Reset só depois de limpar idEdicao
    e.target.reset();
});



// -------------------------------------------------------------------
// 🟩 LISTAR CLIENTES EM TEMPO REAL (READ)
// -------------------------------------------------------------------
const listaDiv = document.getElementById("listaClientes");

onSnapshot(collection(db, "clientes"), (snapshot) => {
    listaDiv.innerHTML = "";

    snapshot.forEach(doc => {
        const c = doc.data();
        listaDiv.innerHTML += `
            <div class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                    <strong>${c.nome}</strong><br>
                    ${c.email}<br>
                    ${c.telefone}
                </div>
                <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-warning"
                            onclick="editarCliente('${doc.id}', '${c.nome}', '${c.email}', '${c.telefone}')">
                        Editar
                    </button>
                    <button class="btn btn-sm btn-danger"
                            onclick="excluirCliente('${doc.id}')">
                        Excluir
                    </button>
                </div>
            </div>
        `;
    });
});

window.editarCliente = function (id, nome, email, telefone) {
    // Guarda o ID do documento que será editado
    idEdicao = id;

    // Preenche os campos do formulário
    document.getElementById("nome").value = nome;
    document.getElementById("email").value = email;
    document.getElementById("telefone").value = telefone;

    // Muda o texto do botão
    document.querySelector("button[type='submit']").textContent = "Atualizar Cliente";
};

window.excluirCliente = async function (id) {
    if (!confirm("Tem certeza que deseja excluir este cliente?")) {
        return;
    }

    const ref = doc(db, "clientes", id);
    await deleteDoc(ref);

    mostrarMensagem("Cliente excluído com sucesso!", "danger");
};

function mostrarMensagem(texto, tipo = "success") {
    const divMsg = document.getElementById("mensagens");

    divMsg.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
            ${texto}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;

    // Remove automaticamente após 3 segundos
    setTimeout(() => {
        divMsg.innerHTML = "";
    }, 3000);
}


$(document).ready(function(){
    $('#telefone').mask('(00) 00000-0009');
});
