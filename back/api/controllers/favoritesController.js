import * as service from '../../services/favoritesService.js';

function getFavorites(req, res) {
    const id = req.params.id;
    service.getFavorites(id).then(favorites => {
        res.status(200).json(favorites);
    });
}

function addToFavorites(req, res) {
    const id = req.params.id;
    const favorite = {
        name: req.body.name,
        favorite: req.body.favorite
    };
    service.addToFavorites(id, favorite).then(() => {
        res.status(201).json(favorite);
    })
}

export {
    getFavorites,
    addToFavorites
}