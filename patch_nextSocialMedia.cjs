const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target1 = `    let nextCash = gameState.cash;
    const hasOFPosts = (nextSocialMedia.onlyfans?.postsCount || 0) > 0;`;

const replacement1 = `    let nextCash = gameState.cash;
    let nextSocialMedia = gameState.socialMedia ? JSON.parse(JSON.stringify(gameState.socialMedia)) : {};
    const hasOFPosts = (nextSocialMedia.onlyfans?.postsCount || 0) > 0;`;

const target2 = `    let nextCompletedEducation = gameState.completedEducation ? [...gameState.completedEducation] : [];
    let nextSocialMedia = gameState.socialMedia ? JSON.parse(JSON.stringify(gameState.socialMedia)) : {};`;

const replacement2 = `    let nextCompletedEducation = gameState.completedEducation ? [...gameState.completedEducation] : [];`;

if (code.includes(target1)) {
  code = code.replace(target1, replacement1);
  code = code.replace(target2, replacement2);
  console.log('Fixed variable ordering');
} else {
  if (code.includes(target1.replace(/\n/g, '\r\n'))) {
    code = code.replace(target1.replace(/\n/g, '\r\n'), replacement1);
    code = code.replace(target2.replace(/\n/g, '\r\n'), replacement2);
    console.log('Fixed variable ordering (CRLF)');
  }
}

fs.writeFileSync('src/App.tsx', code);
