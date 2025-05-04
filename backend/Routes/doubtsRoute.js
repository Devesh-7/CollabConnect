const express = require('express');
const
{
    getDoubts,
    postDoubts,
    postAnswers,
    putVotes,
    getAnswers
} = require('../Controllers/doubtAnswersPage.js');

const router = express.Router();
router.get('/', getDoubts);
router.get('/answers/:doubtId', getAnswers);
router.post('/postdoubt/:userID', postDoubts);
router.post('/postans/:userID', postAnswers);
router.put('/votes/:answerID', putVotes);
module.exports = router;