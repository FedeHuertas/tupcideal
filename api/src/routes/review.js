const { Router } = require('express');
const router = Router();
const { Review, WareHouse, User} = require('../db.js');

router.get('/product/:productId', async (req,res) => {
    const { productId } = req.params;
    const productReview = await Review.findAll({
        include: [{
            model: WareHouse,
            where: { id : [productId] }
        }]
    })
    res.send(productReview)
});

router.get('/user/:userId', async (req,res) => {
    const { userId } = req.params;
    const userReview = await Review.findAll({
        include: [{
            model: User,
            where: { id : [userId] }
        }]
    })
    res.send(userReview)
});

router.post('/', async (req,res) => {
    const { ProductId, rating, comment, UserId} = req.body;
    if(ProductId && rating ) {
        try{
            const newReview = await Review.create({
                rating : rating,
                comment : comment,
                ProductId: ProductId,
                UserId: UserId
                });
            res.status(201).send(newReview)
        } catch (err) {
            res.status(500).send({err:err.message});
        };
    } else {
        res.status(400).send({err:'Es necesario que puntues el producto para guardar tu review'})
    }
});

router.put('/:id', async (req,res) => {
    const { rating, comment } = req.body;
    const id = req.params.id
    if(comment && rating ) {
        try{
            const review = await Review.findByPk(id)
            review.rating = rating
            review.comment = comment
            await review.save();
            res.status(201).send(review);
        } catch (err) {
            res.status(500).send({err:err.message});
        };
    } else {
        res.status(400).send({err:'Es necesario que puntues el producto para guardar tu review'})
    }
});

module.exports = router;