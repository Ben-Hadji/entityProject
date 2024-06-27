const axios = require('axios');
require('dotenv').config();

// Fonction pour analyser les diffs avec l'API d'Anthropic
async function analyzeDiffs(diffs) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const apiUrl = 'https://api.anthropic.com/analyze';

  try {
    const response = await axios.post(apiUrl, {
      text: diffs,
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error analyzing diffs:', error);
  }
}

// Exemple d'utilisation
const diffs = `
  diff --git a/file1.txt b/file1.txt
  index 83db48f..f735c50 100644
  --- a/file1.txt
  +++ b/file1.txt
  @@ -1 +1,2 @@
  -Hello, world!
  +Hello, world!
  +Hello, universe!
`;

analyzeDiffs(diffs)
  .then((analysis) => {
    console.log('Analysis:', analysis);
  })
  .catch((error) => {
    console.error(error);
  });
