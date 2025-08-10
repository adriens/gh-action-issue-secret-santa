const core = require('@actions/core');
const { execSync } = require('child_process');

async function run() {
  try {
    // --- 1. Get inputs ---
    const token = core.getInput('github-token', { required: true });
    const issueTitleTemplate = core.getInput('issue-title');
    const deadline = core.getInput('deadline');
    const budget = core.getInput('budget');
    const currentYear = new Date().getFullYear();
    const issueTitle = issueTitleTemplate.replace('{YEAR}', currentYear);

    // --- 2. Generate the list of participants using git log ---
    core.info('Fetching contributors...');
    const contributorsOutput = execSync(`git log --since="${currentYear}-01-01" --format='%an'`).toString();
    const contributors = [...new Set(contributorsOutput.split('\n'))]
      .filter(name => name && !name.includes('[bot]') && !name.includes('dependabot'))
      .sort();

    let participantsList;
    if (contributors.length === 0) {
      participantsList = '- (No human participants found yet)';
    } else {
      participantsList = contributors.map(name => `- [ ] ${name}`).join('\n');
    }
    core.info(`Found ${contributors.length} potential participants.`);

    // --- 3. Create the Markdown body for the issue ---
    const body = `
# 🎅 Organisation du Secret Santa ${currentYear} 🎄

Bonjour à tous !

Il est temps d'organiser notre traditionnel **Secret Santa** pour célébrer les fêtes de fin d'année et tous les efforts fournis sur ce projet.

## Participants potentiels

Voici la liste des personnes ayant contribué au projet cette année. Merci de confirmer votre participation en cochant la case !

${participantsList}

## Comment participer ?

1.  **Confirmez votre participation** en cochant la case à côté de votre nom.
2.  **(Optionnel)** Ajoutez un commentaire à cette issue avec votre "wishlist" (idées de cadeaux, centres d'intérêt, etc.).

## Date Limite

La date limite pour s'inscrire est le **${deadline}**.

## Tirage au sort et budget

Une fois les inscriptions terminées, un tirage au sort sera effectué. Le budget suggéré est d'environ **${budget}**.

Joyeuses fêtes ! 🎁
`;

    // --- 4. Create the GitHub issue using gh CLI ---
    core.info(`Creating issue with title: "${issueTitle}"`);

    // The GitHub CLI automatically uses the GITHUB_TOKEN from the environment.
    // We pass the body via stdin to avoid issues with special characters.
    const issueUrl = execSync(`gh issue create --title "${issueTitle}" --body-file -`, {
      input: body,
      env: {
        ...process.env,
        GITHUB_TOKEN: token,
      },
    }).toString();

    core.info(`Successfully created issue: ${issueUrl}`);

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
