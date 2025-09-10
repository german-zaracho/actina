import * as service from "../../services/multiplechoiceService.js";

//Los controladores reciben la informacion de las rutas y les indican que hacer a las funciones de los servicios
const getMultiplechoices = (req, res) => {
    
    const filter = req.query;

    service.getMultiplechoices(filter).then((multiplechoices) => {
        res.status(200).json(multiplechoices);
    });

};

const getMultiplechoiceById = (req, res) => {

    const id = req.params.id;

    service.getMultiplechoiceById(id).then((multiplechoice) => {
        if (multiplechoice) {
            res.status(200).json(multiplechoice);
        } else {
            res.status(404).json();
        }
    });

};

const addMultiplechoice = async (req, res) => {

    try {
        service
            .createMultiplechoice(req.body)
            .then((newMultiplechoice) => {
                res.status(201).json(newMultiplechoice);
            })
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }

};

const replaceMultiplechoice = (req, res) => {

    const id = req.params.id;

    const multiplechoice = {
        subject: req.body.subject,
        classification: req.body.classification,
        questions: req.body.questions.map((question) => ({
            question: question.question,
            options: question.options,
            answer: question.answer,
            justification: question.justification,
        })),
    };

    service.replaceMultiplechoice(id, multiplechoice).then((editedMultiplechoice) => {
        if (editedMultiplechoice) {
            res.status(200).json(editedMultiplechoice);
        } else {
            res.status(404).json();
        }
    });

};

//Simples comparaciones para actualizar propiedades del objeto multiplechoice, luego llama al servicio y actualiza la informacion en la DB
const updateMultiplechoice = async (req, res) => {

    const id = req.params.id;

    service.editMultiplechoice(id, req.body).then((editedMultiplechoice) => {
        if (editedMultiplechoice) {
            res.status(200).json(editedMultiplechoice);
        } else {
            res.status(404).json();
        }
    });

};

const deleteMultiplechoice = (req, res) => {

    const id = req.params.id;
    service
        .deleteMultiplechoice(id)
        .then(() => {
            res.status(204).json();
        })
        .catch((error) => res.status(500).json());

};

export {
    getMultiplechoices,
    getMultiplechoiceById,
    addMultiplechoice,
    updateMultiplechoice,
    replaceMultiplechoice,
    deleteMultiplechoice,
};