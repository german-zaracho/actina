import * as service from "../services/multiplechoiceService.js";
import * as view from "../views/view.js";

//Los controladores reciben la informacion de las rutas y les indican que hacer a las funciones de los servicios
const getMultiplechoices = (req, res) => {
    service.getMultiplechoices({ deleted: true }).then((multiplechoices) => {
        res.send(view.createMultiplechoiceListPage(multiplechoices));
    });
};

const getMultiplechoicebyId = (req, res) => {
    const idMultiplechoice = req.params.multiplechoice_id;
    console.log("hola4", idMultiplechoice, "hola5",req, req.params, "hola6");
    service.getMultiplechoicebyId(idMultiplechoice).then((multiplechoice) => {
        if (multiplechoice) {
            res.send(view.createDetailPage(multiplechoice));
        } else {
            res.send(view.createPage("Error", "<p>The multiplechoice was not found</p>"));
        }
    });
};

const getMultiplechoicesBySubject = (req, res) => {
    console.log("hola controllers");
    const subject = req.params.subject;

        service.getMultiplechoicesBySubject(subject).then((multiplechoices) => {

            console.log(multiplechoices, "hola3", subject);
            if (multiplechoices) {
                res.send(view.createMultiplechoiceListPage(multiplechoices));
            } else {
                res.send(view.createPage("Error", "<p>The multiplechoice was not found</p>"));
            }

        })
        .catch((error) => res.send(view.createPage("Error", `<p> ${error}</p>`)));

};



const createMultiplechoiceFormPage = (req, res) => {
    res.send(view.createForm());
};

const createMultiplechoice = (req, res) => {
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

    service
        .createMultiplechoice(multiplechoice)
        .then((newMultiplechoice) => {
            res.send(
                view.createPage(
                    "Multiplechoice created",
                    `<p>The multiplechoice ${newMultiplechoice.name} was created with id ${newMultiplechoice._id}</p>`
                )
            );
        })
        .catch((error) => res.send(view.createPage("Error", `<p> ${error}</p>`)));
};

const editMultiplechoiceFrom = (req, res) => {
    const id = req.params.multiplechoice_id;
    service.getMultiplechoicebyId(id).then((multiplechoice) => {
        if (multiplechoice) {
            res.send(view.editForm(multiplechoice));
        } else {
            res.send(
                view.createPage(
                    "The multiplechoice was not found",
                    "<h1>The requested multiplechoice was not found</h1>"
                )
            );
        }
    });
};

const editMultiplechoice = (req, res) => {
    const id = req.params.multiplechoice_id;

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

    // console.log("hola1", id);

    service.editMultiplechoice(id, multiplechoice).then((editedMultiplechoice) => {
        // console.log("hola2");
        // console.log(product);
        if (editedMultiplechoice) {
            res.send(view.createPage("Multiplechoice edited", `<h2>The multiplechoice "${multiplechoice.name}"  was successfully edited</h2>`))
        } else {
            res.send(view.createPage("Could not be edited", "<h1>Could not be edited</h1>"))
        }
    })

        .catch((error) => {
            res.send(view.createPage("Error", `<p>${error}</p>`));
        });
}

const deleteMultiplechoiceFrom = (req, res) => {

    const id = req.params.multiplechoice_id
    console.log(id);
    service.getMultiplechoicebyId(id).then((multiplechoice) => {
        if (multiplechoice) {
            res.send(view.deleteForm(multiplechoice));
        } else {
            res.send(
                view.createPage(
                    "It was not found",
                    "<h1>The requested multiplechoice was not found</h1>"
                )
            );
        }
    });

}

const deleteMultiplechoice = (req, res) => {

    const id = req.params.multiplechoice_id
    service.deleteMultiplechoice(id)
        .then((deleteMultiplechoice) => {
            if (deleteMultiplechoice) {
                res.send(view.createPage("Deleted multiplechoice", `<h2>The multiplechoice #${deleteMultiplechoice._id} was successfully deleted</h2>`))
            } else {
                res.send(view.createPage("Could not be deleted", "<h1>Could not be deleted</h1>"))
            }
        })

}

export {

    getMultiplechoices,
    getMultiplechoicebyId,
    createMultiplechoiceFormPage,
    createMultiplechoice,
    editMultiplechoiceFrom,
    editMultiplechoice,
    deleteMultiplechoiceFrom,
    deleteMultiplechoice,
    getMultiplechoicesBySubject

};