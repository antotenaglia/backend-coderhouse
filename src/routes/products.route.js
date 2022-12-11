import { Router } from "express";
import * as fs from 'fs';

const router = Router();

let administrator = true; 

//se define lista de productos
const products = [
    {
        id: 1,
        timestamp: Date.now(),
        title: "Remera",
        description: "Lisa manga corta",
        code: 101,
        price: 1465,
        stock: 10,
        thumbnail: "https://articulo.mercadolibre.com.ar/MLA-1176235635-remera-lisa-jersey-premium-peinado-manga-corta-_JM?searchVariation=175410231753#searchVariation=175410231753&position=1&search_layout=grid&type=item&tracking_id=3c1f3ff9-adf9-4313-86ac-e7eb9b4e794f",
    },
    {
        id: 2,
        timestamp: Date.now(),
        title: "Pantalón",
        description: "Largo elastizado",
        code: 201,
        price: 5490,
        stock: 15,
        thumbnail: "https://articulo.mercadolibre.com.ar/MLA-901089177-pantalon-jogger-elastizado-tela-gabardina-_JM?searchVariation=70673583729#searchVariation=70673583729&position=4&search_layout=grid&type=item&tracking_id=547403d9-cc41-4eb8-92de-08ff7de22b66",
    },
    {
        id: 3,
        timestamp: Date.now(),
        title: "Camisa",
        description: "Lisa entallada",
        code: 301,
        price: 4150,
        stock: 7,
        thumbnail: "https://articulo.mercadolibre.com.ar/MLA-859207549-camisa-lisa-varios-colores-slim-fit-entallada-_JM?searchVariation=57077745991#searchVariation=57077745991&position=2&search_layout=grid&type=item&tracking_id=b025acf3-30d1-4eb1-8ec2-dbc9635ae8bf",
    },
];

//se definen métodos a partir de la ruta inicial "/api/products"
router.route("/")
    //agrega productos 
    .post((req, res) => { 
        if (administrator) {
            const { title, description, code, price, stock, thumbnail } = req.body;
            const newProduct = {
                id: products[products.length - 1].id + 1,
                timestamp: Date.now(),
                title,
                description,
                code,
                price,
                stock,
                thumbnail,
            };
        
            products.push(newProduct);

            //se guardan los productos en 'products.txt'
            async function saveProducts() {
                try {
                await fs.promises.writeFile('../../products.txt', JSON.stringify(products, null, 2));
                } catch (error) {
                throw new Error(`Error al guardar producto en el archivo: ${error}`);
                }
            };
  
            saveProducts();
  
            res.status(201).json({status: "Product added", productAdded: newProduct}); 
        } else {
            return res.status(404).json({error: -1, description: 'método POST no autorizado'});
        };
    }); 

//se definen métodos a partir de la ruta "/api/products/:id"
router.route("/:id")
    //devuelve todos los productos o un producto según su id 
    .get((req, res) => {
        const { id } = req.params;
        const productFound = products.find((product) => product.id === Number(id)) 
        const response = productFound ? {status: "Product found", product: productFound} : {error: "Product not found", productList: products}
        const statusCode = productFound ? 200 : 404
        
        res.status(statusCode).json(response);
    })

    //actualiza un producto según su id 
    .put((req, res) => {
        if (administrator) {
            const { id } = req.params;
            const { title, description, code, price, stock, thumbnail } = req.body;
            const productUpdated = {
                id,
                timestamp: Date.now(),
                title,
                description,
                code,
                price,
                stock,
                thumbnail,
            };
            const productToUpdate = products.find((product) => product.id === Number(id));
            const indexProductToUpdate = products.indexOf(productToUpdate);

            if (!indexProductToUpdate) {
            return res.status(404).json({error: 'Product not found'})
            };
        
            products.splice(indexProductToUpdate, 1, productUpdated);
        
            res.status(200).json({status: "Product updated", product: productUpdated});
        } else {
            return res.status(404).json({error: -1, description: 'método PUT no autorizado'})
        }
    })

    //elimina un producto según su id 
    .delete((req, res) => {
        if (administrator) {
            const { id } = req.params;
            const productToDelete = products.find((product) => product.id === Number(id));
            const indexProductToDelete = products.indexOf(productToDelete);
        
            if (!productToDelete) {
            return res.status(404).json({error: 'Product not found'})
            };
        
            products.splice(indexProductToDelete, 1);
        
            res.status(200).json({status: "Product deleted", product: productToDelete});
        } else {
            return res.status(404).json({error: -1, description: 'método DELETE no autorizado'})
        }
    });

export default router;



