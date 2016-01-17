//
// Prompt a feedback to user
//
const message = 'Please, enter your feedback about us (optional)';

function execute(whoami, done) {

  const answer = prompt(message);
  whoami.store('feedback', answer);
  done();

}


export default { execute: execute }
