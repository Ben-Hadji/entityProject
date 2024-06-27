import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GITLAB_API_URL = 'https://gitlab.com/api/v4';
const REPO_ID = 'votre_repo_id'; // Remplacez par l'ID de votre repo
const GITLAB_TOKEN = 'votre_token_gitlab'; // Remplacez par votre token personnel GitLab

const App = () => {
  const [diffs, setDiffs] = useState(null);

  useEffect(() => {
    const fetchDiffs = async () => {
      try {
        // Récupérer les deux derniers commits
        const commitsResponse = await axios.get(
          `${GITLAB_API_URL}/projects/${REPO_ID}/repository/commits`, {
            headers: {
              'PRIVATE-TOKEN': GITLAB_TOKEN,
            },
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
          `${GITLAB_API_URL}/projects/${REPO_ID}/repository/compare`, {
            headers: {
              'PRIVATE-TOKEN': GITLAB_TOKEN,
            },
            params: {
              from: commits[1].id,
              to: commits[0].id,
            },
          }
        );

        setDiffs(diffResponse.data.diffs);
      } catch (error) {
        console.error('Erreur lors de la récupération des différences de commits:', error);
      }
    };

    fetchDiffs();
  }, []);

  return (
    <div>
      <h1>Différences entre les deux derniers commits</h1>
      {diffs ? (
        <pre>{JSON.stringify(diffs, null, 2)}</pre>
      ) : (
        <p>Chargement...</p>
      )}
    </div>
  );
};

export default App;
