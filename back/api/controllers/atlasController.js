import * as service from "../../services/atlasService.js";

async function getAll(req, res) {
    try {
        const atlas = await service.getAll();
        res.json(atlas);
    } catch (err) {
        console.error('Error in getAll atlas:', err);
        res.status(500).json({ error: { message: err.message } });
    }
}

async function getById(req, res) {
    try {
        const item = await service.getById(req.params.id);
        if (!item) {
            return res.status(404).json({ error: { message: 'Atlas not found' } });
        }
        res.json(item);
    } catch (err) {
        console.error('Error in getById atlas:', err);
        res.status(404).json({ error: { message: err.message } });
    }
}

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
    getAll,
    getById,
    addAtlas,
    updateAtlas,
    replaceAtlas,
    deleteAtlas,
};