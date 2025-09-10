import * as service from "../../services/flashcardService.js";

//Los controladores reciben la informacion de las rutas y les indican que hacer a las funciones de los servicios
const getFlashcards = (req, res) => {
    const filter = req.query;

    service.getFlashcards(filter).then((flashcards) => {
        res.status(200).json(flashcards);
    });
};

const getFlashcardById = (req, res) => {
    const id = req.params.id;
    service.getFlashcardById(id).then((flashcard) => {
        if (flashcard) {
            res.status(200).json(flashcard);
        } else {
            res.status(404).json();
        }
    });
};

const addFlashcard = async (req, res) => {

    try {
        service
            .createFlashcard(req.body)
            .then((newFlashcard) => {
                res.status(201).json(newFlashcard);
            })
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }

};

const replaceFlashcard = (req, res) => {
    const id = req.params.id;

    const flashcard = {
        subject: req.body.subject,
        topic: req.body.topic,
        tabs: req.body.tabs.map((tab) => ({
            concepts: tab.concepts,
            features: tab.features,
            atlasId: tab.atlasId,
            atlasPage: tab.atlasPage,
        })),
    };

    service.replaceFlashcard(id, flashcard).then((editedFlashcard) => {
        if (editedFlashcard) {
            res.status(200).json(editedFlashcard);
        } else {
            res.status(404).json();
        }
    });
};

//Simples comparaciones para actualizar propiedades del objeto flashcard, luego llama al servicio y actualiza la informacion en la DB
const updateFlashcard = async (req, res) => {
    const id = req.params.id;

    service.editFlashcard(id, req.body).then((editedFlashcard) => {
        if (editedFlashcard) {
            res.status(200).json(editedFlashcard);
        } else {
            res.status(404).json();
        }
    });

};

const deleteFlashcard = (req, res) => {
    const id = req.params.id;
    service
        .deleteFlashcard(id)
        .then(() => {
            res.status(204).json();
        })
        .catch((error) => res.status(500).json());
};

export {
    getFlashcards,
    getFlashcardById,
    addFlashcard,
    updateFlashcard,
    replaceFlashcard,
    deleteFlashcard,
};