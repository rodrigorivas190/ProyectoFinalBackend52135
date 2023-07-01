import { Router } from 'express';
import CartManager from '../cartManager.js';

const router = Router();
const cartManager = new CartManager('cart.json');

router.get('/', async (req, res)=>{
    let limit = req.query.limit;
    const carts = await cartManager.get();
    if(!limit){
        return res.json({carts});
    }
    limit = limit < carts.length ? limit : carts.length;
    const arr = [];
    for(let i=0; i<limit; i++){
        arr.push(carts[i]);
    }
    return res.json({arr});
})

router.get('/:cid', async (req, res)=>{
    const cid = parseInt(req.params.cid);
    const cart = await cartManager.getbyId(cid);
    if(cart == -1) return res.status(404).send(`cart not found`);
    return res.json({...cart.products});
})

router.post('/', async (req, res)=>{
    const createCart = await cartManager.create();
    res.send({status: 'successful', createCart});
})

router.post('/:cid/products/:pid', async (req, res)=>{
    const cartID = parseInt(req.params.cid);
    const prodID = parseInt(req.params.pid);

    const cartAdd = await cartManager.addProduct(cartID, prodID);
    
    res.send({status: 'successful', cartAdd})
})

router.delete('/:cid', async (req, res)=>{
    const pid = parseInt(req.params.cid);
    const nlist = await cartManager.delete(cid);
    if(!nlist) return res.status(404).send(`product not found`);
    res.send({status: 'update successful', nlist});
})

router.delete('/:cid/products/:pid', async (req, res)=>{
    const cartID = parseInt(req.params.cid);
    const prodID = parseInt(req.params.pid);

    const ncart = await cartManager.deleteProduct(cartID, prodID);
    if(!ncart) return res.status(404).send(`cart not found`);
    res.send({status: 'update successful', ncart});
})

export default router;