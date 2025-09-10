import { createPage } from "../pages/utils.js";

// Basicamente se arma el contenido que se quiere mostrar, luego se llama a createPage de utils que tiene la estructura basica de cualquier html y se le introduce 
// el contenido y se muestra
function createProductListPage(products) {
    let html = "";
    html += "<ul class='cardContainer'>";
    for (let i = 0; i < products.length; i++) {
        html +=
        "<li class='card'>" +
            `<a href="/products/${products[i]._id}">${products[i].name} </a>` +
            `<p>Image:</p><img class='size' src="${products[i].image}" alt=""/>` +
            `<a class="btn" href="/products/edit/${products[i]._id}">Edit</a>` +
            `<a class="btn" href="/products/delete/${products[i]._id}">Delete</a>`
        "</li>";
    }
    html += "</ul>";
    return createPage("products", html);
}
function createDetailPage(product) {
    let html = "";
    if (product) {
        html += `<div class= 'cardContainer card3'>`
        html += `<p>Product Id: ${product.productId}</p>`;
        html += `<p>Name: ${product.name}</p>`;
        html += `<p>Price: ${product.price}</p>`;
        html += `<p>Description: ${product.description}</p>`;
        html += `<p>Brand: ${product.brand}</p>`;
        html += `<p>Category: ${product.category}</p>`;
        html += `<p>Link:</p><a href="${product.link}" target="_blank">${product.name}</a>`;
        html += `<p>Image:</p><img src="${product.image}" alt=""/>`;
        html += `</div>`;
        
        html = createPage(product.name, html);
    } else {
        html = createPage("Error", "<p>Product not found</p>");
    }
    return html;
}

function createForm() {
    let html = "";
    html += '<form action="/products/new" method="POST">';
    html += '<input type="text" name="productId" placeholder="Product Id">';
    html += '<input type="text" name="name" placeholder="Name">';
    html += '<input type="text" name="price" placeholder="Price">';
    html += '<input type="text" name="description" placeholder="Description">';
    html += '<input type="text" name="brand" placeholder="Brand">';
    html += '<input type="text" name="category" placeholder="Category">';
    html += '<input type="text" name="link" placeholder="Link">';
    html += '<input type="text" name="image" placeholder="Image">';
    html += '<button class="btn" type="submit">Create</button>';
    html += "</form>";
    return createPage("Create product", html);
}

function editForm(product) {
    let html = "";
    html += `<div class= 'cardContainer card2'>`
    html += `<form action="/products/edit/${product._id}" method="POST">`;
    html += `<input type="text" name="productId" placeholder="Product Id" value="${product.productId}" >`;
    html += `<input type="text" name="name" placeholder="Name" value="${product.name}" >`;
    html += `<input type="text" name="price" placeholder="Price" value="${product.price}" >`;
    html += `<input type="text" name="description" placeholder="Description" value="${product.description}" >`;
    html += `<input type="text" name="brand" placeholder="Brand" value="${product.brand}" >`;
    html += `<input type="text" name="category" placeholder="Category" value="${product.category}" >`;
    html += `<input type="text" name="link" placeholder="Link" value="${product.link}" >`;
    html += `<input type="text" name="image" placeholder="Image" value="${product.image}" >`;

    html += '<button class="btn" type="submit">Edit</button>';
    html += "</form>";
    html += `</div>`;

    return createPage("Edit Product", html);
}

function deleteForm(product) {
    let html = "";
    
    html += `<form action="/products/delete/${product._id}" method="POST">`;
    html += createDetailPage(product);
    html += '<button class="btn" type="submit">Delete</button>';
    html += "</form>";

    return html
}

export {
    createDetailPage,
    createProductListPage,
    createForm,
    createPage,
    editForm,
    deleteForm
};