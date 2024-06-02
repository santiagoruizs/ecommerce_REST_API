const express = require('express');
const router = express.Router();
const {query} = require('../db/db');
// Middleware to check valid cart id
const checkCartID = (req, res, next) => {

    query('SELECT * FROM carts WHERE id = $1',[req.params.id],(error, results) => {
        if(error){
            res.status(400).json({msg: error.message})
        }
        if (results.rowCount > 0){
            next()
        }else{
            res.status(400).send("Invalid Cart Id")
        }
    })
}
const checkoutCart = (req, res, next) => {
    query('UPDATE carts SET checked_out = true WHERE id = $1',[req.params.id],(error, results) => {
        if(error){
            res.status(400).json({msg: error.message})
        }
        if (results.rowCount > 0){
            next()
        }else{
            res.status(400).send("Invalid Cart Id")
        }
    })
}


const openCart = async (req, res, next) => {
  try {
    // Check if there is an open cart for the user
    const openCart = await query('SELECT id FROM carts WHERE user_id = $1 AND checked_out = false;', [req.params.user_id]);

    if (openCart.rowCount === 0) {
      // If no open cart exists, create a new one
      await query('INSERT INTO carts (user_id, checked_out) VALUES ($1, $2);', [req.params.user_id, false]);
      // Retrieve the newly created cart
      const newCart = await query('SELECT id FROM carts WHERE user_id = $1 AND checked_out = false;', [req.params.user_id]);
      // Send the new cart as the response
      req.cart = newCart.rows[0];
      next();
    } else {
      // If an open cart already exists, attach it to the request object
      req.cart = openCart.rows[0];
      // Pass control to the next middleware or route handler
      next();
    }
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

const openCartInfo = async (req, res, next) => {  
    try {
        // Check if there is an open cart for the user
        const info = await query('select cp.*, p.name, p. category, p.price, cp.quantity * p.price as total_price, imageurl from cart_products as cp ' +
        'inner join products as p on p.id = cp.product_id WHERE cp.cart_id = $1;',[req.cart.id])
        res.json({id : req.cart.id, items:info.rows})
        
    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
}

const checkNotEmptyCart = (req, res, next) => {

    query('SELECT * FROM cart_products WHERE cart_id ='+req.params.id,(error, results) => {
        if(error){
            res.status(400).json({msg: error.message})
        }
        if (results.rowCount > 0){
            next()
        }else{
            res.status(400).send("Cart is Empty")
        }
    })
}

const checkProductID = (req, res, next) => {

    query('SELECT * FROM products WHERE id = $1',[req.body.product_id],(error, results) => {
        if(error){
            res.status(400).json({msg: error.message})
        }
        if (results.rowCount > 0){
            next()
        }else{
            res.status(400).send("Invalid Id")
        }
    })
}
//Get Cart Info
router.get('/:id',checkCartID, (req, res) => {
    query('select cp.*, p.name, p. category, p.price, p.stock * p.price as total_price, imageurl from cart_products as cp ' +
    'inner join products as p on p.id = cp.product_id WHERE cp.cart_id = $1;',[req.params.id],(error, results) => {
        if(error){
            res.status(400).json({msg: error.message})
        }
        res.status(200).json(results.rows)
    })
})
//Get Open Cart
router.get('/open/:user_id', openCart, openCartInfo)

//Create New Empty Cart
router.post('/', (req, res) => {
    query('INSERT INTO carts ( user_id, checked_out) VALUES($1, $2);', [req.body.user_id, false],(error, results) => {
        if(error){
            res.status(400).json({msg: error.message})
        }
        res.status(201).json(results.rows)
    })
});
// Add element to the cart
router.post('/:user_id', checkProductID,openCart, (req, res) => {
    query('INSERT INTO cart_products (cart_id,product_id, quantity) VALUES ($1, $2, $3) ', [req.cart.id, req.body.product_id, req.body.quantity],(error, results) => {
        if(error){  
            res.status(400).json({msg: error.message})
        }
        res.status(201).json(results.rows)
    } )
});
//Update quantity of element on cart PENDING
// router.put('/:id', checkCartID, checkProductID, (req, res) => {
//     query('INSERT INTO cart_products (cart_id,product_id, quantity) VALUES ($1, $2, $3) ', [req.params.id, req.body.product_id, req.body.quantity],(error, results) => {
//         if(error){  
//             res.status(400).json({msg: error.message})
//         }
//         res.status(201).json(results.rows)
//     } )
// });

// delete element from cart PENDING
router.delete('/:id', checkCartID, checkProductID, (req, res) => {
    query('DELETE FROM cart_products WHERE cart_id = $1 AND product_id = $2 ', [req.params.id, req.body.product_id],(error, results) => {
        if(error){  
            res.status(400).json({msg: error.message})
        }
        res.status(201).json({status: "ok"})
    } )
});

// Cart Checkout
router.post('/:id/checkout', checkCartID, checkNotEmptyCart, checkoutCart, (req, res) => {
    
    query('insert into orders (cart_id, user_id, price, order_date) '+
            'select cp.cart_id,c.user_id, SUM(cp.quantity * p.price) as total_price, now()  from cart_products as cp '+
            'inner join products as p on p.id = cp.product_id inner join carts as c on c.id = cp.cart_id '+
            'WHERE cp.cart_id = $1 '+
            'group by cp.cart_id,c.user_id ;', 
            [req.params.id],(error, results) => {
        if(error){  
            res.status(400).json({msg: error.message})
        }
        res.status(201).json({message: "Order created Succesfully"})
    } )
});

module.exports = router;