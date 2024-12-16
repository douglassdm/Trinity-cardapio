const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

const paymentModal = document.getElementById("payment-modal");
const moneyOption = document.getElementById("money-option");
const pixOption = document.getElementById("pix-option");
const changeNeededInput = document.getElementById("change-needed");
const cancelPaymentBtn = document.getElementById("cancel-payment-btn");
const confirmPaymentBtn = document.getElementById("confirm-payment-btn");

const copyPixBtn = document.getElementById("copy-pix-btn");
const pixKey = document.getElementById("pix-key");


let cart = [];



// Abrir modal do carrinho
cartBtn.addEventListener("click", function(){
    updateCartModal();
    cartModal.style.display = "flex"
})

// Fechar o modal quando clicar fora
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})

function canConfirmPayment() {
    return moneyOption.checked || pixOption.checked;
}

// Adicione um evento de mudança para as opções de pagamento
moneyOption.addEventListener("change", function () {
    // Verifique se a opção "Dinheiro" está marcada
    if (moneyOption.checked) {
        // Se estiver marcada, mostre a seção do troco
        document.getElementById("money-section").style.display = "block";
    } else {
        // Se estiver desmarcada, oculte a seção do troco
        document.getElementById("money-section").style.display = "none";
    }
});
// Oculte a seção do troco inicialmente
document.getElementById("money-section").style.display = "none";



// Adicione um evento de clique ao botão Cancelar do modal de pagamento
cancelPaymentBtn.addEventListener("click", function () {
    hidePaymentModal();

    // Ao cancelar o pagamento, redefina a seleção da opção "Dinheiro" e oculte a seção do troco
    moneyOption.checked = false;
    pixOption.checked = false;
    document.getElementById("money-section").style.display = "none";
    document.getElementById("pix-section").classList.add("hidden");
});

copyPixBtn.addEventListener("click", function() {
    const textToCopy = pixKey.textContent;

    // Crie um elemento textarea temporário para copiar o texto
    const textarea = document.createElement('textarea');
    textarea.value = textToCopy;
    document.body.appendChild(textarea);

    // Selecione o texto dentro do textarea e copie para a área de transferência
    textarea.select();
    document.execCommand('copy');

    // Remova o textarea do DOM
    document.body.removeChild(textarea);

    // Exiba uma notificação de toast indicando que o texto foi copiado
    Toastify({
        text: "Chave Pix copiada para a área de transferência!",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "#4CAF50",
        },
    }).showToast();
});

// Adicione um evento de clique ao botão Confirmar Pagamento do modal de pagamento
confirmPaymentBtn.addEventListener("click", function () {
    if (!canConfirmPayment()) {
        Toastify({
            text: "Selecione um método de pagamento!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "#EF4444",
            },
        }).showToast();
        return;
    }

    const selectedPaymentOption = moneyOption.checked ? "Dinheiro" : "Pix";
    const changeNeeded = moneyOption.checked ? changeNeededInput.value : null;

    // Enviar as informações para o WhatsApp ou qualquer outra ação necessária
    sendPaymentInfoToWhatsApp(selectedPaymentOption, changeNeeded);

    // Limpar o carrinho e fechar o modal de pagamento
    cart = [];
    updateCartModal();
    hidePaymentModal();
});

// Função para exibir o modal de pagamento
function showPaymentModal() {
    paymentModal.style.display = "flex";
    
    // Desmarcar todas as opções de pagamento ao abrir o modal
    moneyOption.checked = false;
    pixOption.checked = false;
    // Ocultar a seção do troco ao abrir o modal
    document.getElementById("money-section").style.display = "none";
}

// Adicione um evento de mudança para a opção Dinheiro
moneyOption.addEventListener("change", function () {
    const moneySection = document.getElementById("money-section");
    const pixSection = document.getElementById("pix-section");

    // Verifique se a opção "Dinheiro" está marcada
    if (moneyOption.checked) {
        // Se estiver marcada, mostre a seção do Dinheiro e oculte a seção do Pix
        moneySection.style.display = "block";
        pixSection.classList.add("hidden");
    } else {
        // Se estiver desmarcada, oculte a seção do Dinheiro
        moneySection.style.display = "none";
    }
});

// Adicione um evento de mudança para a opção Pix
pixOption.addEventListener("change", function () {
    const moneySection = document.getElementById("money-section");
    const pixSection = document.getElementById("pix-section");
    
    // Verifique se a opção "Pix" está marcada
    if (pixOption.checked) {
        // Se estiver marcada, mostre a seção do Pix e oculte a seção do Dinheiro
        pixSection.classList.remove("hidden");
        moneySection.style.display = "none";
    } else {
        // Se estiver desmarcada, oculte a seção do Pix
        pixSection.classList.add("hidden");
    }
});


// Função para fechar o modal de pagamento
function hidePaymentModal() {
    paymentModal.style.display = "none";
}

//Botão fechar modal
closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})

//
menu.addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-to-cart-btn")

    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        //Adicionar no carrinho
        addToCart(name, price)
    }
})

// Função para adicionar no carrinho
function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name)

    if(existingItem){
        //Se existe item duplo, aumenta quantidade + 1
        existingItem.quantity += 1;

    }else{
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }

    updateCartModal()

}

// atualiza o carrinho
function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-bold">${item.name}</P>
                    <p>Qtd: ${item.quantity}</P>
                    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</P>
                </div>

                <button class="remove-form-cart-btn" data-name="${item.name}">
                    Remover
                </button>
            </div>
        `

        total += item.price * item.quantity;
        cartItemsContainer.appendChild(cartItemElement);
    })

    cartTotal.textContent = total.toLocaleString("pt-BR",{
        style: "currency",
        currency: "BRL"
    });

    updatePaymentModalTotal(total); // Adiciona essa linha para atualizar o total no modal de pagamento

    cartCounter.innerHTML = cart.length;
}

// Função para atualizar o total no modal de pagamento
function updatePaymentModalTotal(total) {
    const paymentModalTotal = document.getElementById("payment-modal-total");
    if (paymentModalTotal) {
        paymentModalTotal.textContent = total.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }
}


// Função para remover item do carrinho
cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-form-cart-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
    }

})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name)

    if(index !== -1){
        const item = cart[index];
        
        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();

    }

}

addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }

})


// Finalizar pedido
checkoutBtn.addEventListener("click", function(){

    const isOpen = checkRestaurantOpen();
    if(!isOpen){
        
        Toastify({
            text: "O Restaurante está fechado no momento!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#EF4444",
            },
        }).showToast();


        return;
    }

    if(cart.length === 0) return;
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    showPaymentModal();
    updateCartModal();

})


// Função para enviar informações de pagamento para o WhatsApp
function sendPaymentInfoToWhatsApp(paymentOption, changeNeeded) {
    const cartItems = cart.map((item) => {
        return (
            `${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price.toFixed(2)}\n`
        );
    }).join("");

    const totalText = cartTotal.textContent || cartTotal.innerText;

    let paymentInfo = `Forma de pagamento: ${paymentOption}\n`;
    if (paymentOption === "Dinheiro" && changeNeeded) {
        paymentInfo += `Troco para: R$${parseFloat(changeNeeded).toFixed(2)}\n`;
    }

    const message = encodeURIComponent(`${cartItems}\n${paymentInfo}Endereço: ${addressInput.value}\nTotal: ${totalText}`);
    const phone = "99999999999";

    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
}

// Verificar a hora e manipular o card harario
function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 23;
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600")
}else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}