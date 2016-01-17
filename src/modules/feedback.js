import { feedbackDialogMessage } from '../constants';

//
// Prompt a feedback to user
//

function execute(whoami, done) {

  const answer = prompt(feedbackDialogMessage);
  whoami.store('feedback', answer);
  done();

}


export default { execute: execute }
