#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// Help information
const helpText = `
Usage: node populate-templates.js repo_name=<name> title=<title> org=<org>

Variables:
  repo_name  The repository name to use for the package.json (e.g., did-key-test-suite)
  title      The project title/description (e.g., DID Key Test Suite)
  org        The organization or GitHub owner (e.g., w3c)
`;

const args = process.argv.slice(2);
if(args.includes('--help') || args.includes('-h')) {
  console.log(helpText);
  process.exit(0);
}

const variables = {};
args.forEach(arg => {
  const [key, value] = arg.split('=');
  if(key && value !== undefined) {
    variables[key] = value;
  }
});

if(!variables.repo_name || !variables.title || !variables.org) {
  console.error(helpText);
  process.exit(1);
}

function populateTemplateFile(filename, variables) {
  const filePath = path.join(process.cwd(), filename);
  let content = fs.readFileSync(filePath, 'utf8');

  for(const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`\\$\\{${key}\\}`, 'g');
    content = content.replace(regex, value);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`${filename} updated!`);
}

populateTemplateFile('.mocharc.yaml', variables);
populateTemplateFile('package.json', variables);
populateTemplateFile('respecConfig.json', variables);

console.log(`
You should now...
 ☐  update the README.md file,
 ☐  remove populate-templates.js,
 ☐  and commit package-lock.json.`);
