// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload. yessss
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
const App = () => {
  const [diffs, setDiffs] = useState(null);
  const gitlabRepoUrl = process.env.REACT_APP_GITLAB_REPO_URL;

  useEffect(() => {
    const fetchDiffs = async () => {
      try {

        console.log(gitlabRepoUrl)
        // Vérifier si l'URL du repository est définie dans les variables d'environnement
        if (!gitlabRepoUrl) {
          console.error('La variable d\'environnement REACT_APP_GITLAB_REPO_URL n\'est pas définie.');
          return;
        }

        // Extraire le propriétaire et le nom du repository à partir de l'URL
        const url = new URL(gitlabRepoUrl);
        const pathParts = url.pathname.split('/').filter(part => part !== '');
        if (pathParts.length < 2) {
          console.error('URL du repository GitLab invalide.');
          return;
        }

        const repoOwner = pathParts[0];
        const repoName = pathParts[1];

        // Récupérer les deux derniers commits
        const commitsResponse = await axios.get(
          `https://gitlab.com/api/v4/projects/${repoOwner}%2F${repoName}/repository/commits`, {
            params: {
              per_page: 2,
            },
          }
        );

        const commits = commitsResponse.data;

        if (commits.length < 2) {
          console.error('Moins de deux commits trouvés dans le repository.');
          return;
        }

        // Récupérer les différences entre les deux derniers commits
        const diffResponse = await axios.get(
          `https://gitlab.com/api/v4/projects/${repoOwner}%2F${repoName}/repository/compare`, {
            params: {
              from: commits[1].id,
              to: commits[0].id,
            },
          }
        );

        const diffs = diffResponse.data.diffs;
        setDiffs(diffs);

      } catch (error) {
        console.error('Erreur lors de la récupération des différences de commits:', error);
      }
    };

    fetchDiffs();
  }, [gitlabRepoUrl]);

  return (
    <div>
      <h1>Récupérer les différences des deux derniers commits dans GitLab</h1>
      
      {diffs ? (
        <div>
          <h2>Différences entre les deux derniers commits</h2>
          <pre>{JSON.stringify(diffs, null, 2)}</pre>
        </div>
      ) : (
        <p>Chargement...</p>
      )}
    </div>
  );
};

export default App;
