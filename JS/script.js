const cards = document.getElementById('cards');
const items = document.getElementById('items');
const footer = document.getElementById('footer')
const template = document.getElementById('template').content;
const templateFooter = document.getElementById('template-footer').content;
const templateCarrito = document.getElementById('template-carrito').content;
const fragment = document.createDocumentFragment();
let carrito = {}

document.addEventListener('DOMContentLoaded', () => {
    fetchData()
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
    }
});
cards.addEventListener('click', e => {
    agregarAlCarrito(e)
});
items.addEventListener('click', e => {
    btnAumentarDisminuir(e)
});

const fetchData = async () => {
    try {
        const res = await fetch('./libros.json')
        const data = await res.json()
        agregandoDatosALasCards(data)
    } catch (error) {
        console.log(error)
    }
}

const agregandoDatosALasCards = data => {
    data.forEach(libro => {
        template.getElementById('titulo').textContent = libro.titulo;
        template.getElementById('precio').textContent = libro.precio
        template.getElementById('img').setAttribute("src", libro.thumbnailUrl);
        template.querySelector('button').dataset.id = libro.id;
        template.getElementById('stock').dataset.stock = libro.stock;
        

        const clonar = template.cloneNode(true)
        fragment.appendChild(clonar)
        
    });
    cards.appendChild(fragment);
}

const agregarAlCarrito = e => {
    if (e.target.classList.contains('btn-primary')) {
        setCarrito(e.target.parentElement)
    }
    //detiene a otro evento que no sea la clases "btn-primary"
    e.stopPropagation()
}

// en esta funcion paso los elementos de JSON a un objeto "producto" para poder pinatrlo en la barra de carrito de compras
const setCarrito = objeto => {
    console.log(objeto)
    const producto = {
        title: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('strong').textContent,
        id: objeto.querySelector('button').dataset.id,
        cantidad: 1
    }
    console.log(producto)
    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }

    carrito[producto.id] = {
        ...producto
    }

    pintarCarrito()
}

//aca use "Object.values" para poder recorrer mi objeto "producto" mediante un forEach
const pintarCarrito = () => {
    items.innerHTML = ''
console.log(carrito)
    Object.values(carrito).forEach(producto => {
        templateCarrito.getElementById('td-1').textContent = producto.title
        templateCarrito.getElementById('td-2').textContent = producto.cantidad
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio

        
        //botones para aumentar o disminuir pedido
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)

    pintarFooter()

    localStorage.setItem('carrito', JSON.stringify(carrito))
}

const pintarFooter = () => {
    footer.innerHTML = ''

    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío </th>
        `
        return
    }

    // sumar cantidad y sumar totales
    const nCantidad = Object.values(carrito).reduce((acc, {
        cantidad
    }) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acc, {
        cantidad,
        precio
    }) => acc + cantidad * precio, 0)

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)

    footer.appendChild(fragment)

    const boton = document.querySelector('#vaciar-carrito')
    boton.addEventListener('click', () => {
        carrito = {}
        pintarCarrito()
    })

}

const btnAumentarDisminuir = e => {
    // console.log(e.target.classList.contains('btn-info'))
    if (e.target.classList.contains('btn-info')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = {
            ...producto
        }
        pintarCarrito()
    }

    if (e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        } else {
            carrito[e.target.dataset.id] = {
                ...producto
            }
        }
        pintarCarrito()
    }
    e.stopPropagation()
}