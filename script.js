import { menuArray } from '/data.js';
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

let orderArray = [];

document.addEventListener('click', function(e){
    if(e.target.dataset.add){
        handleAddButton(e.target.dataset.add);
    }
    else if(e.target.dataset.remove){
        handleRemoveButton(e.target.dataset.remove);
    }
    else if(e.target.dataset.complete){
        handleBtnComplete();
    }
});

function handleBtnComplete() {
    document.getElementById('modal-payout').classList.remove('hidden');
    render();
}

function handleRemoveButton(orderUuid) {
    removeOrder(orderUuid);
    render();
}

function handleAddButton(productId) {
    const targetProductObj = menuArray.filter(function(product){
        return product.id == productId;
    })[0];
    addOrder(targetProductObj);
    render();
}

function getTotalPrice() {
    let totalPrice = 0;
    orderArray.forEach(function(order){
        totalPrice += order.price;
    });
    return totalPrice;
}

function removeOrder(orderUuid) {
    orderArray.filter(function(order, index){
        if(order.uuid === orderUuid){
            orderArray.splice(index,1);
        }
    })

    document.getElementById(orderUuid).parentElement.remove();
}

function addOrder(product) {

    const newOrder = Object.assign({},product);
    const uuid = uuidv4();

    newOrder["uuid"] = uuid;
    orderArray.push(newOrder);
    
    document.getElementById('orders').innerHTML += `
        <div class="order">
            <p class="name">${newOrder.name}</p>
            <button class="btn-remove" data-remove="${uuid}" id="${uuid}">remove</button>
            <p class="price">$${newOrder.price}</p>
        </div>
    `;
}

function getHtmlFeed() {
    let htmlProducts = '';

    menuArray.forEach(function(product){
        htmlProducts += `
            <div class="product">
                <p class="emoji">${product.emoji}</p>
                <div>
                    <p class="name">${product.name}</p>
                    <p class="ingredients">${product.ingredients}</p>
                    <p class="price">${product.price}</p>
                </div>
                <button class="btn-add" data-add="${product.id}">+</button>
            </div>
        `;
    });

    return htmlProducts;
}

function render() {
    document.getElementById('productsPanel').innerHTML = getHtmlFeed();
    document.getElementById('total-price-el').innerText = `$${getTotalPrice()}`;

    if(orderArray.length > 0){
        document.getElementById('orders-container').classList.remove('hidden');
    }
    else {
        document.getElementById('orders-container').classList.add('hidden');
    }

    if(new URLSearchParams(new URL(window.location).search).get('name')){
        const name = new URLSearchParams(new URL(window.location).search).get('name');
        document.getElementById('success-container').innerHTML = `
            <div class="success-box">
                <p>Thanks, ${name}! Your order is on its way!</p>
            </div>
        `;
        setTimeout(function(){
            document.getElementById('success-container').innerHTML = '';
        },5000);
    }
}

render();

