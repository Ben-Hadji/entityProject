const { exec } = require('child_process');

// Fonction pour récupérer les diffs entre deux commits
function getDiffs(commit1, commit2) {
  return new Promise((resolve, reject) => {
    const command = `git diff ${commit1} ${commit2}`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        reject(`stderr: ${stderr}`);
        return;
      }
      resolve(stdout);
    });
  });
}

// Exemple d'utilisation
getDiffs('commit1_hash', 'commit2_hash')
  .then((diffs) => {
    console.log(diffs);
  })
  .catch((error) => {
    console.error(error);
  });
