const flowerRepository = require('../model')('Flower');

module.exports.getAllFlowers = async () => {
    let success = false;
    let result = null;
    await flowerRepository.find({}, (err, flowers) => {
        if (!err) {
            success = true;
            result = flowers.map(flower => {
                return {
                    id: flower._id,
                    name: flower.name,
                    price: flower.price,
                    description: flower.description,
                    src: flower.src.data.toString('base64')
                }
            });
        }
    });
    return { success: success, data: result };
};

module.exports.addFlower = async flower => {
    const createdFlower = await flowerRepository.CREATE(flower);
    console.log(`A new flower created: ${createdFlower}`);
};

module.exports.removeFlower = async name => {
    const flower = await flowerRepository.findOneAndDelete({ name: name });
    !!flower ? console.log(`Flower: ${flower} \nsuccessfully deleted !!`)
        : console.log(`ERROR: Flower: ${name} not found !!`);
};