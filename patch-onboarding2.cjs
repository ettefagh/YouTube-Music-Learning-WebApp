const fs = require('fs');
const file = 'piano-companion/src/routes/+page.svelte';
let content = fs.readFileSync(file, 'utf8');

// I replaced `onMount(() => {` multiple times because of the regex flag `/g`, creating duplicate variables. Let's fix this manually.
// First, find the bad duplication and clean it up.
content = content.replace(/let showOnboarding = \$state\(false\);\s*onMount\(\(\) => \{\s*const onboardingComplete = localStorage\.getItem\('onboardingComplete'\);\s*if \(!onboardingComplete\) \{\s*showOnboarding = true;\s*\}/g, 'onMount(() => {');

// Now explicitly insert the code *once*
const correctState = `
  let showOnboarding = $state(false);

  onMount(async () => {
    const onboardingComplete = localStorage.getItem('onboardingComplete');
    if (!onboardingComplete) {
      showOnboarding = true;
    }
`;

content = content.replace(/onMount\(async \(\) => \{/i, correctState);

fs.writeFileSync(file, content);
