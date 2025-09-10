import * as service from "../../services/atlasService.js";

//Los controladores reciben la informacion de las rutas y les indican que hacer a las funciones de los servicios
const getAtlas = (req, res) => {

    const filter = req.query;
    service.getAtlas(filter).then((atlas) => {
        res.status(200).json(atlas);
    });

};

const getAtlasById = (req, res) => {

    const id = req.params.id;
    service.getFlashcardById(id).then((atlas) => {
        if (atlas) {
            res.status(200).json(atlas);
        } else {
            res.status(404).json();
        }
    });

};

const addAtlas = async (req, res) => {

    try {
        service
            .createAtlas(req.body)
            .then((newAtlas) => {
                res.status(201).json(newAtlas);
            })
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }

};

const replaceAtlas = (req, res) => {

    const id = req.params.id;

    const atlas = {
        type: req.body.type,
        subject: req.body.subject,
        pages: req.body.pages.map((page) => ({
            topic: page.topic,
            image: page.image,
            items: page.items,
            flashcardId: page.flashcardId,
        })),
    };

    service.replaceAtlas(id, atlas).then((editedAtlas) => {
        if (editedAtlas) {
            res.status(200).json(editedAtlas);
        } else {
            res.status(404).json();
        }
    });

};

//Simples comparaciones para actualizar propiedades del objeto atlas, luego llama al servicio y actualiza la informacion en la DB
const updateAtlas = async (req, res) => {

    const id = req.params.id;

    service.editAtlas(id, req.body).then((editedAtlas) => {
        if (editedAtlas) {
            res.status(200).json(editedAtlas);
        } else {
            res.status(404).json();
        }
    });

};

const deleteAtlas = (req, res) => {

    const id = req.params.id;

    service
        .deleteAtlas(id)
        .then(() => {
            res.status(204).json();
        })
        .catch((error) => res.status(500).json());
        
};

export {
    getAtlas,
    getAtlasById,
    addAtlas,
    updateAtlas,
    replaceAtlas,
    deleteAtlas,
};